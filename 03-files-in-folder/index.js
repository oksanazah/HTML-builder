const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

async function main() {
  const data = await fsPromise.readdir(dir, {
    withFileTypes: true,
  });

  data
    .filter((file) => file.isFile())
    .forEach((file) => {
      const fileData = path.parse(path.join(dir, file.name));

      fs.stat(path.join(dir, file.name), (err, stats) => {
        console.log(
          `${fileData.name} - ${fileData.ext.replace('.', '')} - ${stats.size}b`
        );
      });
    });
}

main();
