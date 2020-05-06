import moment from 'moment';
import jMoment from 'moment-jalaali';
import isSameMonth from './isSameMonth';

export default function isPrevMonth(a, b) {
  let prevMonth;

  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;

  if (moment.locale() === 'fa') {
    prevMonth = a.clone().subtract(1, 'jMonth');
  } else {
    prevMonth = a.clone().subtract(1, 'month');
  }

  return isSameMonth(prevMonth, b);
}
