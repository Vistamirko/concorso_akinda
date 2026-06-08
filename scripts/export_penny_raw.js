const fs = require('fs');
const path = require('path');

function isCommentValid(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    
    const hasProductHashtag = lowerText.includes('#prodottomisteriosopenny') || lowerText.includes('#ilprodottomisteriosopenny');
    const hasRulesHashtag = lowerText.includes('#accettoregolamento') || lowerText.includes('#accettoilregolamento');
    const hasPrivacyHashtag = lowerText.includes('#holettoprivacypolicy');
    
    return hasProductHashtag && hasRulesHashtag && hasPrivacyHashtag;
}

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

function processFacebook() {
    const inputPath = path.join(__dirname, '../src/data/export_20260608-050429.csv');
    const outputPath = path.join(__dirname, '../public/data/penny_wave_raw_fb.json');
    
    if (!fs.existsSync(inputPath)) {
        console.error("Facebook input not found at", inputPath);
        return;
    }
    
    const csvData = fs.readFileSync(inputPath, 'utf8');
    const rows = parseCSV(csvData);
    
    const uniqueUsers = new Set();
    const results = [];
    
    // The first row is the header. The columns based on inspection are roughly:
    // 0: row num, 1: empty, 2: Name, 3: Profile ID, 4: Date, 5: Likes, 6: Live video timestamp, 7: Comment
    
    // Skip header
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 8) continue;
        
        const name = (row[2] || '').trim();
        const date = (row[4] || '').trim();
        const comment = (row[7] || '').trim();
        
        if (!name) continue;
        
        results.push({
            Name: name,
            Data: date,
            Comment: comment
        });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Facebook: Trovati ${results.length} commenti validi (da CSV).`);
}

function processInstagram() {
    const inputPath = path.join(__dirname, '../src/data/result-instagram.csv');
    const outputPath = path.join(__dirname, '../public/data/penny_wave_raw_ig.json');
    
    if (!fs.existsSync(inputPath)) {
        console.error("Instagram input not found at", inputPath);
        return;
    }
    
    const csvData = fs.readFileSync(inputPath, 'utf8');
    const rows = parseCSV(csvData);
    
    const uniqueUsers = new Set();
    const results = [];
    
    // Skip header
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 7) continue;
        
        const username = (row[1] || '').trim();
        const profileUrl = (row[2] || '').trim();
        const comment = (row[3] || '').trim();
        const date = (row[6] || '').trim();
        
        if (!username) continue;
        
        results.push({
            Username: username,
            Date: date,
            CommentText: comment,
            ProfileURL: profileUrl
        });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Instagram: Trovati ${results.length} commenti validi (da CSV).`);
}

console.log("Inizio filtraggio Penny Wave...");
processFacebook();
processInstagram();
console.log("Completato.");
