const { calculateFraminghamScore } = require('../services/framinghamService');
const { User, HealthData, RiskAssessment } = require('../../models');

const calculateFraminghamHandler = async (req, res) => {
  try {
    const { name, age, gender, totalCholesterol, hdlCholesterol, systolicBP, isSmoker, isDiabetic, restingHeartRates } = req.body;

    // Hitung skor
    const result = calculateFraminghamScore({ age, gender, totalCholesterol, hdlCholesterol, systolicBP, isSmoker, isDiabetic, restingHeartRates });

    // Simpan ke tabel Users
    const user = await User.create({ name, age, gender });

    // Simpan ke tabel HealthData
    const healthData = await HealthData.create({
      userId: user.id,
      totalCholesterol,
      hdlCholesterol,
      systolicBP,
      isSmoker,
      isDiabetic,
      avgHeartRate: result.avgHeartRate,
    });

    // Simpan ke tabel RiskAssessments
    const riskAssessment = await RiskAssessment.create({
      userId: user.id,
      healthDataId: healthData.id,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      riskPercentage: result.riskPercentage,
      message: result.message,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
      },
      risk: {
        ...result,
        assessmentDate: riskAssessment.assessmentDate,
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { calculateFraminghamHandler };