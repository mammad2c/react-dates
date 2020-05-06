import moment from 'moment';
import jMoment from 'moment-jalaali';

import isBeforeDay from './isBeforeDay';
import isSameDay from './isSameDay';

export default function isAfterDay(a, b) {
  // if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b) && !isSameDay(a, b);
}
