const fs = require('fs');

const csvFilePath = './public/data/eurobet_wave2.csv';
const outputFilePath = './public/data/eurobet_wave2.json';

const requiredHashtags = [
  '#sentilapassionedalvivo',
  '#accettoregolamento',
  '#accettoprivacypolicy'
];
const requiredTag = '@eurobet.live';
const startDate = new Date('2026-04-13T00:00:00Z');

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

try {
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  // Simple line split handle potentially multiline descriptions if they are quoted
  // However, the previous view_file showed descriptions can have newlines.
  // Let's use a more robust line parser.
  
  const records = [];
  let currentRecord = [];
  let currentField = '';
  let inQuotes = false;
  let lines = fileContent.split('\n');
  
  // Actually, let's just parse the whole thing char by char to be safe with newlines in fields
  const headers = [];
  let i = 0;
  let field = '';
  let inQ = false;
  let row = [];

  while (i < fileContent.length) {
    const char = fileContent[i];
    if (char === '"') {
      if (inQ && fileContent[i+1] === '"') {
        field += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (char === ',' && !inQ) {
      row.push(field);
      field = '';
    } else if (char === '\n' && !inQ) {
      row.push(field);
      if (headers.length === 0) {
        headers.push(...row);
      } else {
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h.trim()] = row[idx];
        });
        records.push(obj);
      }
      row = [];
      field = '';
    } else if (char === '\r' && !inQ) {
      // ignore
    } else {
      field += char;
    }
    i++;
  }
  // catch last row if no trailing newline
  if (row.length > 0 || field !== '') {
    if (headers.length > 0) {
        row.push(field);
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h.trim()] = row[idx];
        });
        records.push(obj);
    }
  }

  const validParticipants = records.filter((record, index) => {
    const description = (record.description || '').toLowerCase();
    const pubDateStr = record.pubDate;
    if (!pubDateStr) return false;
    
    const pubDate = new Date(pubDateStr);

    // Filter by Date
    const isAfterDate = pubDate >= startDate;
    
    // Filter by Tag
    const hasTag = description.includes(requiredTag.toLowerCase());

    // Filter by Hashtags
    const hasAllHashtags = requiredHashtags.every(tag => description.includes(tag.toLowerCase()));

    return isAfterDate && hasTag && hasAllHashtags;
  });



  const jsonOutput = validParticipants.map(record => ({
    id: record.postId,
    fullName: record.username,
    url: record.postUrl,
    caption: record.description,
    timestamp: record.pubDate,
    type: record.type === 'Photo' ? 'Image' : record.type
  }));



  fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 2));

  console.log(`Total participants in CSV: ${records.length}`);
  console.log(`Total valid participants: ${jsonOutput.length}`);
  console.log(`JSON file saved to ${outputFilePath}`);

} catch (error) {
  console.error('Error processing CSV:', error);
}

