const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const dirSource = path.join(__dirname, 'styles');
const dirDest = path.join(__dirname, 'project-dist');

async function readStyles() {
  const data = await fsPromise.readdir(dirSource, { withFileTypes: true });

  return data.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css'
  );
}

async function writeStyles() {
  const styles = await readStyles();
  const stream = fs.createWriteStream(
    path.join(dirDest, 'bundle.css'),
    'utf-8'
  );

  for (let file of styles) {
    const content = await fsPromise.readFile(
      path.join(dirSource, file.name),
      'utf-8'
    );

    stream.write(`${content}\n`);
  }
}

writeStyles();
