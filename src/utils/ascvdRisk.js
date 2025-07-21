const ascvdScore = ({
  age, gender, race, totalCholesterol,
  hdlCholesterol, systolicBP, isSmoker, isDiabetic
}) => {
  let score = 0;

  // Usia
  if (age >= 20 && age <= 39) score += 0;
  else if (age >= 40 && age <= 59) score += 2;
  else if (age >= 60) score += 4;

  // Gender
  if (gender === 'male') score += 1;

  // Ras
  if (race && race.toLowerCase().includes('afrika')) score += 1;

  // Kolesterol Total
  if (totalCholesterol < 170) score += 0;
  else if (totalCholesterol <= 199) score += 2;
  else if (totalCholesterol >= 200) score += 3;

  // HDL
  if (hdlCholesterol >= 60) score += -1;
  else if (hdlCholesterol >= 40) score += 0;
  else score += 2;

  // Tekanan darah sistolik
  if (systolicBP < 120) score += 0;
  else if (systolicBP <= 139) score += 1;
  else score += 2;

  // Merokok
  if (isSmoker) score += 2;

  // Diabetes
  if (isDiabetic) score += 3;

  // Kategori
  let level = 'low', message = 'Risiko Rendah (0-5%)';
  if (score > 10) { level = 'high'; message = 'Risiko Tinggi (>15%)'; }
  else if (score > 5) { level = 'medium'; message = 'Risiko Sedang (6-15%)'; }

  return { score, level, message };
};

module.exports = { ascvdScore };