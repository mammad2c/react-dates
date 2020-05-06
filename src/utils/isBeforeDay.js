import moment from 'moment';
import jMoment from 'moment-jalaali';

export default function isBeforeDay(a, b) {
  const isFa = moment.locale() === 'fa';

  if (isFa) {
    if (!jMoment.isMoment(a) || !jMoment.isMoment(b)) return false;
  } else if (!moment.isMoment(a) || !moment.isMoment(b)) return false;

  const aa = jMoment(a);
  const bb = jMoment(b);

  const aYear = isFa ? aa.jYear() : a.year();
  const aMonth = isFa ? aa.jMonth() : a.month();

  const bYear = isFa ? bb.jYear() : b.year();
  const bMonth = isFa ? bb.jMonth() : b.month();

  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;

  if (isSameYear && isSameMonth) return isFa ? aa.jDate() < bb.jDate() : a.date() < b.date();
  if (isSameYear) return aMonth < bMonth;
  return aYear < bYear;
}
