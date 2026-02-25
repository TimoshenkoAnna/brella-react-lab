require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db/index');
const models = require('./db/models/models'); 
const router = require('./routes/index'); 
const errorHandler = require('./middleware/ErrorHandlerMiddleware'); 

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());




app.use('/api', router);

app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД было успешно установлено.');

        await sequelize.sync(); 
        console.log('Все модели были успешно синхронизированы.');

        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

    } catch (e) {
        console.error('Не удалось подключиться к БД:', e);
    }
}

start();