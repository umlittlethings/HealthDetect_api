const { framinghamFormula } = require('../utils/calculateRisk');

const calculateFraminghamScore = (data) => {
  const { score, avgHeartRate } = framinghamFormula(data);

  // Risk level classification berdasarkan PDF
  let riskLevel = "low";
  let riskPercentage = "≤5%";
  
  if (score >= 20) {
    riskLevel = "high";
    riskPercentage = ">15%";
  } else if (score >= 10) {
    riskLevel = "medium";
    riskPercentage = "5-15%";
  } else {
    riskLevel = "low";
    riskPercentage = "≤5%";
  }

  return {
    riskScore: parseFloat(score.toFixed(2)),
    riskLevel,
    riskPercentage,
    avgHeartRate: avgHeartRate ? parseFloat(avgHeartRate.toFixed(2)) : null,
    message: `Pasien memiliki risiko ${riskLevel} (${riskPercentage}) terkena penyakit jantung dalam 10 tahun ke depan.`
  };
};

module.exports = { calculateFraminghamScore };