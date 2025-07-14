const { calculateFraminghamScore } = require('../services/framinghamService');

const calculateFraminghamHandler = (req, res) => {
  try {
    const result = calculateFraminghamScore(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { calculateFraminghamHandler };
