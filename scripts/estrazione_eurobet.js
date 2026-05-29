const fs = require('fs');
const path = require('path');

function filterValid(data) {
    return data.filter(item => {
        const desc = (item.description || item.caption || '').toLowerCase();
        const valid = desc.includes('#sentilapassionedalvivo') &&
                      desc.includes('#accettoregolamento') &&
                      desc.includes('#accettoprivacypolicy') &&
                      (item.username || '').toLowerCase() !== 'eurobet.live';
        return valid;
    });
}

function runExtraction() {
    console.log("Inizio estrazione Eurobet...");

    // 1. Leggi i file
    const masterPath = path.join(__dirname, '../public/data/eurobet_master.json');
    const wave4Path = path.join(__dirname, '../public/data/eurobet_wave4.json');
    
    let masterData = [];
    let wave4Data = [];

    try {
        if (fs.existsSync(masterPath)) {
            masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
        }
    } catch (e) {
        console.error("Errore lettura master:", e);
    }

    try {
        if (fs.existsSync(wave4Path)) {
            wave4Data = JSON.parse(fs.readFileSync(wave4Path, 'utf8'));
        }
    } catch (e) {
        console.error("Errore lettura wave 4:", e);
    }

    // 2. Filtra dati
    const validMaster = filterValid(masterData);
    const validWave4 = filterValid(wave4Data);

    // 3. Unisci e deduplica per username
    const allValid = [...validMaster, ...validWave4];
    const uniqueMap = new Map();
    
    for (const item of allValid) {
        const username = (item.username || '').toLowerCase().trim();
        if (username && !uniqueMap.has(username)) {
            uniqueMap.set(username, {
                username: item.username,
                fullName: item.fullName || '',
                postUrl: item.postUrl || item.url || '',
                description: item.description || item.caption || ''
            });
        }
    }

    const uniqueParticipants = Array.from(uniqueMap.values());
    console.log(`Totale partecipanti unici e validi da tutte le wave: ${uniqueParticipants.length}`);

    // 4. Estrai i vincitori (43 vincitori)
    const NUM_WINNERS = 43;
    let winners = [];
    
    // Mescola in modo casuale (Fisher-Yates shuffle)
    let shuffled = [...uniqueParticipants];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    winners = shuffled.slice(0, NUM_WINNERS);

    console.log(`Estratti ${winners.length} vincitori.`);

    // 5. Salva i vincitori
    const winnersPath = path.join(__dirname, '../public/data/eurobet_vincitori.json');
    fs.writeFileSync(winnersPath, JSON.stringify(winners, null, 2));

    // Salva anche come CSV
    const csvPath = path.join(__dirname, '../public/data/eurobet_vincitori.csv');
    const csvHeader = "Posizione,Username,FullName,PostURL\n";
    const csvRows = winners.map((w, index) => `${index + 1},${w.username},"${w.fullName}",${w.postUrl}`).join('\n');
    fs.writeFileSync(csvPath, csvHeader + csvRows);

    console.log(`Vincitori salvati in:\n- ${winnersPath}\n- ${csvPath}`);
}

runExtraction();
