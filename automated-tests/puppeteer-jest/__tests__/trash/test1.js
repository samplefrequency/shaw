const puppeteer = require('puppeteer');

describe('Simple Page Test', () => {
  var browser, page;
  var url = 'https://www.shaw.ca/store/';

  beforeEach (async () => {
      browser = await puppeteer.launch({ headless: true });
      page = await browser.newPage();
  })
  afterEach (() => {
      browser.close()
  })
  test('Page Title', async () => {
      await page.goto(url);
      const title = await page.title();
      expect(title).toBe("Shaw High Speed Internet Service, Cable HDTV & Home Phone + Bundles");
  },10000);

})
