const fs = require('fs');
const path = require('path');
const readline = require('readline');

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.write('Enter some data...\n');
rl.on('SIGINT', () => {
  console.log('Thank you!');
  rl.close();
});

rl.on('line', (answer) => {
  if (answer.toLowerCase().trim() === 'exit') {
    console.log('Thank you!');
    rl.close();
  } else {
    stream.write(`${answer}\n`);
  }
});
