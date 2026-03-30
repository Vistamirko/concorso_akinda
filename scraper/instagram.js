async function scrapeHashtag(browser, hashtag) {
  const page = await browser.newPage();
  const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
  
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Check if we are on a login page
  const isLoginPage = await page.evaluate(() => {
    return document.querySelectorAll('input[name="username"]').length > 0;
  });

  if (isLoginPage) {
    console.log('⚠️ Instagram richiede il login.');
  }

  try {
    // Wait for core content to appear
    await page.waitForSelector('img.x5yr21d, div._aabd img, [role="main"] img', { timeout: 15000 });
  } catch (e) {
    console.log('\n🔍 Scraper bloccato o contenuto non caricato.');
    console.log('Per favore controlla la finestra del browser aperta:');
    console.log('1. Accetta eventuali cookie o popup.');
    console.log('2. Assicurati di essere loggato.');
    console.log('3. Assicurati che le immagini dell\'hashtag siano visibili.');
    await require('./index').askQuestion('👉 Premi INVIO qui nel terminale quando la pagina è pronta per essere scansionata...');
  }

  const posts = await page.evaluate((hashtag) => {
    // Selectors for Instagram grid items - very broad attempt
    const gridItems = Array.from(document.querySelectorAll('div._aabd, a[href*="/p/"], a[href*="/reel/"], div.x1n2onr6, img[src*="cdninstagram"]'));
    return gridItems.map(item => {
      let img = item.tagName === 'IMG' ? item : item.querySelector('img');
      const link = item.tagName === 'A' ? item : item.closest('a') || item.querySelector('a');
      
      return {
        caption: img ? img.alt : '',
        id: link ? link.href.split('/').filter(Boolean).pop() : Math.random().toString(36).substr(2, 9),
        fullName: 'Private User',
        url: link ? link.href : '',
        inputUrl: window.location.href
      };
    }).filter(p => p.url && p.url.includes('/p/')); // Ensure we only get real posts
  }, hashtag);

  return posts;
}

async function scrapeComments(browser, postUrl) {
  if (!postUrl.includes('/p/') && !postUrl.includes('/reel/')) {
    console.warn(`⚠️ L'URL fornito (${postUrl}) non sembra essere un post o un reel.`);
    return [];
  }

  const page = await browser.newPage();
  await page.goto(postUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  try {
    // Broad wait for any list-like content
    await page.waitForSelector('ul, [role="list"], div.x168nmei, li', { timeout: 15000 });
  } catch (e) {
    console.log('\n🔍 Commenti non trovati automaticamente.');
    await require('./index').askQuestion('👉 Assicurati che i commenti siano visibili nel browser e premi INVIO qui...');
  }

  const comments = await page.evaluate(() => {
    const commentList = Array.from(document.querySelectorAll('ul > div > li'));
    return commentList.map(li => {
      const userEl = li.querySelector('h3 a');
      const textEl = li.querySelector('span');
      const picEl = li.querySelector('img');

      return {
        UserId: Math.random().toString(36).substr(2, 9),
        Username: userEl ? userEl.innerText : 'Unknown',
        CommentId: Math.random().toString(36).substr(2, 9),
        CommentText: textEl ? textEl.innerText : '',
        ProfileURL: userEl ? userEl.href : '',
        ProfilePicURL: picEl ? picEl.src : '',
        Date: new Date().toLocaleString()
      };
    });
  });

  return comments;
}

module.exports = {
  scrapeHashtag,
  scrapeComments
};
