const framinghamFormula = ({
  age, gender, totalCholesterol,
  hdlCholesterol, systolicBP,
  isSmoker, isDiabetic,
  restingHeartRates 
}) => {
  let score = 0;

  let avgHeartRate = null;
  if (Array.isArray(restingHeartRates) && restingHeartRates.length > 0) {
    avgHeartRate = restingHeartRates.reduce((a, b) => a + b, 0) / restingHeartRates.length;
    
    if (avgHeartRate < 60) {
      score += 1; 
    } else if (avgHeartRate >= 60 && avgHeartRate <= 100) {
      score += 0;
    } else if (avgHeartRate > 100 && avgHeartRate <= 120) {
      score += 2;
    } else if (avgHeartRate > 120) {
      score += 3;
    }
  }


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

  if (totalCholesterol < 160) {
    score += 0;
  } else if (totalCholesterol >= 160 && totalCholesterol <= 199) {
    score += 4; 
  } else if (totalCholesterol >= 200 && totalCholesterol <= 239) {
    score += gender === "male" ? 7 : 8;
  } else if (totalCholesterol >= 240 && totalCholesterol <= 279) {
    score += gender === "male" ? 9 : 11;
  } else if (totalCholesterol >= 280) {
    score += gender === "male" ? 11 : 13;
  }

  if (hdlCholesterol >= 60) {
    score += -1;
  } else if (hdlCholesterol >= 50 && hdlCholesterol <= 59) {
    score += 0;
  } else if (hdlCholesterol >= 40 && hdlCholesterol <= 49) {
    score += 1;
  } else if (hdlCholesterol < 40) {
    score += 2;
  }

  if (systolicBP < 120) {
    score += 0;
  } else if (systolicBP >= 120 && systolicBP <= 129) {
    score += 1;
  } else if (systolicBP >= 130 && systolicBP <= 139) {
    score += 2;
  } else if (systolicBP >= 140) {
    score += 3; 
  }

  if (isSmoker) {
    score += gender === "male" ? 4 : 3;
  }

  if (isDiabetic) {
    score += 3;
  }

  return { score, avgHeartRate };
};

module.exports = { framinghamFormula };
