const { calculateFraminghamScore } = require('../services/framinghamService');

const calculateFraminghamHandler = (req, res) => {
  try {
    const { user, ...data } = req.body; // Extract user and other data
    const result = calculateFraminghamScore(data);
    res.json({ user, ...result }); // Include user in the response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { calculateFraminghamHandler };