const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');

const storagePath = path.join(__dirname, '../../storage');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const searchProducts = async (query) => {
  try {
    const files = await fs.readdir(storagePath);
    const results = [];

    for (const file of files) {

      if (file.startsWith('product_') && file.endsWith('.json')) {
        const filePath = path.join(storagePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const product = JSON.parse(content);

        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(product);
        }
      }
    }
    return results;
  } catch (error) {
    console.error('Ошибка во время поиска:', error);
    return [];
  }
};

rl.question('Введите критерий поиска (например, название товара): ', async (query) => {
  if (!query) {
    console.log('Поисковый запрос не может быть пустым.');
    rl.close();
    return;
  }
  
  console.log(`\nИдет поиск по запросу: "${query}"...`);
  const foundProducts = await searchProducts(query);

  if (foundProducts.length > 0) {
    console.log(`Найдено ${foundProducts.length} товар(ов):`);
    console.table(foundProducts);
  } else {
    console.log('По вашему запросу ничего не найдено.');
  }

  rl.close();
});