const fs = require('fs');
const path = require('path');

const readFileStream = (fileName) => {
  if (!fileName) {
    console.error('Ошибка: Имя файла не указано.');
    process.exit(1); 
  }

  const filePath = path.join(__dirname, '../../storage', fileName);

  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

  console.log(`--- Начало чтения файла ${fileName} ---`);

  readStream.on('data', (chunk) => {
    console.log('...получена порция данных:');
    console.log(chunk);
  });

  readStream.on('end', () => {
    console.log('--- Чтение файла завершено ---');
  });

  readStream.on('error', (error) => {
    if (error.code === 'ENOENT') {
      console.error(`Ошибка: Файл '${fileName}' не найден.`);
    } else {
      console.error('Произошла ошибка при чтении файла:', error);
    }
  });
};

const [,, fileName] = process.argv;
readFileStream(fileName);