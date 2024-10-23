import { WOWHEAD_EVENT_BASE_URL } from '../consts.js';

export const getDataForEvent = async (page, eventId) => {
  console.log(`Trying to get data for event ${eventId}`);
  try {
    await page.goto(WOWHEAD_EVENT_BASE_URL + eventId);

    // Get the event title
    const eventTitle = await page
      .$eval('h1.heading-size-1.h1-icon', (b) => b.innerText)
      .catch(() => {
        throw new Error(
          'Error: failed to find element matching selector "#main-contents > div:nth-child(9) > h1"'
        );
      });

    // Get the background image
    const backgroundImage = await page.evaluate(() => {
      const selector = 'div.iconmedium > ins';
      const element = document.querySelector(selector);
      if (!element)
        throw new Error(
          `Error: failed to find element matching selector "${selector}"`
        );
      const style = getComputedStyle(element);
      return style.backgroundImage;
    });

    // Get the start and end times
    const times = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('.first.last li div')
      );
      if (!elements.length) {
        throw new Error(
          `Error: failed to find elements matching selector ".first.last li div"`
        );
      }
      const start = elements.find((el) => el.textContent.startsWith('Start:'));
      const end = elements.find((el) => el.textContent.startsWith('End:'));

      return {
        startTime: start ? start.textContent.replace('Start: ', '') : null,
        endTime: end ? end.textContent.replace('End: ', '') : null,
      };
    });

    return { title: eventTitle, icon: backgroundImage, times };
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
