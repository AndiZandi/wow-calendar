import { MONTHS } from './consts.js';

export const getEventIdFromUrl = (url) => {
  const regex = /event=(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getNumericMonthForMonthName = (monthName) => {
  return MONTHS[monthName.toLowerCase()];
};

export const getUniqueValues = (data) => {
  const uniqueValues = new Set();

  for (const year in data) {
    for (const month in data[year]) {
      for (const day in data[year][month]) {
        if (Array.isArray(data[year][month][day])) {
          data[year][month][day].forEach((value) => uniqueValues.add(value));
        } else {
          console.log(
            `Somehow got a non-array value for ${year}/${month}/${day}`
          );
        }
      }
    }
  }

  return Array.from(uniqueValues);
};
