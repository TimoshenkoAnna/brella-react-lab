const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const xml_js = require('xml-js');

const app = express();
const PORT = 5000;
const productsFilePath = path.join(__dirname, 'data', 'products.json');

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'build'))); 

const readProducts = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {

        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeProducts = async (data) => {
    await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
};



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await readProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при чтении данных" });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: "Ошибка: Имя и цена обязательны для заполнения." });
        }

        const products = await readProducts();
        const newProduct = { ...req.body, id: Date.now() };
        products.unshift(newProduct);
        await writeProducts(products);
        
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при создании товара" });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const products = await readProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(id));

        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: "Товар для удаления не найден." });
        }

        await writeProducts(filteredProducts);
        res.json({ message: "Товар успешно удален" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при удалении товара" });
    }
});

app.get('/api/products/export', async (req, res) => {
    try {
        const products = await readProducts();
        
        res.format({

            'application/json': () => {
                res.json(products);
            },

            'application/xml': () => {
                const options = { compact: true, ignoreComment: true, spaces: 4 };
                const xmlData = xml_js.json2xml(JSON.stringify({ products: { product: products } }), options);
                res.type('application/xml').send(xmlData);
            },

            'text/html': () => {
                let html = '<h1>Каталог товаров</h1><ul>';
                products.forEach(p => {
                    html += `<li><b>${p.i18n.ru.name}</b> - ${p.price} ${p.i18n.ru.currency || 'BYN'}</li>`;
                });
                html += '</ul>';
                res.type('text/html').send(html);
            },

            default: () => {
                res.status(406).send('Формат не поддерживается');
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при экспорте данных" });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});