import puppeteer from 'puppeteer';
import { WOWHEAD_CALENDR_URL } from '../consts.js';
import { getDataForYear } from './getDataForYear.js';
import fs from 'fs';

export const getData = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
  });
  const page = await browser.newPage();
  const currentUrl = WOWHEAD_CALENDR_URL;

  console.log(`> Extracting data from ${currentUrl}`);

  page.setDefaultNavigationTimeout(60000);
  await page.goto(currentUrl);

  const rejectCookies = await page.$('#onetrust-reject-all-handler');
  await rejectCookies.click();

  const rejectNotifications = await page.$(
    'body > div.notifications-dialog > div.notifications-dialog-buttons > button.notifications-dialog-buttons-decline.btn'
  );
  await rejectNotifications.click();

  const yearData = await getDataForYear(page);

  // Write the JSON string to a file
  fs.writeFile('yearData.json', JSON.stringify(yearData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Successfully wrote to file');
    }
  });

  await browser.close();
};

getData();
