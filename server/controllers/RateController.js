const { Rate, Currency } = require('../db/models/models');
const { Op } = require('sequelize');

class RateController {
    async create(req, res, next) {
        try {
            const { fromCurrencyId, toCurrencyId, rate } = req.body;
            if (!fromCurrencyId || !toCurrencyId || !rate || isNaN(rate)) {
                return res.status(400).json({ message: 'Все поля (fromCurrencyId, toCurrencyId, rate) обязательны и rate должен быть числом.' });
            }
            
            const fromCurrency = await Currency.findByPk(fromCurrencyId);
            const toCurrency = await Currency.findByPk(toCurrencyId);
            if (!fromCurrency || !toCurrency) {
                return res.status(404).json({ message: 'Одна или обе указанные валюты не найдены.' });
            }

            const existingRate = await Rate.findOne({ where: { fromCurrencyId, toCurrencyId } });
            if (existingRate) {
                return res.status(409).json({ message: 'Ошибка: Курс для этой пары валют уже существует. Используйте PUT для обновления.' });
            }

            const newRate = await Rate.create({ fromCurrencyId, toCurrencyId, rate });
            return res.json(newRate);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            let { limit, page, sortBy, sortOrder, filterFrom, filterTo } = req.query;
            limit = parseInt(limit, 10) || 10;
            page = parseInt(page, 10) || 1;
            let offset = (page - 1) * limit;

            let where = {};
            if (filterFrom) where.fromCurrencyId = filterFrom;
            if (filterTo) where.toCurrencyId = filterTo;

            let order = [];
            if (sortBy && ['rate', 'fromCurrencyId', 'toCurrencyId'].includes(sortBy)) {
                order = [[sortBy, sortOrder && sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
            } else {
                order = [['id', 'ASC']];
            }

            const rates = await Rate.findAndCountAll({ 
                where, 
                limit, 
                offset, 
                order,
                include: [
                    { model: Currency, as: 'fromCurrency', attributes: ['id', 'code', 'name', 'photo'] },
                    { model: Currency, as: 'toCurrency', attributes: ['id', 'code', 'name', 'photo'] }
                ]
            });
            return res.json(rates);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const rate = await Rate.findByPk(id, {
                include: [
                    { model: Currency, as: 'fromCurrency', attributes: ['id', 'code', 'name', 'photo'] },
                    { model: Currency, as: 'toCurrency', attributes: ['id', 'code', 'name', 'photo'] }
                ]
            });
            if (!rate) {
                return res.status(404).json({ message: 'Ошибка: Курс не найден.' });
            }
            return res.json(rate);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { fromCurrencyId, toCurrencyId, rate } = req.body;
            
            const existingRate = await Rate.findByPk(id);
            if (!existingRate) {
                return res.status(404).json({ message: 'Ошибка: Курс не найден.' });
            }

            if (fromCurrencyId || toCurrencyId) { 
                const fromCurrency = fromCurrencyId ? await Currency.findByPk(fromCurrencyId) : existingRate.fromCurrency;
                const toCurrency = toCurrencyId ? await Currency.findByPk(toCurrencyId) : existingRate.toCurrency;
                if (!fromCurrency || !toCurrency) {
                    return res.status(404).json({ message: 'Одна или обе указанные валюты не найдены.' });
                }
            }
            
            await existingRate.update({ fromCurrencyId, toCurrencyId, rate });
            return res.json(existingRate);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await Rate.destroy({ where: { id } });
            if (result === 0) {
                return res.status(404).json({ message: 'Ошибка: Курс не найден для удаления.' });
            }
            return res.json({ message: 'Курс успешно удален.' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RateController();