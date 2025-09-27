require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const framinghamRoute = require('./routes/framinghan');
const ascvdRoute = require('./routes/ascvd');
const nutritionRoute = require('./routes/nutrition');
const userRoute = require('./routes/user');
app.use('/api/users', userRoute);
app.use('/api/framingham', framinghamRoute);
app.use('/api/ascvd', ascvdRoute);
app.use('/api/nutrition', nutritionRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
