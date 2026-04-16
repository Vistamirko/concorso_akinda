
const fs = require('fs');
const path = require('path');

function parseCSV(csvText) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentLine.push(currentField);
                currentField = '';
            } else if (char === '\n' || char === '\r') {
                if (char === '\r' && nextChar === '\n') i++;
                currentLine.push(currentField);
                lines.push(currentLine);
                currentLine = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
    }
    return lines;
}

const csvFilePath = path.join(__dirname, '../public/data/eurobet_wave2.csv');
const csvData = fs.readFileSync(csvFilePath, 'utf8');
const rows = parseCSV(csvData);

const header = rows[0];
const data = rows.slice(1);

const results = [];
const usernames = new Set();

const startDate = new Date('2026-04-13T00:00:00.000Z');
const requiredHashtags = [
    '#sentilapassionedalvivo',
    '#accettoregolamento',
    '#accettoprivacypolicy'
];

data.forEach(row => {
    if (row.length < header.length) return;

    const post = {};
    header.forEach((col, index) => {
        post[col] = row[index];
    });

    const pubDate = new Date(post.pubDate);
    const description = (post.description || '').toLowerCase();

    // 1. Filter by Date
    if (pubDate < startDate) return;

    // 2. Filter by Hashtags
    const hasAllHashtags = requiredHashtags.every(tag => description.includes(tag.toLowerCase()));
    if (!hasAllHashtags) return;

    // 3. Deduplicate
    if (usernames.has(post.username)) return;
    
    // 4. Exclude sponsor
    if (post.username.toLowerCase() === 'eurobet.live') return;

    usernames.add(post.username);

    results.push({
        url: post.postUrl,
        username: post.username,
        fullName: post.fullName || post.username,
        timestamp: post.pubDate,
        caption: post.description,
        likeCount: parseInt(post.likeCount) || 0,
        commentCount: parseInt(post.commentCount) || 0,
        imgUrl: post.imgUrl,
        id: post.postId
    });
});

const jsonOutput = JSON.stringify(results, null, 2);
fs.writeFileSync(path.join(__dirname, '../public/data/eurobet_wave2.json'), jsonOutput);

// CSV for Excel (using semicolon for Italian Excel compatibility)
const csvHeader = 'Username;Full Name;Post URL;Date;Likes;Comments;Description\n';
const csvRows = results.map(r => {
    const desc = (r.caption || '').replace(/[\n\r]/g, ' ').replace(/"/g, '""');
    return `${r.username};${r.fullName};${r.url};${r.timestamp};${r.likeCount};${r.commentCount};"${desc}"`;
}).join('\n');

fs.writeFileSync(path.join(__dirname, '../public/data/eurobet_wave2.csv'), csvHeader + csvRows);

console.log(jsonOutput);
console.error(`Total Valid Entries (excluding sponsor): ${results.length}`);
console.error(`Files saved: eurobet_wave2.json, eurobet_wave2.csv`);
