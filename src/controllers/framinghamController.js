const { calculateRiskScores } = require('../services/framinghamService');
const { User, HealthData, RiskAssessment } = require('../../models');

const calculateFraminghamHandler = async (req, res) => {
  try {
    const { name, age, gender, totalCholesterol, hdlCholesterol, systolicBP, isSmoker, isDiabetic, restingHeartRates, race } = req.body;

    const result = calculateRiskScores({ age, gender, totalCholesterol, hdlCholesterol, systolicBP, isSmoker, isDiabetic, restingHeartRates, race });

    const user = await User.create({ name, age, gender });

    const healthData = await HealthData.create({
      userId: user.id,
      totalCholesterol,
      hdlCholesterol,
      systolicBP,
      isSmoker,
      isDiabetic,
      avgHeartRate: result.framingham.avgHeartRate,
      race,
    });

    const riskAssessment = await RiskAssessment.create({
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
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { calculateFraminghamHandler };