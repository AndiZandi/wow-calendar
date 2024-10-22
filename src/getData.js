import puppeteer from 'puppeteer';
import { WOWHEAD_CALENDR_URL } from './consts.js';

export const getData = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
  });
  const page = await browser.newPage();
  const currentUrl = WOWHEAD_CALENDR_URL;

  console.log(`> Extracting data from ${currentUrl}`);

  page.setDefaultNavigationTimeout(60000);
  await page.goto(currentUrl);

  await page.screenshot({
    path: 'hn.png',
  });

  const pageMonth = await page.$eval(
    '#tab-calendar > div.listview-band-top > div.listview-nav > span > b',
    (b) => b.innerText
  );
  console.log(pageMonth);

  await browser.close();
};

getData();
