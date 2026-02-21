const fs = require('fs').promises;
const path = require('path');

const copyDir = async (src, dest) => {
  if (!src || !dest) {
    throw new Error('Ошибка: Необходимо указать исходную и целевую директории.');
  }

  try {
    await fs.mkdir(dest, { recursive: true });
    
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        
        await copyDir(srcPath, destPath);
      } else {
        
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log(`Содержимое папки '${src}' успешно скопировано в '${dest}'.`);
  } catch (error) {
    console.error('Произошла ошибка во время копирования:', error);
  }
};

const [,, source, destination] = process.argv;
copyDir(source, destination);