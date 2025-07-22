const { User, NutritionData, NutritionResult } = require('../../models');
const { calculateNutrition } = require('../services/nutritionService');

const createNutrition = async (req, res) => {
  try {
    const { userId, name, age, gender, weight, height, activityLevel, stressLevel } = req.body;

    // Cari user dari tabel User
    let user = null;
    if (userId) {
      user = await User.findByPk(userId);
    } else {
      user = await User.findOne({ where: { name, age, gender } });
    }
    if (!user) {
      // Jika user belum ada, buat baru
      user = await User.create({ name, age, gender });
    }

    // Cari NutritionData, jika belum ada, buat baru
    let nutritionData = await NutritionData.findOne({ where: { userId: user.id } });
    if (!nutritionData) {
      nutritionData = await NutritionData.create({
        userId: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        weight,
        height,
        activityLevel,
        stressLevel
      });
    } else {
      // Update data jika sudah ada
      await nutritionData.update({ weight, height, activityLevel, stressLevel });
    }

    // Kalkulasi hasil
    const result = calculateNutrition({
      name: user.name,
      age: user.age,
      gender: user.gender,
      weight,
      height,
      activityLevel,
      stressLevel
    });

    // Simpan hasil
    const nutritionResult = await NutritionResult.create({
      nutritionDataId: nutritionData.id,
      ...result
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
      },
      nutritionData,
      result: nutritionResult
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const getNutritionResult = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId wajib diisi" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const nutritionData = await NutritionData.findOne({ where: { userId } });
    if (!nutritionData) return res.status(404).json({ error: "NutritionData tidak ditemukan" });

    const result = await NutritionResult.findOne({ where: { nutritionDataId: nutritionData.id }, order: [['createdAt', 'DESC']] });
    if (!result) return res.status(404).json({ error: "Hasil kalkulasi tidak ditemukan" });

    res.json({ user, nutritionData, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createNutrition, getNutritionResult };