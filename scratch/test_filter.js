const fs = require('fs');
const path = require('path');

function isCommentValid(text) {
    if (!text) return false;
    const cleanText = text.toLowerCase().replace(/[\s\#\_]/g, '');
    
    const hasProduct = cleanText.includes('prodottomisteriosopenny') || cleanText.includes('prorodottomisterioso') || cleanText.includes('prodottomisterioso');
    const hasRules = cleanText.includes('regolamento');
    const hasPrivacy = cleanText.includes('privacy');
    
    return hasProduct && hasRules && hasPrivacy;
}

const inputPath = path.join(__dirname, '../public/data/fbcomment.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let count = 0;
for (const item of data) {
    if (isCommentValid(item.Comment)) {
        count++;
    } else {
        console.log("REJECTED:", item.Comment);
    }
}
console.log(`\nValid: ${count} out of ${data.length}`);
