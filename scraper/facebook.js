const path = require('path');

async function scrapeHashtag(browser, hashtag) {
  const page = await browser.newPage();
  // Facebook hashtag URL
  const url = `https://www.facebook.com/hashtag/${hashtag}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for posts to load - Facebook often uses role="article" or specific data attributes
  try {
    await page.waitForSelector('div[role="article"], div[data-testid="post_container"]', { timeout: 30000 });
  } catch (e) {
    console.warn('Non è stato possibile trovare post di Facebook. Assicurati di essere loggato se richiesto.');
    return [];
  }

  const posts = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('div[role="article"], div[data-testid="post_container"]'));
    return articles.map(article => {
      const nameEl = article.querySelector('h3 span strong');
      const textEl = article.querySelector('div[data-ad-preview="message"]');
      const linkEl = article.querySelector('a[href*="/posts/"]');
      const imgEl = article.querySelector('img');

      return {
        id: Math.random().toString(36).substr(2, 9), // Placeholder ID
        name: nameEl ? nameEl.innerText : 'Unknown',
        profileUrl: linkEl ? linkEl.href : '',
        profilePic: imgEl ? imgEl.src : '',
        hashtag: window.location.pathname.split('/').pop(),
        url: linkEl ? linkEl.href : '',
        date: new Date().toISOString(),
        postId: linkEl ? linkEl.href.split('/').pop() : '',
        text: textEl ? textEl.innerText : ''
      };
    });
  });

  return posts;
}

module.exports = {
  scrapeHashtag
};
