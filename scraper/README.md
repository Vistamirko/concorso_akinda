# Penny Social Scraper

Questo scraper permette di raccogliere dati da Facebook e Instagram per ripopolare i file JSON utilizzati nella dashboard React.

## Requisiti

- [Node.js](https://nodejs.org/) (consigliata versione 16 o superiore)
- [npm](https://www.npmjs.com/)

## Installazione

1. Posizionati nella cartella `scraper`:
   ```bash
   cd scraper
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```

## Configurazione

1. Copia il file `.env.example` in `.env`:
   ```bash
   cp .env.example .env
   ```
2. Modifica il file `.env` inserendo gli hashtag o gli URL che desideri monitorare.

### Nota sui Cookie
Per evitare blocchi da parte di Facebook o Instagram, potrebbe essere necessario iniettare i cookie di sessione. Lo script è configurato per caricare i cookie dal file `.env` se forniti.

## Utilizzo

Esegui lo script principale:
```bash
node index.js
```

Lo script aprirà una finestra di Chromium (in modalità non-headless) per permetterti di vedere il processo e, se necessario, effettuare il login manualmente se rilevato un blocco.

Al termine, i file JSON in `../src/data/` verranno aggiornati automaticamente.
