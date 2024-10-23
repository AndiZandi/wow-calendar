import { getDataForMonth } from './getDataForMonth.js';
import { getNumericMonthForMonthName } from '../helper.js';

export const getDataForYear = async (page) => {
  const yearData = {};

  const dataForCurrentMonth = async () => {
    // Get the month of the currently displayed page
    const pageMonth = await page.$eval(
      '#tab-calendar > div.listview-band-top > div.listview-nav > span > b',
      (b) => b.innerText
    );
    const numericPageMonth = getNumericMonthForMonthName(
      pageMonth.split(' ')[0]
    );
    const numericPageYear = pageMonth.split(' ')[1];
    const monthData = await getDataForMonth(page);

    if (yearData[numericPageYear] === undefined) {
      yearData[numericPageYear] = {};
    }
    yearData[numericPageYear][numericPageMonth] = monthData;
  };

  for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    await dataForCurrentMonth();

    const nextMonthButton = await page.$(
      '#tab-calendar > div.listview-band-top > div.listview-nav > a:nth-child(5)'
    );

    await nextMonthButton.click();
  }

  return yearData;
};
