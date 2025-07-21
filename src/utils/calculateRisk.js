const framinghamFormula = ({
  age, gender, totalCholesterol,
  hdlCholesterol, systolicBP,
  isSmoker, isDiabetic,
  restingHeartRates
}) => {
  let score = 0;
  let flags = [];

  let avgHeartRate = null;
  if (Array.isArray(restingHeartRates) && restingHeartRates.length > 0) {
    avgHeartRate = restingHeartRates.reduce((a, b) => a + b, 0) / restingHeartRates.length;

    if (avgHeartRate > 120) {
      score += 2; // Takikardia berat
      flags.push("HR > 120 bpm: takikardia berat, evaluasi lanjut disarankan");
    } else if (avgHeartRate > 100 && systolicBP >= 140) {
      score += 2; // Takikardia + hipertensi
      flags.push("HR > 100 & SBP ≥ 140: potensi tekanan kardiovaskular tinggi");
    } else if (avgHeartRate > 100 && systolicBP >= 130) {
      score += 1; // Takikardia ringan + prehipertensi
      flags.push("HR > 100 & SBP ≥ 130: takikardia ringan dengan prehipertensi");
    } else if (avgHeartRate < 60 && systolicBP < 100) {
      score += 1; // Bradikardia + hipotensi
      flags.push("HR < 60 & SBP < 100: bradikardia dengan tekanan darah rendah");
    }
  }

  // Skor usia
  if (age >= 20 && age <= 34) {
    score += gender === "male" ? -9 : -7;
  } else if (age >= 35 && age <= 39) {
    score += gender === "male" ? -4 : -3;
  } else if (age >= 40 && age <= 44) {
    score += 0;
  } else if (age >= 45 && age <= 49) {
    score += 3;
  } else if (age >= 50 && age <= 54) {
    score += 6;
  } else if (age >= 55 && age <= 59) {
    score += 8;
  } else if (age >= 60) {
    score += 10;
  }

  // Skor total kolesterol
  if (totalCholesterol < 160) {
    score += 0;
  } else if (totalCholesterol <= 199) {
    score += 4;
  } else if (totalCholesterol <= 239) {
    score += gender === "male" ? 7 : 8;
  } else if (totalCholesterol <= 279) {
    score += gender === "male" ? 9 : 11;
  } else {
    score += gender === "male" ? 11 : 13;
  }

  // Skor HDL kolesterol
  if (hdlCholesterol >= 60) {
    score += -1;
  } else if (hdlCholesterol >= 50) {
    score += 0;
  } else if (hdlCholesterol >= 40) {
    score += 1;
  } else {
    score += 2;
  }

  // Skor tekanan darah sistolik (tanpa pengobatan)
  if (systolicBP < 120) {
    score += 0;
  } else if (systolicBP <= 129) {
    score += 1;
  } else if (systolicBP <= 139) {
    score += 2;
  } else {
    score += 3; // diasumsikan tanpa pengobatan, +4 jika dengan pengobatan
  }

  // Skor merokok
  if (isSmoker) {
    score += gender === "male" ? 4 : 3;
  }

  // Skor diabetes
  if (isDiabetic) {
    score += 3;
  }

  // Estimasi risiko berdasarkan total skor
  let riskCategory = "Rendah";
  if (score >= 20) {
    riskCategory = "Tinggi";
  } else if (score >= 10) {
    riskCategory = "Sedang";
  }

  return {
    score,
    avgHeartRate: avgHeartRate ?? null,
    riskCategory,
    flags,
  };
};

module.exports = { framinghamFormula };
