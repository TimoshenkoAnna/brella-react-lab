const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Currency = sequelize.define('currency', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Currency;