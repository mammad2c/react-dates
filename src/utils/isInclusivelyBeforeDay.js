import moment from 'moment';
import jMoment from 'moment-jalaali';
import isAfterDay from './isAfterDay';

export default function isInclusivelyBeforeDay(a, b) {
  // if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isAfterDay(a, b);
}
