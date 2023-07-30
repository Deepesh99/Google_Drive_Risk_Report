require('dotenv').config();
const express = require('express');
const db = require('./utils/db');

const report  = require('./routes/report');

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/', report);

db
  .sync()
  .then(() => {
    console.log("db connected");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.error(err);
  });
