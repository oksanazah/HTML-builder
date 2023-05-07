const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const dirStyles = path.join(__dirname, 'styles');
const dirAssets = path.join(__dirname, 'assets');
const dirComp = path.join(__dirname, 'components');
const dirDest = path.join(__dirname, 'project-dist');

async function createSourceDir() {
  await fsPromise.rm(dirDest, { recursive: true, force: true });
  await fsPromise.mkdir(dirDest, { recursive: true });

  createDir(dirAssets, `${dirDest}/assets`);
  writeStyles();
  writeTemplate();
}

async function createDir(source, dest) {
  await fsPromise.rm(dest, { recursive: true, force: true });
  await fsPromise.mkdir(dest, { recursive: true });

  copyDir(source, dest);
}

async function copyDir(source, dest) {
  const data = await fsPromise.readdir(source, { withFileTypes: true });

  data.forEach((file) => {
    const sourcePath = path.join(source, file.name);
    const destPath = path.join(dest, file.name);

    if (!file.isFile()) {
      createDir(sourcePath, destPath);
    }
    if (file.isFile()) {
      fs.copyFile(path.join(sourcePath), path.join(destPath), (err) => {
        if (err) throw err;
      });
    }
  });
}

async function readStyles() {
  const data = await fsPromise.readdir(dirStyles, { withFileTypes: true });

  return data.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css'
  );
}

async function writeStyles() {
  const styles = await readStyles();
  const stream = fs.createWriteStream(path.join(dirDest, 'style.css'), 'utf-8');

  for (let file of styles) {
    const content = await fsPromise.readFile(
      path.join(dirStyles, file.name),
      'utf-8'
    );

    stream.write(`${content}\n`);
  }
}

async function readComp() {
  const data = await fsPromise.readdir(dirComp, { withFileTypes: true });

  return data.filter(
    (file) => file.isFile() && path.extname(file.name) === '.html'
  );
}

async function writeComp() {
  const comp = await readComp();
  let template = await fsPromise.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8'
  );
  const regex = /{{(.*?)}}/g;
  let match;

  while ((match = regex.exec(template)) !== null) {
    for (let file of comp) {
      const fileData = path.parse(path.join(dirComp, file.name));

      if (fileData.name === match[1]) {
        const content = await fsPromise.readFile(
          path.join(dirComp, file.name),
          'utf-8'
        );

        template = template.replace(match[0], `${content}\n`);
      }
    }
  }

  return template;
}

async function writeTemplate() {
  const template = await writeComp();
  const stream = fs.createWriteStream(
    path.join(dirDest, 'index.html'),
    'utf-8'
  );
  stream.write(template);
}

createSourceDir();
