const fs = require('fs').promises;
const path = require('path');

const storagePath = path.join(__dirname, '../../storage');

const readProduct = async (productId) => {
  if (!productId) {
    throw new Error('Ошибка: ID товара не указан.');
  }
  
  const fileName = `product_${productId}.json`;
  const filePath = path.join(storagePath, fileName);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const productData = JSON.parse(fileContent);
    console.log('Подробная информация о товаре:');
    console.log(productData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Ошибка: Товар с ID ${productId} не найден.`);
    } else {
      console.error('Ошибка при чтении файла:', error);
    }
  }
};

const [,, productId] = process.argv;
readProduct(productId).catch(console.error);