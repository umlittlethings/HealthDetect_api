require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const framinghamRoute = require('./routes/framinghan');
app.use('/api/framingham', framinghamRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
