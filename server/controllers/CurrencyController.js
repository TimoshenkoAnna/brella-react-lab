const { Currency } = require('../db/models/models');
const { Op } = require('sequelize'); 

class CurrencyController {

    async create(req, res, next) {
        try {
            const { code, name, photo } = req.body;
         
            if (!code || !name || !photo) {
                return res.status(400).json({ message: 'Все поля (code, name, photo) обязательны.' });
            }
            const currency = await Currency.create({ code, name, photo });
            return res.json(currency);
        } catch (e) {
            
            if (e.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'Ошибка: Валюта с таким кодом уже существует.' });
            }
            next(e); 
        }
    }


    async getAll(req, res, next) {
        try {
            let { limit, page, sortBy, sortOrder, filterCode, searchName } = req.query;
            limit = parseInt(limit, 10) || 10;
            page = parseInt(page, 10) || 1;
            let offset = (page - 1) * limit;

            let where = {};
            if (filterCode) {
                where.code = filterCode; 
            }
            if (searchName) {
                where.name = { [Op.iLike]: `%${searchName}%` }; 
            }

            let order = [];
            if (sortBy && ['code', 'name'].includes(sortBy)) {
                order = [[sortBy, sortOrder && sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
            } else {
                order = [['id', 'ASC']]; 
            }

            const currencies = await Currency.findAndCountAll({ where, limit, offset, order });
            return res.json(currencies);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const currency = await Currency.findByPk(id); 

            if (!currency) {
                return res.status(404).json({ message: 'Ошибка: Валюта не найдена.' });
            }
            return res.json(currency);
        } catch (e) {
            next(e);
        }
    }


    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { code, name, photo } = req.body;
            

            const currency = await Currency.findByPk(id);
            if (!currency) {
                return res.status(404).json({ message: 'Ошибка: Валюта не найдена.' });
            }

            await currency.update({ code, name, photo });
            return res.json(currency);
        } catch (e) {
             if (e.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'Ошибка: Валюта с таким кодом уже существует.' });
            }
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            const result = await Currency.destroy({ where: { id } });

            if (result === 0) {
                return res.status(404).json({ message: 'Ошибка: Валюта не найдена для удаления.' });
            }
            return res.json({ message: 'Валюта успешно удалена.' });
        } catch (e) {
            next(e);
        }
    }

    async checkExistence(req, res, next) {
        try {
            const { id } = req.params;
            const currency = await Currency.findByPk(id);
            if (currency) {
                return res.status(200).json({ exists: true, message: 'Валюта найдена.' });
            } else {
                return res.status(404).json({ exists: false, message: 'Валюта не найдена.' });
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CurrencyController();