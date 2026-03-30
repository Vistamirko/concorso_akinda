const readline = require('readline');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  const browser = await puppeteer.launch({ headless: false }); // Set to true for production
  
  // Load existing cookies if they exist
  const cookiesPath = path.join(__dirname, 'cookies.json');
  
  try {
    const page = await browser.newPage();
    if (fs.existsSync(cookiesPath)) {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath));
      await page.setCookie(...cookies);
      console.log('🍪 Cookie caricati con successo.');
    }
    await page.close();

    console.log('Starting scraping process...');

    // 1. Scraping Facebook Hashtag Posts
    if (process.env.FB_HASHTAG) {
      try {
        console.log(`Scraping Facebook hashtag: #${process.env.FB_HASHTAG}`);
        const fbHashtagData = await facebook.scrapeHashtag(browser, process.env.FB_HASHTAG);
        if (fbHashtagData.length > 0) {
          fs.writeFileSync(
            path.join(__dirname, '../src/data/hashtag-facebook.json'),
            JSON.stringify(fbHashtagData, null, 2)
          );
        }
      } catch (e) {
        console.error(`Errore durante lo scraping di FB Hashtag: ${e.message}`);
      }
    }

    // 2. Scraping Instagram Hashtag Posts
    if (process.env.IG_HASHTAG) {
      try {
        console.log(`Scraping Instagram hashtag: #${process.env.IG_HASHTAG}`);
        const igHashtagData = await instagram.scrapeHashtag(browser, process.env.IG_HASHTAG);
        if (igHashtagData.length > 0) {
          fs.writeFileSync(
            path.join(__dirname, '../src/data/hashtag-instagram.json'),
            JSON.stringify(igHashtagData, null, 2)
          );
        }
      } catch (e) {
        console.error(`Errore durante lo scraping di IG Hashtag: ${e.message}`);
      }
    }

    // 3. Scraping Instagram Comments
    if (process.env.IG_POST_URL) {
      try {
        console.log(`Scraping Instagram comments from: ${process.env.IG_POST_URL}`);
        const igCommentsData = await instagram.scrapeComments(browser, process.env.IG_POST_URL);
        if (igCommentsData.length > 0) {
          fs.writeFileSync(
            path.join(__dirname, '../src/data/igcomment.json'),
            JSON.stringify(igCommentsData, null, 2)
          );
        }
      } catch (e) {
        console.error(`Errore durante lo scraping di IG Comments: ${e.message}`);
      }
    }

    console.log('Scraping completed successfully!');
    
    // Save cookies for next session
    const pages = await browser.pages();
    const allCookies = [];
    for (const p of pages) {
      const c = await p.cookies();
      allCookies.push(...c);
    }
    fs.writeFileSync(path.join(__dirname, 'cookies.json'), JSON.stringify(allCookies, null, 2));
    console.log('💾 Cookie salvati per la prossima sessione.');
    
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

module.exports = {
  askQuestion
};

main();
