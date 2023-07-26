require('dotenv').config();
const express = require('express');

const { report } = require('./routes/report');

const app = express()

app.use('/', report);

app.listen(3000);
