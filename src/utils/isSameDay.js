import moment from 'moment';
import jMoment from 'moment-jalaali';

export default function isSameDay(a, b) {
  if (moment.locale() === 'fa') {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;

    const aa = jMoment(a);
    const bb = jMoment(b);
    return aa.jDate() === bb.jDate()
            && aa.jMonth() === bb.jMonth()
            && aa.jYear() === bb.jYear();
  }

  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return a.date() === b.date()
            && a.month() === b.month()
            && a.year() === b.year();

  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
}
