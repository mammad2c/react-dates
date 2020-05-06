import moment from 'moment';
import jMoment from 'moment-jalaali';
import { DISPLAY_FORMAT, ISO_FORMAT } from '../constants';

export default function toMomentObject(dateString, customFormat) {
  const dateFormats = customFormat
    ? [customFormat, DISPLAY_FORMAT, ISO_FORMAT]
    : [DISPLAY_FORMAT, ISO_FORMAT];

  let date;

  if (moment.locale() === 'fa') {
    date = jMoment(dateString, customFormat ? dateFormats : 'jYYYY/jMM/jDD', true);
  } else {
    date = moment(dateString, dateFormats, true);
  }

  return date && date.isValid() ? date.hour(12) : null;
}
