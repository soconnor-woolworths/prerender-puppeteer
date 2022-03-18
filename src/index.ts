import { Scraper } from './scraper';

const scraper = new Scraper();
scraper.scrap();

// TODO: Get list of urls we want to exclude query params from
// TODO: Loop through urls from site map (ignoring duplicates from the list above)
// TODO: Remove any <script> tags
// TODO: Store the files locally
// TODO: Store the files on blob storage
