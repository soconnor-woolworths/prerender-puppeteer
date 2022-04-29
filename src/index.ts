import { Scraper } from './scraper';
import { Uploader } from './uploader';

const scraper = new Scraper(new Uploader());
scraper.scrap();

// TODO: Get list of urls we want to exclude query params from
// TODO: Scrape mobile, tablet and desktop versions
// TODO: Loop through urls from site map (ignoring duplicates from the list above)
// TODO: Remove any <script> tags
// TODO: Store the files locally - save based on the url name - be aware of special characters (change the character to something else)
// TODO: Store the files on blob storage
