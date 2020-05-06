import moment from 'moment';
import momentJalali from 'moment-jalaali';

export default function isSameMonth(a, b) {
  if (moment.locale() === 'fa') {
    if (!momentJalali.isMoment(a) || !momentJalali.isMoment(b)) return false;

    const aa = momentJalali(a);
    const bb = momentJalali(b);
    return aa.jMonth() === bb.jMonth()
    && aa.jYear === bb.jYear;
  }

  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return a.month() === b.month()
  && a.year() === b.year();

  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
}
