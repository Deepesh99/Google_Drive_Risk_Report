require('dotenv').config();
const express = require('express');
const db = require('./utils/db');

const report  = require('./routes/report');

const app = express()

app.use('/', report);

db
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log("db connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
