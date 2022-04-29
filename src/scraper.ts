import * as puppeteer from 'puppeteer';
import { Uploader } from './uploader';
import { SitemapURLExtract } from './sitemap';

export class Scraper {
  constructor(private uploader: Uploader) {}

  public scrap() {
    (async () => {
      const siteMap = new SitemapURLExtract();
      const urls: any = await siteMap.urlExtract();
      console.log('URLS fetched from sitemaps!!!');
      console.log(urls[0].loc[0]);
      /* fs.writeFileSync('sitedata.json', JSON.stringify(urls, null, 2), {
        encoding: 'utf8',
      }); */
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      //const url = 'https://www.woolworths.com.au/';

      console.log('Navigating to ', urls[0].loc[0]);

      //{waitUntil: 'load'} // Which is better to use?
      await page.goto(urls[0].loc[0], { waitUntil: 'networkidle0' });

      const bodyHandle = await page.$('body');
      const html = await page.evaluate((body) => body.innerHTML, bodyHandle);
      console.log(html);

      this.uploader
        .uploadFile(urls[0].loc[0], html)
        .then(() => console.log('Upload Done', urls[0].loc[0]))
        .catch((ex) => console.log(ex.message, urls[0].loc[0]));

      browser.close();
    })();
  }
}
