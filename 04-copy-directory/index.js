const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

async function createDir() {
  await fsPromise.rm(dirCopy, { recursive: true, force: true });
  await fsPromise.mkdir(dirCopy, { recursive: true });

  copyDir();
}

createDir();

async function copyDir() {
  const data = await fsPromise.readdir(dir, { withFileTypes: true });

  data.forEach((file) => {
    if (file.isFile()) {
      fs.copyFile(
        path.join(dir, file.name),
        path.join(dirCopy, file.name),
        (err) => {
          if (err) throw err;
        }
      );
    }
  });
}
