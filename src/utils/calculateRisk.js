const framinghamFormula = ({
  age, gender, totalCholesterol,
  hdlCholesterol, systolicBP,
  isSmoker, isDiabetic
}) => {
  let score = 0;

  if (gender === "male") {
    score += age * 3.06;
    score += totalCholesterol * 1.02;
    score -= hdlCholesterol * 0.90;
    score += systolicBP * 1.20;
    if (isSmoker) score += 2;
    if (isDiabetic) score += 2;
  } else {
    score += age * 2.70;
    score += totalCholesterol * 1.10;
    score -= hdlCholesterol * 0.80;
    score += systolicBP * 1.15;
    if (isSmoker) score += 3;
    if (isDiabetic) score += 2.5;
  }

  return score;
};

module.exports = { framinghamFormula };
