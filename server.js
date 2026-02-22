// server.js

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
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.warn(`products.json не найден или пуст/некорректен. Создаем пустой массив.`);
            return [];
        }
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
        const productData = req.body;

        if (!productData.i18n?.ru?.name || !productData.price) {
            return res.status(400).json({ message: "Ошибка: Имя и цена обязательны для заполнения." });
        }

        const products = await readProducts();

        // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        // Мы больше не используем "плоский" объект.
        // Мы явно создаем объект с правильной вложенной структурой `i18n`.
        const newProduct = {
            id: Date.now(),
            price: productData.price,
            image: productData.image || '', // Значение по умолчанию
            status: productData.status || 'in_stock', // Значение по умолчанию
            i18n: {
                ru: {
                    name: productData.i18n.ru.name,
                    type: productData.i18n.ru.type || '',
                    description: productData.i18n.ru.description || ''
                },
                en: {
                    name: productData.i18n.en.name || '',
                    type: productData.i18n.en.type || '',
                    description: productData.i18n.en.description || ''
                }
            }
        };
        // ------------------------------------

        products.unshift(newProduct);
        await writeProducts(products);

        res.status(201).json(newProduct); // Отправляем только что созданный товар с правильной структурой

    } catch (error) {
        console.error("Ошибка при создании товара:", error);
        res.status(500).json({ message: "Ошибка при создании товара" });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProductData = req.body;
        const products = await readProducts();
        const index = products.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json({ message: "Товар для обновления не найден." });
        }

        // При обновлении важно глубоко "слить" объекты, чтобы не потерять i18n
        const existingProduct = products[index];
        products[index] = {
            ...existingProduct,
            ...updatedProductData,
            i18n: {
                ru: {
                    ...existingProduct.i18n.ru,
                    ...updatedProductData.i18n.ru,
                },
                en: {
                    ...existingProduct.i18n.en,
                    ...updatedProductData.i18n.en,
                }
            }
        };
        
        await writeProducts(products);
        res.json(products[index]);
    } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
        res.status(500).json({ message: "Ошибка при обновлении товара" });
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
        console.error("Ошибка при удалении товара:", error);
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
                const xmlData = xml_js.json2xml(JSON.stringify({ items: { product: products } }), options);
                res.type('application/xml').send(xmlData);
            },
            'text/html': () => {
                let html = '<h1>Каталог товаров</h1><table border="1"><thead><tr><th>ID</th><th>Название</th><th>Тип</th><th>Цена</th></tr></thead><tbody>';
                products.forEach(p => {
                    const productName = p.i18n?.ru?.name || p.name || 'N/A';
                    const productType = p.i18n?.ru?.type || p.type || 'N/A';
                    html += `<tr><td>${p.id}</td><td>${productName}</td><td>${productType}</td><td>${p.price} BYN</td></tr>`;
                });
                html += '</tbody></table>';
                res.type('text/html').send(html);
            },
            default: () => {
                res.status(406).send('Формат не поддерживается');
            }
        });
    } catch (error) {
        console.error("Ошибка при экспорте данных:", error);
        res.status(500).json({ message: "Ошибка при экспорте данных" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});