const fs = require('fs').promises;
const path = require('path');

const searchInFiles = async (directory, query) => {
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

    console.log(JSON.stringify(results));
  } catch (error) {

    console.error(`Ошибка в дочернем процессе: ${error.message}`);
    process.exit(1);
  }
};

const [,, directory, query] = process.argv;
searchInFiles(directory, query);