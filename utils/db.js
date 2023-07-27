const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('driveReport', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;