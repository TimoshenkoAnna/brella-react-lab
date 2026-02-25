const Currency = require('./Currency');
const Rate = require('./Rate');
const Transaction = require('./Transaction');

Currency.hasMany(Rate, { as: 'fromRates', foreignKey: 'fromCurrencyId' });
Currency.hasMany(Rate, { as: 'toRates', foreignKey: 'toCurrencyId' });
Rate.belongsTo(Currency, { as: 'fromCurrency', foreignKey: 'fromCurrencyId' });
Rate.belongsTo(Currency, { as: 'toCurrency', foreignKey: 'toCurrencyId' });

Rate.hasMany(Transaction, { foreignKey: 'rateId' });
Transaction.belongsTo(Rate, { foreignKey: 'rateId' });

module.exports = {
    Currency,
    Rate,
    Transaction
};