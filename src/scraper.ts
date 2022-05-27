import * as puppeteer from 'puppeteer';
import { Uploader } from './uploader';
import { SitemapURLExtract } from './sitemap';
import { saveOrUpdateLookUpUrl } from './updateLookUpTable';
import { removeParams } from './queryConfig';

export class Scraper {
  constructor(private uploader: Uploader) {}

  public scrap() {
    (async () => {
      const siteMap = new SitemapURLExtract();
      const urls: any = await siteMap.urlExtract();
      console.log('URLS fetched from sitemaps!!!');
      //const scraperUrl = urls[0].loc[0];
      console.log(
        'URL before deleting the params: https://www.woolworths.com.au/shop/discover/about-us/offers-and-competitions?name=seafoodcomp-offer&cardId=5744'
      );
      const scraperUrl = removeParams(
        'https://www.woolworths.com.au/shop/discover/about-us/offers-and-competitions?name=seafoodcomp-offer&cardId=5744'
      );
      console.log(scraperUrl);

      /* fs.writeFileSync('sitedata.json', JSON.stringify(urls, null, 2), {
        encoding: 'utf8',
      }); */
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      console.log('Navigating to ', scraperUrl);
      await page.goto(scraperUrl, { waitUntil: 'networkidle0' });
      console.log('Fetching html....');
      const bodyHandle = await page.$('body');
      const html = await page.evaluate((body) => body.innerHTML, bodyHandle);
      console.log('Uploading html to Azure blob storage...');
      var hashedFilename: any = '';
      try {
        hashedFilename = await this.uploader.uploadFile(scraperUrl, html);
      } catch (error) {
        console.log('Failed to Upload the file in Azure blob', error);
      }
      //Connection to DB and update the record in the table

      await saveOrUpdateLookUpUrl(hashedFilename);

      browser.close();
    })();
  }
}
