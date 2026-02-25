const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Transaction = sequelize.define('transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amountFrom: { type: DataTypes.FLOAT, allowNull: false },
    amountTo: { type: 'DECIMAL(10, 2)', allowNull: false },
});

module.exports = Transaction;