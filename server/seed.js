require('dotenv').config();
const sequelize = require('./db/index');
const { Currency, Rate, Transaction } = require('./db/models/models');

const seedDatabase = async () => {
    try {

        await sequelize.sync({ force: true }); // !!! force: true УДАЛЯЕТ все данные
        console.log('База данных очищена и синхронизирована.');

        // 1. Создаем валюты
        const usd = await Currency.create({ code: 'USD', name: 'Доллар США', photo: 'https://flagsapi.com/US/flat/64.png' });
        const eur = await Currency.create({ code: 'EUR', name: 'Евро', photo: 'https://flagsapi.com/EU/flat/64.png' });
        const rub = await Currency.create({ code: 'RUB', name: 'Рубль', photo: 'https://flagsapi.com/RU/flat/64.png' });
        const byn = await Currency.create({ code: 'BYN', name: 'Белорусский рубль', photo: 'https://flagsapi.com/BY/flat/64.png' });
        const pln = await Currency.create({ code: 'PLN', name: 'Польский злотый', photo: 'https://flagsapi.com/PL/flat/64.png' });
        const gbp = await Currency.create({ code: 'GBP', name: 'Фунт стерлингов', photo: 'https://flagsapi.com/GB/flat/64.png' });
        const uah = await Currency.create({ code: 'UAH', name: 'Украинская гривна', photo: 'https://flagsapi.com/UA/flat/64.png' });

        const currencies = [usd, eur, rub, byn, pln, gbp, uah];
        console.log('Валюты добавлены.');

        // 2. Создаем курсы
        const rates = [];

        rates.push(await Rate.create({ fromCurrencyId: usd.id, toCurrencyId: eur.id, rate: 0.92 }));
        rates.push(await Rate.create({ fromCurrencyId: eur.id, toCurrencyId: usd.id, rate: 1.08 }));
        rates.push(await Rate.create({ fromCurrencyId: usd.id, toCurrencyId: rub.id, rate: 90.5 }));
        rates.push(await Rate.create({ fromCurrencyId: rub.id, toCurrencyId: usd.id, rate: 0.011 }));
        rates.push(await Rate.create({ fromCurrencyId: eur.id, toCurrencyId: byn.id, rate: 3.48 }));
        rates.push(await Rate.create({ fromCurrencyId: byn.id, toCurrencyId: eur.id, rate: 0.28 }));
        rates.push(await Rate.create({ fromCurrencyId: pln.id, toCurrencyId: usd.id, rate: 0.25 }));
        rates.push(await Rate.create({ fromCurrencyId: gbp.id, toCurrencyId: uah.id, rate: 49.0 }));

        for (let i = 0; i < 20; i++) {
            const from = currencies[Math.floor(Math.random() * currencies.length)];
            const to = currencies[Math.floor(Math.random() * currencies.length)];
            if (from.id !== to.id) {
                try {
                     await Rate.create({ fromCurrencyId: from.id, toCurrencyId: to.id, rate: (Math.random() * 100).toFixed(4) });
                } catch (e) { /* ignore duplicates */ }
            }
        }
        console.log('Курсы обмена добавлены.');

      
        const transactions = [];
        for (let i = 0; i < 25; i++) { 
            const randomRate = rates[Math.floor(Math.random() * rates.length)];
            const amountFrom = (Math.random() * 1000).toFixed(2);
            const amountTo = (amountFrom * randomRate.rate).toFixed(2);
            transactions.push(await Transaction.create({
                rateId: randomRate.id,
                amountFrom: parseFloat(amountFrom),
                amountTo: parseFloat(amountTo)
            }));
        }
        console.log('Транзакции добавлены.');

        console.log('База данных успешно заполнена тестовыми данными.');
    } catch (e) {
        console.error('Ошибка при заполнении базы данных:', e);
    } finally {
        await sequelize.close();
        console.log('Подключение к БД закрыто.');
    }
};

seedDatabase();