import moment from 'moment';
import jMoment from 'moment-jalaali';
import toMomentObject from './toMomentObject';

export default function toISOMonthString(date, currentFormat) {
  const isFa = moment.locale() === 'fa';
  let dateObj;

  if (isFa) {
    dateObj = jMoment.isMoment(date) ? date : toMomentObject(date, currentFormat);
  } else {
    dateObj = moment.isMoment(date) ? date : toMomentObject(date, currentFormat);
  }

  if (!dateObj) return null;

  if (isFa && dateObj.jYear && dateObj.jMonth) {
    // Template strings compiled in strict mode uses concat, which is slow. Since
    // this code is in a hot path and we want it to be as fast as possible, we
    // want to use old-fashioned +.
    // eslint-disable-next-line prefer-template
    return dateObj.jYear() + '-' + String(dateObj.jMonth() + 1).padStart(2, '0');
  }

  // eslint-disable-next-line prefer-template
  return dateObj.year() + '-' + String(dateObj.month() + 1).padStart(2, '0');
}
