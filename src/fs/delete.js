const fs = require('fs').promises;
const path = require('path');

const storagePath = path.join(__dirname, '../../storage');
const indexPath = path.join(storagePath, 'index.json');

const deleteProduct = async (productId) => {
  if (!productId) {
    throw new Error('Ошибка: ID товара для удаления не указан.');
  }

  const fileName = `product_${productId}.json`;
  const filePath = path.join(storagePath, fileName);

  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Ошибка операции FS: Товар с ID ${productId} не найден и не может быть удален.`);
      return;
    }
    throw error;
  }

  await fs.unlink(filePath);
  console.log(`Файл ${fileName} успешно удален.`);

  let indexData = [];
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8');
    indexData = JSON.parse(indexContent);
  } catch (error) {
    console.error('Ошибка при чтении индексного файла. Удаление из индекса невозможно.', error);
    return;
  }

  const updatedIndex = indexData.filter(item => item.id !== productId);

  if (indexData.length === updatedIndex.length) {
    console.warn(`Предупреждение: Запись с ID ${productId} не найдена в индексном файле, хотя файл товара был удален.`);
  }

  await fs.writeFile(indexPath, JSON.stringify(updatedIndex, null, 2));
  console.log(`Запись с ID ${productId} удалена из индексного файла.`);
};

const [,, productId] = process.argv;
deleteProduct(productId).catch(console.error);