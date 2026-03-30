const config = {
    // URL ufficiale dello storage AWS Milano (Task A)
    s3BaseUrl: "https://concorso-akinda-storage-1774886841.s3.eu-south-1.amazonaws.com",
    
    // Percorsi dei file JSON (Task B e C)
    eurobetDataPath: "/eurobet/data.json",
    pennyDataPath: "/penny/data.json",
    
    // Fallback: se AWS è vuoto, usa i dati locali? (opzionale)
    useLocalFallback: false
};

export default config;
