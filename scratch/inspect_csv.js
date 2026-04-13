const fs = require('fs');

const content = fs.readFileSync('/Users/mirko/Projects/Penny-concorsi-main/public/data/eurobet_wave1.csv', 'utf8');
const lines = content.split(/\r?\n/);
const header = lines[0].split(',');

const records = [];
// Very basic parser for inspection (doesn't handle quoted newlines well but good enough to see values)
for (let i = 1; i < Math.min(lines.length, 50); i++) {
  if (!lines[i]) continue;
  const values = lines[i].split(',');
  const record = {};
  header.forEach((h, index) => {
    record[h] = values[index];
  });
  records.push(record);
}

console.log(JSON.stringify(records.slice(0, 5), null, 2));

