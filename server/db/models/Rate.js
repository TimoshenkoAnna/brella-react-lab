const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Rate = sequelize.define('rate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = Rate;