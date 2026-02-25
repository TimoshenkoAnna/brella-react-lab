const { Transaction, Rate, Currency } = require('../db/models/models');
const { Op } = require('sequelize');

class TransactionController {
    async create(req, res, next) {
        try {
            const { rateId, amountFrom, amountTo } = req.body;
            if (!rateId || !amountFrom || !amountTo || isNaN(amountFrom) || isNaN(amountTo)) {
                return res.status(400).json({ message: 'Все поля (rateId, amountFrom, amountTo) обязательны и должны быть числами.' });
            }

            
            const rate = await Rate.findByPk(rateId);
            if (!rate) {
                return res.status(404).json({ message: 'Указанный курс не найден.' });
            }

            const transaction = await Transaction.create({ rateId, amountFrom, amountTo });
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            let { limit, page, sortBy, sortOrder, filterRateId, searchAmountFrom } = req.query;
            limit = parseInt(limit, 10) || 10;
            page = parseInt(page, 10) || 1;
            let offset = (page - 1) * limit;

            let where = {};
            if (filterRateId) where.rateId = filterRateId;
            if (searchAmountFrom) {
                where.amountFrom = { [Op.gte]: parseFloat(searchAmountFrom) }; 
            }

            let order = [];
            if (sortBy && ['amountFrom', 'amountTo', 'rateId'].includes(sortBy)) {
                order = [[sortBy, sortOrder && sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
            } else {
                order = [['id', 'ASC']];
            }

            const transactions = await Transaction.findAndCountAll({ 
                where, 
                limit, 
                offset, 
                order,
                include: [ 
                    { 
                        model: Rate, 
                        as: 'rate',
                        include: [
                            { model: Currency, as: 'fromCurrency', attributes: ['code', 'name'] },
                            { model: Currency, as: 'toCurrency', attributes: ['code', 'name'] }
                        ]
                    }
                ]
            });
            return res.json(transactions);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await Transaction.findByPk(id, {
                include: [
                    { 
                        model: Rate, 
                        as: 'rate',
                        include: [
                            { model: Currency, as: 'fromCurrency', attributes: ['code', 'name'] },
                            { model: Currency, as: 'toCurrency', attributes: ['code', 'name'] }
                        ]
                    }
                ]
            });
            if (!transaction) {
                return res.status(404).json({ message: 'Ошибка: Транзакция не найдена.' });
            }
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { rateId, amountFrom, amountTo } = req.body;
            
            const transaction = await Transaction.findByPk(id);
            if (!transaction) {
                return res.status(404).json({ message: 'Ошибка: Транзакция не найдена.' });
            }

            if (rateId) {
                const rate = await Rate.findByPk(rateId);
                if (!rate) {
                    return res.status(404).json({ message: 'Указанный курс не найден.' });
                }
            }
            
            await transaction.update({ rateId, amountFrom, amountTo });
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await Transaction.destroy({ where: { id } });
            if (result === 0) {
                return res.status(404).json({ message: 'Ошибка: Транзакция не найдена для удаления.' });
            }
            return res.json({ message: 'Транзакция успешно удалена.' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TransactionController();