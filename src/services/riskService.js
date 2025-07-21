const { framinghamFormula } = require('../utils/calculateRisk');
const { ascvdScore } = require('../utils/ascvdRisk');

const calculateRiskScores = (data) => {
  const { score, avgHeartRate } = framinghamFormula(data);
  let riskLevel = "low";
  let riskPercentage = "≤5%";
  if (score >= 20) {
    riskLevel = "high";
    riskPercentage = ">15%";
  } else if (score >= 10) {
    riskLevel = "medium";
    riskPercentage = "5-15%";
  }

  // ASCVD
  const ascvd = ascvdScore(data);

  return {
    framingham: {
      riskScore: parseFloat(Math.max(0, score).toFixed(2)),
      riskLevel,
      riskPercentage,
      avgHeartRate: avgHeartRate ? parseFloat(avgHeartRate.toFixed(2)) : null,
      message: `Framingham: Pasien memiliki risiko ${riskLevel} (${riskPercentage}) terkena penyakit jantung dalam 10 tahun ke depan.`
    },
    ascvd: {
      ascvdScore: ascvd.score,
      ascvdLevel: ascvd.level,
      ascvdMessage: `ASCVD: ${ascvd.message}`
    }
  };
};

module.exports = { calculateRiskScores };