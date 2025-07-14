const { framinghamFormula } = require('../utils/calculateRisk');

const calculateFraminghamScore = (data) => {
  const score = framinghamFormula(data);

  let riskLevel = "low";
  if (score >= 20) riskLevel = "high";
  else if (score >= 10) riskLevel = "medium";

  return {
    riskScore: parseFloat(score.toFixed(2)),
    riskLevel,
    message: `Pasien memiliki risiko ${riskLevel} terkena penyakit jantung.`
  };
};

module.exports = { calculateFraminghamScore };
