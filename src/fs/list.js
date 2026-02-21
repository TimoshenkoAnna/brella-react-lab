const fs = require('fs').promises;
const path = require('path');

const indexPath = path.join(__dirname, '../../storage/index.json');

const listProducts = async () => {
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8');
    const indexData = JSON.parse(indexContent);
    
    if (indexData.length === 0) {
      console.log('Каталог пуст.');
      return;
    }
    
    console.log('Список всех товаров в каталоге:');
    console.table(indexData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Ошибка: Индексный файл не найден. Возможно, еще не было создано ни одной записи.');
    } else {
      console.error('Ошибка при чтении каталога:', error);
    }
  }
};

listProducts();