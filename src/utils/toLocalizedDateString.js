import moment from 'moment';
import jMoment from 'moment-jalaali';

import toMomentObject from './toMomentObject';

import { DISPLAY_FORMAT } from '../constants';

export default function toLocalizedDateString(date, currentFormat) {
  let dateObj;
  if (moment.locale() === 'fa') { dateObj = jMoment.isMoment(date) ? date : toMomentObject(date, currentFormat); } else { dateObj = moment.isMoment(date) ? date : toMomentObject(date, currentFormat); }

  if (!dateObj) return null;

  return dateObj.format(DISPLAY_FORMAT);
}
