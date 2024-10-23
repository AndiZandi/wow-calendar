import puppeteer from 'puppeteer';
import { WOWHEAD_CALENDR_URL } from '../consts.js';
import { getDataForYear } from '../getRawDayData/getDataForYear.js';
import fs from 'fs';
import { getUniqueValues } from '../helper.js';
import { getDataForEvent } from './getDataForEvent.js';

export const getEventData = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
  });
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(60000);
  await page.goto(WOWHEAD_CALENDR_URL);

  try {
    const rejectCookies = await page.$('#onetrust-reject-all-handler');
    await rejectCookies.click();
  } catch (err) {
    console.error('Error rejecting cookies', err);
  }
  try {
    const rejectNotifications = await page.$(
      'body > div.notifications-dialog > div.notifications-dialog-buttons > button.notifications-dialog-buttons-decline.btn'
    );
    await rejectNotifications.click();
  } catch (err) {
    console.error('Error rejecting notifications', err);
  }

  const yearData = JSON.parse(await fs.readFileSync('yearData.json', 'utf8'));

  const allEventIds = getUniqueValues(yearData);
  console.log(allEventIds);

  const data = await getDataForEvent(page, allEventIds[1]);

  console.log(data);
  await browser.close();
};

getEventData();
