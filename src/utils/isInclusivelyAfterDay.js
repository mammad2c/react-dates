import moment from 'moment';
import jMoment from 'moment-jalaali';
import isBeforeDay from './isBeforeDay';

export default function isInclusivelyAfterDay(a, b) {
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) {
      return false;
    }
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) {
    return false;
  }

  return !isBeforeDay(a, b);
}
