const { calculateRiskScores } = require('../services/riskService');
const { User, HealthData, RiskAssessment } = require('../../models');

const calculateFraminghamHandler = async (req, res) => {
  try {
    const { name, age, gender, totalCholesterol, hdlCholesterol, systolicBP, isSmoker, isDiabetic, restingHeartRates, race } = req.body;

    console.log('🔍 Calculating risk for:', { name, age, gender });

    // Cari user yang sudah ada berdasarkan name, age, gender
    let user = await User.findOne({
      where: { name, age, gender }
    });

    let healthData = null;

    if (user) {
      console.log('✅ Found existing user:', user.id);
      // Cari health data terbaru untuk user ini
      healthData = await HealthData.findOne({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']]
      });

      if (healthData) {
        console.log('✅ Found existing health data:', healthData.id);
        // Update health data dengan data terbaru
        await healthData.update({
          totalCholesterol,
          hdlCholesterol,
          systolicBP,
          isSmoker,
          isDiabetic,
          race,
        });
        console.log('✅ Updated existing health data');
      } else {
        console.log('⚠️ No health data found, creating new one');
        // Buat health data baru
        healthData = await HealthData.create({
          userId: user.id,
          totalCholesterol,
          hdlCholesterol,
          systolicBP,
          isSmoker,
          isDiabetic,
          race,
        });
        console.log('✅ Created new health data:', healthData.id);
      }
    } else {
      console.log('⚠️ User not found, creating new user and health data');
      // Buat user baru
      user = await User.create({ name, age, gender });
      console.log('✅ Created new user:', user.id);

      // Buat health data baru
      healthData = await HealthData.create({
        userId: user.id,
        totalCholesterol,
        hdlCholesterol,
        systolicBP,
        isSmoker,
        isDiabetic,
        race,
      });
      console.log('✅ Created new health data:', healthData.id);
    }

    // Hitung risk scores
    const result = calculateRiskScores({ age, gender, totalCholesterol, hdlCholesterol, systolicBP, isSmoker, isDiabetic, restingHeartRates, race });

    // Update avgHeartRate di health data
    await healthData.update({
      avgHeartRate: result.framingham.avgHeartRate,
    });

    // Buat atau update risk assessment
    let riskAssessment = await RiskAssessment.findOne({
      where: { userId: user.id },
      order: [['assessmentDate', 'DESC']]
    });

    if (riskAssessment) {
      // Update assessment yang sudah ada
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
      console.log('✅ Updated existing risk assessment');
    } else {
      // Buat assessment baru
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
      console.log('✅ Created new risk assessment');
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        race: race || null,
      },
      framingham: {
        ...result.framingham,
        assessmentDate: riskAssessment.assessmentDate,
      },
      ascvd: {
        ...result.ascvd,
        assessmentDate: riskAssessment.assessmentDate,
      }
    });
  } catch (error) {
    console.error('❌ Error in calculateFraminghamHandler:', error);
    res.status(400).json({ error: error.message });
  }
};

// GET risk assessment by userId and type (framingham/ascvd)
const getRiskByUser = async (req, res) => {
  try {
    const { userId, type } = req.query;
    if (!userId || !type) {
      return res.status(400).json({ error: "userId dan type (framingham/ascvd) wajib diisi" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const risk = await RiskAssessment.findOne({
      where: { userId },
      order: [['assessmentDate', 'DESC']]
    });

    if (!risk) return res.status(404).json({ error: "Risk assessment tidak ditemukan" });

    if (type === "framingham") {
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          gender: user.gender
        },
        framingham: {
          score: risk.framinghamScore,
          level: risk.framinghamLevel,
          percentage: risk.framinghamPercentage,
          message: risk.framinghamMessage,
          assessmentDate: risk.assessmentDate
        }
      });
    } else if (type === "ascvd") {
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          gender: user.gender
        },
        ascvd: {
          score: risk.ascvdScore,
          level: risk.ascvdLevel,
          message: risk.ascvdMessage,
          assessmentDate: risk.assessmentDate
        }
      });
    } else {
      return res.status(400).json({ error: "type harus framingham atau ascvd" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateRiskByUser = async (req, res) => {
  try {
    const { userId, type } = req.query;
    const updateData = req.body;
    if (!userId || !type) {
      return res.status(400).json({ error: "userId dan type (framingham/ascvd) wajib diisi" });
    }

    const risk = await RiskAssessment.findOne({
      where: { userId },
      order: [['assessmentDate', 'DESC']]
    });

    if (!risk) return res.status(404).json({ error: "Risk assessment tidak ditemukan" });

    if (type === "framingham") {
      await risk.update({
        framinghamScore: updateData.framinghamScore ?? risk.framinghamScore,
        framinghamLevel: updateData.framinghamLevel ?? risk.framinghamLevel,
        framinghamPercentage: updateData.framinghamPercentage ?? risk.framinghamPercentage,
        framinghamMessage: updateData.framinghamMessage ?? risk.framinghamMessage,
      });
    } else if (type === "ascvd") {
      await risk.update({
        ascvdScore: updateData.ascvdScore ?? risk.ascvdScore,
        ascvdLevel: updateData.ascvdLevel ?? risk.ascvdLevel,
        ascvdMessage: updateData.ascvdMessage ?? risk.ascvdMessage,
      });
    } else {
      return res.status(400).json({ error: "type harus framingham atau ascvd" });
    }

    res.json({ message: "Risk assessment berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRiskByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId wajib diisi" });
    }

    const risk = await RiskAssessment.findOne({
      where: { userId },
      order: [['assessmentDate', 'DESC']]
    });

    if (!risk) return res.status(404).json({ error: "Risk assessment tidak ditemukan" });

    await risk.destroy();
    res.json({ message: "Risk assessment berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  calculateFraminghamHandler,
  getRiskByUser,
  updateRiskByUser,
  deleteRiskByUser
};