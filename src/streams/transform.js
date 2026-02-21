const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {

    const transformedChunk = chunk.toString().toUpperCase();

    this.push(transformedChunk);

    callback();
  }
}

const upperCaseTransform = new UpperCaseTransform();

console.log('Введите текст для преобразования в ВЕРХНИЙ РЕГИСТР (для выхода нажмите Ctrl+C):');

process.stdin.pipe(upperCaseTransform).pipe(process.stdout);