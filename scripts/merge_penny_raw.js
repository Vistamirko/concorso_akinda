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

function mergeFacebook() {
    const oldPath = path.join(__dirname, '../public/data/fbcomment.json');
    const newPath = path.join(__dirname, '../src/data/export_20260601-063139.csv');
    
    let oldData = [];
    if (fs.existsSync(oldPath)) {
        try {
            oldData = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
        } catch (e) {
            console.error("Error reading old FB data", e);
        }
    }
    
    let newData = [];
    if (fs.existsSync(newPath)) {
        const csvData = fs.readFileSync(newPath, 'utf8');
        const rows = parseCSV(csvData);
        // Skip header
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 8) continue;
            
            const name = (row[2] || '').trim();
            const date = (row[4] || '').trim();
            const comment = (row[7] || '').trim();
            
            if (name) {
                newData.push({ Name: name, Data: date, Comment: comment });
            }
        }
    }
    
    // Merge
    const allData = [...oldData, ...newData];
    
    // Deduplicate by Name + Comment
    const uniqueMap = new Map();
    for (const item of allData) {
        const key = `${(item.Name || '').toLowerCase()}_${(item.Comment || '').toLowerCase()}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    }
    
    const results = Array.from(uniqueMap.values());
    fs.writeFileSync(oldPath, JSON.stringify(results, null, 2));
    console.log(`Facebook merged: ${results.length} commenti totali.`);
}

function mergeInstagram() {
    const oldPath = path.join(__dirname, '../public/data/igcomment.json');
    const newPath = path.join(__dirname, '../src/data/result-penny.json');
    
    let oldData = [];
    if (fs.existsSync(oldPath)) {
        try {
            oldData = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
        } catch (e) {
            console.error("Error reading old IG data", e);
        }
    }
    
    let newData = [];
    if (fs.existsSync(newPath)) {
        try {
            const raw = JSON.parse(fs.readFileSync(newPath, 'utf8'));
            for (const item of raw) {
                if (item.username) {
                    newData.push({
                        Username: item.username,
                        Date: item.commentDate || item.timestamp,
                        CommentText: item.comment || item.commentText,
                        ProfileURL: item.profileUrl
                    });
                }
            }
        } catch (e) {
            console.error("Error reading new IG data", e);
        }
    }
    
    // Merge
    const allData = [...oldData, ...newData];
    
    // Deduplicate by Username + Comment
    const uniqueMap = new Map();
    for (const item of allData) {
        const key = `${(item.Username || '').toLowerCase()}_${(item.CommentText || '').toLowerCase()}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    }
    
    const results = Array.from(uniqueMap.values());
    fs.writeFileSync(oldPath, JSON.stringify(results, null, 2));
    console.log(`Instagram merged: ${results.length} commenti totali.`);
}

console.log("Inizio merge dei raw data...");
mergeFacebook();
mergeInstagram();
console.log("Completato.");
