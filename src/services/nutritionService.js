function calculateNutrition({
  name, age, gender, weight, height, activityLevel, stressLevel
}) {
  // BMI
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let bmiCategory = 'Normal';
  if (bmi < 17) bmiCategory = 'Sangat kurus';
  else if (bmi < 18.5) bmiCategory = 'Kurus';
  else if (bmi <= 25) bmiCategory = 'Normal';
  else if (bmi <= 27) bmiCategory = 'Gemuk (overweight)';
  else bmiCategory = 'Gemuk (obesitas)';

  // Berat badan ideal
  let idealWeight;
  if ((age >= 60) || (height <= 150)) {
    idealWeight = height - 100;
  } else {
    idealWeight = (height - 100) - 0.1 * (height - 100);
  }

  // BMR (Harris Benedict)
  let bmr;
  if (gender === 'male') {
    bmr = 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age);
  } else {
    bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
  }

  // Faktor aktivitas
  const activityFactors = { bedrest: 1.2, ringan: 1.3, sedang: 1.4, berat: 1.5 };
  const stressFactors = { ringan: 1.2, sedang: 1.3, berat: 1.5 };
  const activityF = activityFactors[activityLevel] || 1.2;
  const stressF = stressFactors[stressLevel] || 1.2;

  // TEE
  const tee = bmr * activityF * stressF;

  // Protein
  const proteinGram = 0.8 * weight;
  const proteinKcal = proteinGram * 4;
  const proteinPercent = (proteinKcal / tee) * 100;

  // Lemak
  const fatKcal = 0.25 * tee;
  const fatGram = fatKcal / 9;
  const fatPercent = 25;

  // Karbohidrat
  const carbPercent = 100 - proteinPercent - fatPercent;
  const carbKcal = (carbPercent / 100) * tee;
  const carbGram = carbKcal / 4;

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    bmiCategory,
    idealWeight: parseFloat(idealWeight.toFixed(2)),
    bmr: parseFloat(bmr.toFixed(2)),
    tee: parseFloat(tee.toFixed(2)),
    proteinGram: parseFloat(proteinGram.toFixed(2)),
    proteinKcal: parseFloat(proteinKcal.toFixed(2)),
    proteinPercent: parseFloat(proteinPercent.toFixed(2)),
    fatGram: parseFloat(fatGram.toFixed(2)),
    fatKcal: parseFloat(fatKcal.toFixed(2)),
    fatPercent: parseFloat(fatPercent.toFixed(2)),
    carbGram: parseFloat(carbGram.toFixed(2)),
    carbKcal: parseFloat(carbKcal.toFixed(2)),
    carbPercent: parseFloat(carbPercent.toFixed(2)),
  };
}

module.exports = { calculateNutrition };