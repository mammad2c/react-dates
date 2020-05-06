import moment from 'moment';

import isBeforeDay from './isBeforeDay';
import isAfterDay from './isAfterDay';
import toISOMonthString from './toISOMonthString';

const startCacheOutsideDays = new Map();
const endCacheOutsideDays = new Map();

const startCacheInsideDays = new Map();
const endCacheInsideDays = new Map();

export default function isDayVisible(day, month, numberOfMonths, enableOutsideDays) {
  let formatM = 'month';
  const formatW = 'week';
  if (moment.locale() === 'fa') {
    formatM = 'jMonth';
  }

  if (!moment.isMoment(day)) return false;

  // Cloning is a little expensive, so we want to do it as little as possible.

  const startKey = toISOMonthString(month);
  // eslint-disable-next-line prefer-template
  const endKey = startKey + '+' + numberOfMonths;

  if (enableOutsideDays) {
    if (!startCacheOutsideDays.has(startKey)) {
      startCacheOutsideDays.set(startKey, month.clone().startOf(formatM).startOf(formatW));
    }

    if (isBeforeDay(day, startCacheOutsideDays.get(startKey))) return false;

    if (!endCacheOutsideDays.has(endKey)) {
      endCacheOutsideDays.set(
        endKey,
        month.clone().endOf(formatW).add(numberOfMonths - 1, moment.locale() === 'fa' ? 'jMonth' : 'months').endOf(formatM)
          .endOf(formatW),
      );
    }

    return !isAfterDay(day, endCacheOutsideDays.get(endKey));
  }

  // !enableOutsideDays

  if (!startCacheInsideDays.has(startKey)) {
    startCacheInsideDays.set(startKey, month.clone().startOf(formatM));
  }

  if (isBeforeDay(day, startCacheInsideDays.get(startKey))) return false;

  if (!endCacheInsideDays.has(endKey)) {
    endCacheInsideDays.set(
      endKey,
      month.clone().add(numberOfMonths - 1, moment.locale() === 'fa' ? 'jMonth' : 'months').endOf(formatM),
    );
  }

  return !isAfterDay(day, endCacheInsideDays.get(endKey));
}
