const fs = require('fs');
const path = require('path');

function isCommentValid(text) {
    if (!text) return false;
    const cleanText = text.toLowerCase().replace(/[\s\#\_]/g, '');
    
    const hasProduct = cleanText.includes('prodottomisteriosopenny') || cleanText.includes('prorodottomisterioso') || cleanText.includes('prodottomisterioso');
    const hasRules = cleanText.includes('regolamento');
    const hasPrivacy = cleanText.includes('privacy') || cleanText.includes('pryvacy');
    
    return hasProduct && hasRules && hasPrivacy;
}

function processFacebook() {
    const inputPath = path.join(__dirname, '../public/data/fbcomment.json');
    const outputPath = path.join(__dirname, '../public/data/penny_wave_latest_fb.json');
    
    if (!fs.existsSync(inputPath)) {
        console.error("Facebook input not found");
        return;
    }
    
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const uniqueUsers = new Set();
    const results = [];
    
    for (const item of data) {
        const username = (item.Name || '').trim();
        if (!username || uniqueUsers.has(username)) continue;
        
        if (isCommentValid(item.Comment)) {
            uniqueUsers.add(username);
            results.push(item);
        }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Facebook: Trovati ${results.length} commenti validi (da totale ${data.length}).`);
}

function processInstagram() {
    const inputPath = path.join(__dirname, '../public/data/igcomment.json');
    const outputPath = path.join(__dirname, '../public/data/penny_wave_latest_ig.json');
    
    if (!fs.existsSync(inputPath)) {
        console.error("Instagram input not found");
        return;
    }
    
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const uniqueUsers = new Set();
    const results = [];
    
    for (const item of data) {
        const username = (item.Username || '').trim();
        if (!username || uniqueUsers.has(username)) continue;
        
        if (isCommentValid(item.CommentText)) {
            uniqueUsers.add(username);
            results.push(item);
        }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Instagram: Trovati ${results.length} commenti validi (da totale ${data.length}).`);
}

console.log("Inizio filtraggio Penny Wave dai dati uniti...");
processFacebook();
processInstagram();
console.log("Completato.");
