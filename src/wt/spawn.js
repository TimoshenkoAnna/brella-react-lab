const { spawn } = require('child_process');
const path = require('path');

const runSearch = (searchQuery) => {
  if (!searchQuery) {
    console.error('Ошибка: Поисковый запрос не указан.');
    return;
  }

  const searchScriptPath = path.resolve(__dirname, 'search-logic.js');
  const storagePath = path.resolve(__dirname, '../../storage');
  
  console.log('Запуск дочернего процесса для выполнения поиска...');

  const child = spawn('node', [searchScriptPath, storagePath, searchQuery]);

  child.stdout.on('data', (data) => {
    try {
      const results = JSON.parse(data.toString());
      console.log('Поиск завершен. Найденные файлы:', results);
    } catch (e) {
      console.log(`Не удалось распарсить результат: ${data.toString()}`);
    }
  });

  child.stderr.on('data', (data) => {
    console.error(`Ошибка в дочернем процессе: ${data.toString()}`);
  });

  child.on('close', (code) => {
    console.log(`Дочерний процесс завершился с кодом ${code}`);
  });
};

const [,, searchQuery] = process.argv;
runSearch(searchQuery);