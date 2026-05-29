const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../public/data/eurobet_master.json');
const wave4Path = path.join(__dirname, '../public/data/eurobet_wave4.json');

let masterData = [];
let wave4Data = [];

if (fs.existsSync(masterPath)) {
    masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
}

if (fs.existsSync(wave4Path)) {
    wave4Data = JSON.parse(fs.readFileSync(wave4Path, 'utf8'));
}

const existingUrls = new Set(masterData.map(item => item.postUrl));

let addedCount = 0;

wave4Data.forEach(item => {
    // Basic format matching eurobet_master.json
    const newItem = {
        postUrl: item.postUrl || "",
        profileUrl: `https://www.instagram.com/${item.username}`,
        username: item.username || "",
        fullName: item.username || "", // we don't have fullName, use username
        commentCount: 0,
        likeCount: 0,
        pubDate: item.pubDate || new Date().toISOString(),
        description: item.description || "",
        imgUrl: "",
        postId: "",
        ownerId: "",
        type: "Unknown",
        query: "#sentilapassionedalvivo",
        timestamp: new Date().toISOString(),
        location: "",
        isSidecar: false,
        postCount: masterData.length > 0 ? masterData[0].postCount : 119
    };

    if (!existingUrls.has(newItem.postUrl)) {
        masterData.push(newItem);
        existingUrls.add(newItem.postUrl);
        addedCount++;
    }
});

fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2));

console.log(`Aggiunti ${addedCount} nuovi post a eurobet_master.json da wave4.`);
console.log(`Totale post in eurobet_master.json: ${masterData.length}`);
