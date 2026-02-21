const { Worker } = require('worker_threads');
const path = require('path');

const runWorker = (searchQuery) => {
  if (!searchQuery) {
    console.error('Ошибка: Поисковый запрос не указан.');
    return;
  }

  const workerPath = path.resolve(__dirname, 'worker.js');
  const storagePath = path.resolve(__dirname, '../../storage');

  console.log('Запуск воркера для выполнения поиска...');

  const worker = new Worker(workerPath, {
    workerData: {
      directory: storagePath,
      query: searchQuery,
    },
  });

  worker.on('message', (message) => {
    if (message.status === 'done') {
      console.log('Поиск завершен. Найденные файлы:', message.result);
    } else {
      console.error('Ошибка в воркере:', message.error);
    }
  });

  worker.on('error', (error) => {
    console.error('Произошла критическая ошибка воркера:', error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Воркер остановился с кодом выхода ${code}`);
    }
  });
};

const [,, searchQuery] = process.argv;
runWorker(searchQuery);