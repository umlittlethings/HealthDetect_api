require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const framinghamRoute = require('./routes/framinghan');
const ascvdRoute = require('./routes/ascvd');
const nutritionRoute = require('./routes/nutrition');
app.use('/api/framingham', framinghamRoute);
app.use('/api/ascvd', ascvdRoute);
app.use('/api/nutrition', nutritionRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
