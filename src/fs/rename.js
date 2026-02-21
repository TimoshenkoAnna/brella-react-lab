const fs = require('fs').promises;
const path = require('path');

const storagePath = path.join(__dirname, '../../storage');
const indexPath = path.join(storagePath, 'index.json');

const renameFile = async (oldFileName, newFileName) => {
  if (!oldFileName || !newFileName) {
    throw new Error('Ошибка: Необходимо указать старое и новое имя файла.');
  }

  const oldFilePath = path.join(storagePath, oldFileName);
  const newFilePath = path.join(storagePath, newFileName);

   try {
    await fs.access(oldFilePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Ошибка: Исходный файл '${oldFileName}' не найден.`);
    }
    throw error;
  }

  await fs.rename(oldFilePath, newFilePath);
  console.log(`Файл '${oldFileName}' успешно переименован в '${newFileName}'.`);

  let indexData = [];
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8');
    indexData = JSON.parse(indexContent);
  } catch (error) {
    console.error('Ошибка при чтении индексного файла. Обновление индекса невозможно.', error);
    return;
  }

  const updatedIndex = indexData.map(item => {
    if (item.fileName === oldFileName) {
      return { ...item, fileName: newFileName };
    }
    return item;
  });

  await fs.writeFile(indexPath, JSON.stringify(updatedIndex, null, 2));
  console.log(`Имя файла в индексе обновлено на '${newFileName}'.`);
};

const [,, oldName, newName] = process.argv;
renameFile(oldName, newName).catch(console.error);