const fs = require('fs');
const path = require('path');

const stream = fs
  .createReadStream(path.join(__dirname, 'text.txt'))
  .setEncoding('utf-8');

stream.pipe(process.stdout);
