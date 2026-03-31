const config = {
    // URL ufficiale dello storage AWS Milano
    s3BaseUrl: process.env.REACT_APP_S3_BASE_URL || "https://penny-eurobet-storage-milan.s3.eu-south-1.amazonaws.com",
    
    // Percorsi dinamici dei file JSON (Sincronizzati da GitHub)
    eurobetDataPath: "/data/hashtag-instagram.json",
    pennyDataPath: "/data/fbcomment.json",
    
    // Altri percorsi per archivi storici
    igCommentPath: "/data/igcomment.json",
    fbPostPath: "/data/hashtag-facebook.json",
    igPostPath: "/data/hashtag-instagram.json",
    
    // Fallback: se AWS è vuoto, usa i dati locali? (opzionale)
    useLocalFallback: false
};

export default config;
