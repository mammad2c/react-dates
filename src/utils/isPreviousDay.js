import moment from 'moment';
import jMoment from 'moment-jalaali';
import isSameDay from './isSameDay';

export default function isPreviousDay(a, b) {
  let dayBefore;
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  if (moment.locale() === 'fa') {
    dayBefore = jMoment(a).subtract(1, 'day');
  } else {
    dayBefore = moment(a).subtract(1, 'day');
  }

  return isSameDay(dayBefore, b);
}
