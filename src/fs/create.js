const fs = require('fs').promises;
const path = require('path');

const storagePath = path.join(__dirname, '../../storage');

const createProduct = async (name, type, description, price) => {

  if (!name || !type || !description || !price) {
    throw new Error('Ошибка операции FS: Все поля (name, type, description, price) должны быть указаны.');
  }

  const productId = Date.now().toString();
  const fileName = `product_${productId}.json`;
  const filePath = path.join(storagePath, fileName);

   try {
    await fs.access(filePath);
    
    throw new Error(`Ошибка операции FS: Запись с ID ${productId} уже существует.`);
  } catch (error) {
  if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  const productData = {
    id: productId,
    name,
    type,
    description,
    price: parseFloat(price), 
  };

  await fs.writeFile(filePath, JSON.stringify(productData, null, 2));
  console.log(`Файл ${fileName} успешно создан.`);

  const indexPath = path.join(storagePath, 'index.json');
  let indexData = [];
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8');
    indexData = JSON.parse(indexContent);
  } catch (error) {

    if (error.code !== 'ENOENT') throw error;
  }
  
  indexData.push({
    id: productId,
    name: name,
    fileName: fileName,
  });

  await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2));
  console.log(`Индексный файл обновлен.`);
};

const [,, name, type, description, price] = process.argv;

createProduct(name, type, description, price).catch(console.error);