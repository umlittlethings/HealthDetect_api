const { calculateRiskScores } = require('../services/riskService');
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
      framinghamMessage: result.framingham.message, // <-- perbaiki di sini
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