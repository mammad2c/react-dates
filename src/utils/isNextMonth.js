import moment from 'moment';
import jMoment from 'moment-jalaali';
import isSameMonth from './isSameMonth';

export default function isNextMonth(a, b) {
  let nextMonth;
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  if (moment.locale() === 'fa') {
    nextMonth = jMoment(a).add(1, 'jMonth');
  } else {
    nextMonth = moment(a).add(1, 'month');
  }

  return isSameMonth(nextMonth, b);
}
