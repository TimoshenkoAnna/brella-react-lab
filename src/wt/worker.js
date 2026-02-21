const { workerData, parentPort } = require('worker_threads');
const fs = require('fs').promises;
const path = require('path');

const searchInFiles = async ({ directory, query }) => {
  try {
    const files = await fs.readdir(directory);
    const results = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(directory, file);
        const content = await fs.readFile(filePath, 'utf-8');
  
        for (let i = 0; i < 100000000; i++) {} 

        if (content.toLowerCase().includes(query.toLowerCase())) {
          results.push(file);
        }
      }
    }
    return results;
  } catch (error) {
    throw new Error(`Ошибка в воркере: ${error.message}`);
  }
};

searchInFiles(workerData)
  .then(result => {

    parentPort.postMessage({ status: 'done', result });
  })
  .catch(error => {
    parentPort.postMessage({ status: 'error', error: error.message });
  });