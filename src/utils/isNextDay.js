import moment from 'moment';
import jMoment from 'moment-jalaali';
import isSameDay from './isSameDay';

export default function isNextDay(a, b) {
  let nextDay;
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  if (moment.locale() === 'fa') {
    nextDay = jMoment(a).add(1, 'day');
  } else {
    nextDay = moment(a).add(1, 'day');
  }

  return isSameDay(nextDay, b);
}
