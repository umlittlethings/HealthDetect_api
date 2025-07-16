const framinghamFormula = ({
  age, gender, totalCholesterol,
  hdlCholesterol, systolicBP,
  isSmoker, isDiabetic,
  restingHeartRates 
}) => {
  let score = 0;

  // Calculate average heart rate (tetap seperti sebelumnya)
  let avgHeartRate = null;
  if (Array.isArray(restingHeartRates) && restingHeartRates.length > 0) {
    avgHeartRate = restingHeartRates.reduce((a, b) => a + b, 0) / restingHeartRates.length;
  }

  // Age scoring berdasarkan PDF
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

  // Total Cholesterol scoring berdasarkan PDF
  if (totalCholesterol < 160) {
    score += 0;
  } else if (totalCholesterol >= 160 && totalCholesterol <= 199) {
    score += 4; // sama untuk pria dan wanita
  } else if (totalCholesterol >= 200 && totalCholesterol <= 239) {
    score += gender === "male" ? 7 : 8;
  } else if (totalCholesterol >= 240 && totalCholesterol <= 279) {
    score += gender === "male" ? 9 : 11;
  } else if (totalCholesterol >= 280) {
    score += gender === "male" ? 11 : 13;
  }

  // HDL Cholesterol scoring berdasarkan PDF
  if (hdlCholesterol >= 60) {
    score += -1;
  } else if (hdlCholesterol >= 50 && hdlCholesterol <= 59) {
    score += 0;
  } else if (hdlCholesterol >= 40 && hdlCholesterol <= 49) {
    score += 1;
  } else if (hdlCholesterol < 40) {
    score += 2;
  }

  // Systolic Blood Pressure scoring berdasarkan PDF
  // Asumsi: tanpa pengobatan (bisa disesuaikan dengan menambah parameter isOnMedication)
  if (systolicBP < 120) {
    score += 0;
  } else if (systolicBP >= 120 && systolicBP <= 129) {
    score += 1;
  } else if (systolicBP >= 130 && systolicBP <= 139) {
    score += 2;
  } else if (systolicBP >= 140) {
    score += 3; // tanpa pengobatan
  }

  // Smoking scoring berdasarkan PDF
  if (isSmoker) {
    score += gender === "male" ? 4 : 3;
  }

  // Diabetes scoring berdasarkan PDF
  if (isDiabetic) {
    score += 3;
  }

  return { score, avgHeartRate };
};

module.exports = { framinghamFormula };