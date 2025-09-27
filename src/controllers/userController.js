const { User, RiskAssessment, NutritionData, NutritionResult, HealthData, sequelize } = require('../../models');
const { calculateRiskScores } = require('../services/riskService');
const { calculateNutrition } = require('../services/nutritionService');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsersFull = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: RiskAssessment,
          as: 'riskAssessments',
          order: [['assessmentDate', 'DESC']],
          limit: 1
        },
        {
          model: NutritionData,
          as: 'nutritionData',
          include: [
            {
              model: NutritionResult,
              as: 'result'
              // HAPUS limit dan order di sini!
            }
          ]
        }
      ]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Function to auto-calculate risk assessments after creating health data
const autoCalculateRiskAssessments = async (user, healthData, nutritionInput = {}) => {
  try {
    // Calculate risk scores using the same service
    const result = calculateRiskScores({
      age: user.age,
      gender: user.gender,
      totalCholesterol: healthData.totalCholesterol,
      hdlCholesterol: healthData.hdlCholesterol,
      systolicBP: healthData.systolicBP,
      isSmoker: healthData.isSmoker,
      isDiabetic: healthData.isDiabetic,
      restingHeartRates: [], // Default empty array
      race: healthData.race
    });

    // Update avgHeartRate in health data
    await healthData.update({
      avgHeartRate: result.framingham.avgHeartRate,
    });

    // Create or update risk assessment
    let riskAssessment = await RiskAssessment.findOne({
      where: { userId: user.id },
      order: [['assessmentDate', 'DESC']]
    });

    if (riskAssessment) {
      // Update existing assessment
      await riskAssessment.update({
        healthDataId: healthData.id,
        framinghamScore: result.framingham.riskScore,
        framinghamLevel: result.framingham.riskLevel,
        framinghamPercentage: result.framingham.riskPercentage,
        framinghamMessage: result.framingham.message,
        ascvdScore: result.ascvd.ascvdScore,
        ascvdLevel: result.ascvd.ascvdLevel,
        ascvdMessage: result.ascvd.ascvdMessage,
      });
    } else {
      // Create new assessment
      riskAssessment = await RiskAssessment.create({
        userId: user.id,
        healthDataId: healthData.id,
        framinghamScore: result.framingham.riskScore,
        framinghamLevel: result.framingham.riskLevel,
        framinghamPercentage: result.framingham.riskPercentage,
        framinghamMessage: result.framingham.message,
        ascvdScore: result.ascvd.ascvdScore,
        ascvdLevel: result.ascvd.ascvdLevel,
        ascvdMessage: result.ascvd.ascvdMessage,
      });
    }

    // Create basic nutrition data entry (can be expanded later)
    let nutritionData = await NutritionData.findOne({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']]
    });

    if (!nutritionData) {
      // Create nutrition data with provided fields
      nutritionData = await NutritionData.create({
        userId: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        weight: nutritionInput.weight,
        height: nutritionInput.height,
        activityLevel: nutritionInput.activityLevel || 'ringan',
        stressLevel: nutritionInput.stressLevel || 'ringan'
      });

      // If we have weight and height, calculate nutrition results
      if (nutritionInput.weight && nutritionInput.height) {
        const nutritionResults = calculateNutrition({
          name: user.name,
          age: user.age,
          gender: user.gender,
          weight: nutritionInput.weight,
          height: nutritionInput.height,
          activityLevel: nutritionInput.activityLevel || 'ringan',
          stressLevel: nutritionInput.stressLevel || 'ringan'
        });

        // Create nutrition result
        await NutritionResult.create({
          nutritionDataId: nutritionData.id,
          bmi: nutritionResults.bmi,
          bmiCategory: nutritionResults.bmiCategory,
          idealWeight: nutritionResults.idealWeight,
          bmr: nutritionResults.bmr,
          tee: nutritionResults.tee,
          proteinGram: nutritionResults.proteinGram,
          proteinKcal: nutritionResults.proteinKcal,
          proteinPercent: nutritionResults.proteinPercent,
          fatGram: nutritionResults.fatGram,
          fatKcal: nutritionResults.fatKcal,
          fatPercent: nutritionResults.fatPercent,
          carbGram: nutritionResults.carbGram,
          carbKcal: nutritionResults.carbKcal,
          carbPercent: nutritionResults.carbPercent
        });
      }
    }

    return {
      riskAssessment,
      nutritionData,
      framinghamResult: result.framingham,
      ascvdResult: result.ascvd
    };

  } catch (error) {
    console.error(`❌ Error in autoCalculateRiskAssessments for ${user.name}:`, error);
    throw error;
  }
};

const uploadSpreadsheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = path.resolve(req.file.path);

    // Baca file Excel/CSV
    const workbook = XLSX.readFile(filePath, { type: 'file' });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    let imported = 0, ignored = 0;

    console.log(`🔄 Processing ${rows.length} rows from ${req.file.filename}...`);

    // Header row 1 berisi data user (Nama, Usia, Jenis Kelamin, dll)
    // Header row 2 berisi data kesehatan (Tekanan Darah, Kolesterol, dll)
    let userHeaderRow = rows[1]; // Row 1: Nama, Usia, Jenis Kelamin
    let healthHeaderRow = rows[2]; // Row 2: Tekanan Darah, Kolesterol, HDL
    
    console.log('📊 User Header Row:', userHeaderRow);
    console.log('📊 Health Header Row:', healthHeaderRow);
    
    // Buat mapping untuk data user
    const userColumnMap = {};
    userHeaderRow.forEach((header, index) => {
      if (header && typeof header === 'string') {
        userColumnMap[header.trim()] = index;
      }
    });
    
    // Buat mapping untuk data kesehatan
    const healthColumnMap = {};
    healthHeaderRow.forEach((header, index) => {
      if (header && typeof header === 'string') {
        healthColumnMap[header.trim()] = index;
      }
    });
    
    // Data dimulai dari row 3 (index 3)
    const dataStartIndex = 3;

    for (let i = dataStartIndex; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (!row || row.length === 0 || !row[1]) {
        ignored++;
        continue;
      }
      
      try {
        // Get user basic data
        const nama = row[userColumnMap['Nama']];
        const usia = row[userColumnMap['Usia (tahun)']];
        const jenisKelamin = row[userColumnMap['Jenis Kelamin']];
        
        // Get nutrition data
        const weight = row[userColumnMap['Berat Badan'] || userColumnMap['BB'] || userColumnMap['Weight']];
        const height = row[userColumnMap['Tinggi Badan'] || userColumnMap['TB'] || userColumnMap['Height']];
        const activityLevel = row[userColumnMap['Aktivitas'] || userColumnMap['Activity Level']] || 'ringan';
        const stressLevel = row[userColumnMap['Stress'] || userColumnMap['Stress Level']] || 'ringan';
        
        // Skip if no name or age
        if (!nama || !usia) {
          ignored++;
          continue;
        }

        // Parse age
        let age = parseInt(usia);
        if (isNaN(age) || age < 18 || age > 120) {
          ignored++;
          continue;
        }

        // Parse gender
        let gender = null;
        if (jenisKelamin) {
          const genderText = jenisKelamin.toString().toLowerCase();
          if (genderText.includes('laki') || genderText === 'male') {
            gender = 'male';
          } else if (genderText.includes('perempuan') || genderText === 'female') {
            gender = 'female';
          }
        }
        
        if (!gender) {
          ignored++;
          continue;
        }

        // Parse weight and height
        let weightValue = parseFloat(weight);
        let heightValue = parseFloat(height);
        
        console.log(`🔢 Parsed values for ${nama}:`, { 
          weightValue,
          heightValue,
          activityLevel,
          stressLevel
        });

        // Convert data from Excel to match database structure
        const userData = {
          name: nama.toString().trim(),
          age: age,
          gender: gender
        };

        // Create or find user
        let user = await User.findOne({
          where: {
            name: userData.name,
            age: userData.age,
            gender: userData.gender
          }
        });

        if (!user) {
          try {
            user = await User.create(userData);
            console.log(`✅ Created new user: ${userData.name}`);
          } catch (userErr) {
            console.error(`❌ Failed to create user ${userData.name}:`, userErr.message);
            ignored++;
            continue;
          }
        }

        // Process health data if available
        let hasHealthData = false;
        const healthDataInput = {};

        // Parse tekanan darah
        const tekananDarah = row[healthColumnMap['Tekanan Darah (mmHg)']];
        if (tekananDarah && tekananDarah.toString().trim() !== '') {
          const bpText = tekananDarah.toString().trim();
          if (bpText.includes('/')) {
            const systolicBP = parseInt(bpText.split('/')[0]);
            if (!isNaN(systolicBP) && systolicBP >= 80 && systolicBP <= 200) {
              healthDataInput.systolicBP = systolicBP;
              hasHealthData = true;
            }
          }
        }

        // Parse kolesterol total
        const kolesterolTotal = row[healthColumnMap['Kolesterol Total']];
        if (kolesterolTotal && kolesterolTotal.toString().trim() !== '') {
          const totalChol = parseFloat(kolesterolTotal.toString().replace(',', '.'));
          if (!isNaN(totalChol) && totalChol >= 100 && totalChol <= 400) {
            healthDataInput.totalCholesterol = totalChol;
            hasHealthData = true;
          }
        }

        // Parse HDL
        const hdl = row[healthColumnMap['HDL']];
        if (hdl && hdl.toString().trim() !== '') {
          const hdlValue = parseFloat(hdl.toString().replace(',', '.'));
          if (!isNaN(hdlValue) && hdlValue >= 20 && hdlValue <= 100) {
            healthDataInput.hdlCholesterol = hdlValue;
            hasHealthData = true;
          }
        }

        // Parse smoking status (dari user column)
        const riwayatPerokok = row[userColumnMap['Riwayat Perokok']];
        if (riwayatPerokok) {
          const smokerText = riwayatPerokok.toString().toLowerCase();
          healthDataInput.isSmoker = smokerText === 'ya' || smokerText === 'yes' || smokerText === 'true';
        }

        // Parse diabetes status (dari health column)
        const diabetesMelitus = row[healthColumnMap['Diabetes Melitus']];
        if (diabetesMelitus) {
          const diabetesText = diabetesMelitus.toString().toLowerCase();
          healthDataInput.isDiabetic = diabetesText === 'ya' || diabetesText === 'yes' || diabetesText === 'true';
        }

      // Parse race (dari user column)
      const ras = row[userColumnMap['Ras']];
      if (ras) {
        healthDataInput.race = ras.toString().trim();
      }

      // Will handle nutrition data parsing later                // Prepare nutrition data
        const nutritionInput = {};
        
        // Parse weight
        const beratBadan = row[userColumnMap['Berat Badan (kg)']];
        if (beratBadan && beratBadan.toString().trim() !== '') {
          const weight = parseFloat(beratBadan.toString().replace(',', '.'));
          if (!isNaN(weight) && weight > 0) {
            nutritionInput.weight = weight;
          }
        }

        // Parse height
        const tinggiBadan = row[userColumnMap['Tinggi Badan (cm)']];
        if (tinggiBadan && tinggiBadan.toString().trim() !== '') {
          const height = parseFloat(tinggiBadan.toString().replace(',', '.'));
          if (!isNaN(height) && height > 0) {
            nutritionInput.height = height;
          }
        }

        // Parse activity level
        const levelAktivitas = row[userColumnMap['Level Aktivitas']];
        if (levelAktivitas && levelAktivitas.toString().trim() !== '') {
          const activityText = levelAktivitas.toString().toLowerCase().trim();
          if (['bedrest', 'ringan', 'sedang', 'berat'].includes(activityText)) {
            nutritionInput.activityLevel = activityText;
          }
        }

        // Parse stress level
        const levelStress = row[userColumnMap['Level Stress']];
        if (levelStress && levelStress.toString().trim() !== '') {
          const stressText = levelStress.toString().toLowerCase().trim();
          if (['ringan', 'sedang', 'berat'].includes(stressText)) {
            nutritionInput.stressLevel = stressText;
          }
        }

        // Only create health data if we have at least one valid field
        if (hasHealthData) {
          try {
            console.log(`Creating health data for: ${userData.name}`);
            const healthData = await HealthData.create({
              ...healthDataInput,
              userId: user.id
            });
            console.log(`✅ Created health data for: ${userData.name}`);

            // Auto calculate risk assessments with nutrition data
            await autoCalculateRiskAssessments(user, healthData, nutritionInput);
          } catch (healthErr) {
            console.error(`❌ Failed to create health data for ${userData.name}:`, healthErr.message);
            ignored++;
            continue;
          }
        }

        imported++;

      } catch (rowErr) {
        console.error(`❌ Error processing row ${i + 1}:`, rowErr);
        ignored++;
        continue;
      }
    }

    // Clean up and send response
    fs.unlinkSync(filePath);
    console.log(`Upload completed: ${imported} imported, ${ignored} ignored`);
    res.json({ imported, ignored });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getAllUsersFull, uploadSpreadsheet };