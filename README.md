# 🩺 HealthDetect API

API untuk menghitung risiko penyakit jantung (**Framingham** & **ASCVD**) dan kalkulasi status gizi/energi (**Nutrition**) berbasis Node.js + Express.

---

## 🚀 Features

- Hitung skor risiko penyakit jantung (Framingham & ASCVD)
- Hitung status gizi, BMI, berat badan ideal, BMR, TEE, kebutuhan protein/lemak/karbohidrat harian
- API RESTful:
  - `POST /api/framingham` & `POST /api/ascvd` untuk simpan/hitung risiko
  - `GET /api/framingham/user?userId=...` & `GET /api/ascvd/user?userId=...` untuk ambil data risiko user
  - `PUT` & `DELETE` endpoint untuk update/hapus data risiko
  - `POST /api/nutrition` untuk kalkulasi gizi, `GET /api/nutrition/result?userId=...` untuk hasil gizi user
- Data user terpusat, relasi ke data risiko dan gizi
- Modular & clean code structure (routes, controllers, services, utils)
- CORS enabled — siap diakses oleh frontend/mobile app
- Mudah dikembangkan lebih lanjut (misal: histori, dashboard, dsb)

---

## 📂 Folder Structure

```
src/
  server.js
  config/
    config.js
  controllers/
    riskController.js
    nutritionContoller.js
  routes/
    framinghan.js
    ascvd.js
    nutrition.js
  services/
    riskService.js
    nutritionService.js
  utils/
    calculateRisk.js
    ascvdRisk.js
```

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize** (PostgreSQL)
- **dotenv**
- **CORS**
- (Optional Dev) **Nodemon**

---

## 📖 Documentation

Lihat dokumentasi endpoint di [framinghamdocs](https://framinghamdocs.netlify.app/)

---

## 🏁 Getting Started

1. Install dependencies:  
   `npm install`
2. Setup database & environment variables (`.env`)
3. Jalankan migration:  
   `npx sequelize-cli db:migrate`
4. Start server:  
   `npm start`
5. Cek endpoint di browser atau pakai curl/Postman

---

## 👨‍💻 Author

Wayan Christian Pradayana  
Informatics Engineering, Universitas Brawijaya  
[chrispradayana@gmail.com](mailto:chrispradayana@gmail.com)

---
