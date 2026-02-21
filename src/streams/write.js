const fs = require('fs');
const path = require('path');

const writeFileStream = (fileName, content) => {
  if (!fileName || !content) {
    console.error('Ошибка: Имя файла и содержимое для записи должны быть указаны.');
    process.exit(1);
  }

  const filePath = path.join(__dirname, '../../storage', fileName);

  const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });

  console.log(`--- Начало записи в файл ${fileName} ---`);

  writeStream.write(content);

  writeStream.end();

  writeStream.on('finish', () => {
    console.log('--- Запись в файл успешно завершена ---');
  });

  writeStream.on('error', (error) => {
    console.error('Произошла ошибка при записи в файл:', error);
  });
};

const [,, fileName, content] = process.argv;
writeFileStream(fileName, content);