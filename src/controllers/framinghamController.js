const { calculateFraminghamScore } = require('../services/framinghamService');
const { FraminghamData } = require('../../models');

const calculateFraminghamHandler = async (req, res) => {
  try {
    const { user, ...data } = req.body; // Extract user and other data
    const result = calculateFraminghamScore(data);

    // Save input and result to database
    await FraminghamData.create({
      user,
      ...data,
      avgHeartRate: result.avgHeartRate, 
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      riskPercentage: result.riskPercentage,
      message: result.message,
    });

    res.json({ user, ...result }); // Include user in the response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { calculateFraminghamHandler };