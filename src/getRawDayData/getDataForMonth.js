import { getEventIdFromUrl } from '../helper.js';

export const getDataForMonth = async (page) => {
  const monthData = {};

  // Select all cells (td) elements within the target tbody
  const dayCells = await page.$$(
    '#tab-calendar > div.listview-scroller-horizontal > div > table > tbody > tr > td:not(.empty-cell)'
  );
  //   console.log(`Cells: ${dayCells.length}`);

  // Use a for...of loop instead of forEach to handle async/await properly
  for (const dayCell of dayCells) {
    const dayCellDivs = await dayCell.$$('div:not(.iconmedium)');

    // supposed to be two divs, one with the day, one with the data
    if (dayCellDivs.length !== 2) {
      continue; // Skip if the structure is not as expected
    }

    // Get the day number from the first div
    const dayCellDay = Number(
      await dayCellDivs[0].evaluate((el) => el.textContent.trim())
    );

    // Get the event links from the second div
    const dayCellDataLinks = await dayCellDivs[1].$$eval(
      'div.iconmedium > a',
      (links) => links.map((a) => a.href)
    );
    dayCellDataLinks.forEach((link, index, array) => {
      array[index] = getEventIdFromUrl(link);
    });

    console.log(
      `Day ${dayCellDay} has ${dayCellDataLinks.length} ongoing events`
    );

    monthData[dayCellDay] = dayCellDataLinks;
  }

  return monthData;
};
