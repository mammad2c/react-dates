import moment from 'moment';

let getPreviousMonthMemoKey;
let getPreviousMonthMemoValue;

export default function getPreviousMonthMemoLast(month) {
  const formatM = moment.locale() === 'fa' ? 'jMonth' : 'month';
  if (month !== getPreviousMonthMemoKey) {
    getPreviousMonthMemoKey = month;
    getPreviousMonthMemoValue = month.clone().subtract(1, formatM);
  }

  return getPreviousMonthMemoValue;
}
