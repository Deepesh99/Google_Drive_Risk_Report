const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const UserAuth = sequelize.define('userauth', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authCred: {
      type: DataTypes.JSON,
      allowNull: false,
  },
});

module.exports = UserAuth;
