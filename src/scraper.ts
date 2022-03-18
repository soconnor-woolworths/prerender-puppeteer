import * as puppeteer from 'puppeteer';

export class Scraper {
  constructor() {}

  public scrap() {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      const url = 'https://www.woolworths.com.au/';

      console.log('Navigating to ', url);

      //{waitUntil: 'load'} // Which is better to use?
      await page.goto(url, { waitUntil: 'networkidle0' });

      const bodyHandle = await page.$('body');
      const html = await page.evaluate((body) => body.innerHTML, bodyHandle);
      console.log(html);

      browser.close();
    })();
  }
}
