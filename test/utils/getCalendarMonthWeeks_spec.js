import moment from 'moment';
import jMoment from 'moment-jalaali';
import { expect } from 'chai';

import isSameDay from '../../src/utils/isSameDay';
import getCalendarMonthWeeks from '../../src/utils/getCalendarMonthWeeks';

const isFa = moment.locale() === 'fa';

const today = isFa ? jMoment() : moment();
const weeks = getCalendarMonthWeeks(today);
const weeksWithOutsideDays = getCalendarMonthWeeks(today, true);

describe('getCalendarMonthWeeks', () => {
  describe('input validation', () => {
    it('throws a TypeError if first arg is not a valid moment object', () => {
      const invalidValues = [
        null,
        '2017-01-01T00:00:00Z',
        new Date(),
        moment.invalid(),
      ];
      invalidValues.forEach((value) => {
        expect(() => getCalendarMonthWeeks(value))
          .to.throw(TypeError, '`month` must be a valid moment object');
      });
    });

    it('throws a TypeError if third arg is not an integer between 0 and 6', () => {
      const invalidValues = [
        null,
        -1,
        7,
        '0',
        '1',
        1.5,
      ];
      invalidValues.forEach((value) => {
        expect(() => getCalendarMonthWeeks(today, true, value))
          .to.throw(TypeError, '`firstDayOfWeek` must be an integer between 0 and 6');
      });
    });
  });

  it('returns an array of arrays', () => {
    expect(weeks).to.be.instanceof(Array);

    weeks.forEach((week) => {
      expect(week).to.be.instanceof(Array);
    });
  });

  it('today is included', () => {
    let isIncluded = false;
    weeks.forEach((week) => {
      week.forEach((day) => {
        if (day && day.isSame(today, 'day')) isIncluded = true;
      });
    });

    expect(isIncluded).to.equal(true);
  });

  it('all days have a time of 12PM', () => {
    weeks.forEach((week) => {
      week.forEach((day) => {
        if (day) {
          expect(day.hours()).to.equal(12);
        }
      });
    });
  });

  describe('padding when enableOutsideDays is false', () => {
    let weeksWithPadding;

    beforeEach(() => {
      // using specific month 1 Bahman 1395 or Feb 2017 to manually compare with calendar and
      weeksWithPadding = getCalendarMonthWeeks(isFa ? jMoment('1395/11/01', 'jYYYY/jMM/jDD') : moment('2017-02-01'), false);
    });

    it('null pads leading days', () => {
      const firstWeek = weeksWithPadding[0];
      if (isFa) {
        expect(firstWeek[0]).to.equal(null); // Shanbe 25 Dey
        expect(firstWeek[1]).to.equal(null); // Yek-shanbe 26 Dey
        expect(firstWeek[2]).to.equal(null); // Do-shanbe 27 Dey
        expect(firstWeek[3]).to.equal(null); // Se-shanbe 28 Dey
        expect(firstWeek[4]).to.equal(null); // Chahar-shanbe 29 Dey
        expect(firstWeek[5]).to.equal(null); // Panj-shanbe 30 Dey
        expect(firstWeek[6]).to.not.equal(null); // Jome 1 Bahman
      } else {
        expect(firstWeek[0]).to.equal(null); // Sun Jan 29
        expect(firstWeek[1]).to.equal(null); // Mon Jan 30
        expect(firstWeek[2]).to.equal(null); // Tue Jan 31
        expect(firstWeek[3]).to.not.equal(null); // Wed Feb 1
      }
    });

    it('null pads trailing days', () => {
      const lastWeek = weeksWithPadding[weeksWithPadding.length - 1];
      if (isFa) {
        expect(lastWeek[0]).to.not.equal(null); // Shanbe 30 Bahman
        expect(lastWeek[1]).to.equal(null); // Yek-shanbe 1 Esfand
        expect(lastWeek[2]).to.equal(null); // Do-shanbe 2 Esfand
        expect(lastWeek[3]).to.equal(null); // Se-shanbe 3 Esfand
        expect(lastWeek[4]).to.equal(null); // Chahar-shanbe 4 Esfand
        expect(lastWeek[5]).to.equal(null); // Panj-shanbe 5 Esfand
        expect(lastWeek[6]).to.equal(null); // Jome 6 Esfand
      } else {
        expect(lastWeek[2]).to.not.equal(null); // Tue Feb 28
        expect(lastWeek[3]).to.equal(null); // Wed Mar 1
        expect(lastWeek[4]).to.equal(null); // Thu Mar 2
        expect(lastWeek[5]).to.equal(null); // Fri Mar 3
        expect(lastWeek[6]).to.equal(null); // Sat Mar 4
      }
    });
  });

  describe('Daylight Savings Time issues', () => {
    it('last of February does not equal first of March', () => {
      const february = getCalendarMonthWeeks(today.clone().month(1));
      const lastWeekOfFebruary = february[february.length - 1].filter(Boolean);
      const lastOfFebruary = lastWeekOfFebruary[lastWeekOfFebruary.length - 1];

      const march = getCalendarMonthWeeks(today.clone().month(2));
      const firstOfMarch = march[0].filter(Boolean)[0];

      expect(isSameDay(lastOfFebruary, firstOfMarch)).to.equal(false);
    });

    it('last of March does not equal first of April', () => {
      const march = getCalendarMonthWeeks(today.clone().month(2));
      const lastWeekOfMarch = march[march.length - 1].filter(Boolean);
      const lastOfMarch = lastWeekOfMarch[lastWeekOfMarch.length - 1];

      const april = getCalendarMonthWeeks(today.clone().month(3));
      const firstOfApril = april[0].filter(Boolean)[0];

      expect(isSameDay(lastOfMarch, firstOfApril)).to.equal(false);
    });
  });

  describe('enableOutsideDays arg is false', () => {
    it('first non-null element is first of the month', () => {
      const firstOfMonth = today.clone().startOf(isFa ? 'jMonth' : 'month');
      const firstNonNullDay = weeks[0].filter((day) => day)[0];
      expect(firstOfMonth.isSame(firstNonNullDay, 'day')).to.equal(true);
    });

    it('last non-null element is last of the month', () => {
      const lastOfMonth = today.clone().endOf(isFa ? 'jMonth' : 'month');
      const lastWeek = weeks[weeks.length - 1].filter((day) => day);
      const lastNonNullDay = lastWeek[lastWeek.length - 1];
      expect(lastOfMonth.isSame(lastNonNullDay, 'day')).to.equal(true);
    });

    it('number of non-null elements is equal to number of days in month', () => {
      const daysInCalendarMonthWeeks = weeks.reduce((a, b) => a + b.filter((day) => day).length, 0);
      expect(daysInCalendarMonthWeeks).to.equal(today.daysInMonth());
    });
  });

  describe('enableOutsideDays arg is true', () => {
    it('contains first of the month', () => {
      const firstOfMonth = today.clone().startOf(isFa ? 'jMonth' : 'month');
      const containsFirstOfMonth = weeksWithOutsideDays[0]
        .filter((day) => firstOfMonth.isSame(day, 'day')).length > 0;
      expect(containsFirstOfMonth).to.equal(true);
    });

    it('last week contains last of the month', () => {
      const lastOfMonth = today.clone().endOf(isFa ? 'jMonth' : 'month');
      const containsLastOfMonth = weeks[weeksWithOutsideDays.length - 1]
        .filter((day) => lastOfMonth.isSame(day, 'day')).length > 0;
      expect(containsLastOfMonth).to.equal(true);
    });

    it('last week contains last of the month if next month begins on Sunday', () => {
      const december2016 = moment('2016-12-01');
      const lastOfMonth = december2016.clone().endOf(isFa ? 'jMonth' : 'month');
      const weeksInDecember = getCalendarMonthWeeks(december2016);
      const containsLastOfMonth = weeksInDecember[weeksInDecember.length - 1]
        .filter((day) => lastOfMonth.isSame(day, 'day')).length > 0;
      expect(containsLastOfMonth).to.equal(true);
    });

    it('last week contains last of the month if next month begins on Monday', () => {
      moment.locale('es');
      const april2017 = moment('2017-04-01');
      const lastOfMonth = april2017.clone().endOf(isFa ? 'jMonth' : 'month');
      const weeksInApril = getCalendarMonthWeeks(april2017);
      const containsLastOfMonth = weeksInApril[weeksInApril.length - 1]
        .filter((day) => lastOfMonth.isSame(day, 'day')).length > 0;
      expect(containsLastOfMonth).to.equal(true);
    });

    it('last week contains last of the month if next month begins on Saturday', () => {
      const september2016 = moment('2016-09-01');
      const lastOfMonth = september2016.clone().endOf(isFa ? 'jMonth' : 'month');
      const weeksInSeptember = getCalendarMonthWeeks(september2016);
      const containsLastOfMonth = weeksInSeptember[weeksInSeptember.length - 1]
        .filter((day) => lastOfMonth.isSame(day, 'day')).length > 0;
      expect(containsLastOfMonth).to.equal(true);
    });

    it('each week has 7 non-null elements', () => {
      const hasNoNullElements = weeksWithOutsideDays
        .reduce((w1, w2) => w1 && w2.reduce((d1, d2) => d1 && !!d2, true), true);
      expect(hasNoNullElements).to.equal(true);
    });
  });

  describe('setting firstDayOfWeek argument', () => {
    // using these known dates to see if they appear at the right position of the calendar
    // trying different firstDayOfWeek values
    const january2017Start = moment('2017-01-01'); // Sunday
    const january2017End = january2017Start.clone().endOf('month'); // Tuesday

    it('month starts at [0][0] when first day is Sunday and first day of week is Sunday', () => {
      const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start, false, 0); // 0: Sun
      const firstDayOfMonth = weeksInJanuary2017[0][0];
      const rightPosition = january2017Start.isSame(firstDayOfMonth, 'day');
      expect(rightPosition).to.equal(true);
    });

    it('month ends at [n][2] when last day is Tuesday and first day of week is Sunday', () => {
      const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start, false, 0); // 0: Sun
      const lastDayOfMonth = weeksInJanuary2017[weeksInJanuary2017.length - 1][2];
      const rightPosition = january2017End.isSame(lastDayOfMonth, 'day');
      expect(rightPosition).to.equal(true);
    });

    it('month starts at [0][4] when first day is Sunday and first day of week is Wednesday', () => {
      const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start, false, 3); // 3: Wed
      const firstDayOfMonth = weeksInJanuary2017[0][4];
      const rightPosition = january2017Start.isSame(firstDayOfMonth, 'day');
      expect(rightPosition).to.equal(true);
    });

    it('month ends at [n][6] when last day is Tuesday and first day of week is Wednesday', () => {
      const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start, false, 3);// 3: Wed
      const lastDayOfMonth = weeksInJanuary2017[weeksInJanuary2017.length - 1][6];
      const rightPosition = january2017End.isSame(lastDayOfMonth, 'day');
      expect(rightPosition).to.equal(true);
    });
  });

  describe('firstDayOfWeek default value locale-aware', () => {
    // using these known dates to see if they appear at the right position of the calendar
    // trying different firstDayOfWeek values
    const january2017Start = moment('2017-01-01'); // Sunday
    const january2017End = january2017Start.clone().endOf('month'); // Tuesday

    describe('locale with Sunday as first day of week', () => {
      beforeEach(() => {
        moment.locale('en');
      });

      it('month starts at [0][0] if first day is Sunday', () => {
        const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start);
        const firstDayOfMonth = weeksInJanuary2017[0][0];
        const rightPosition = january2017Start.isSame(firstDayOfMonth, 'day');
        expect(rightPosition).to.equal(true);
      });

      it('month ends at [n][2] if last day is Tuesday', () => {
        const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start);
        const lastDayOfMonth = weeksInJanuary2017[weeksInJanuary2017.length - 1][2];
        const rightPosition = january2017End.isSame(lastDayOfMonth, 'day');
        expect(rightPosition).to.equal(true);
      });
    });

    describe('locale with Monday as first day of week', () => {
      beforeEach(() => {
        moment.locale('es');
      });

      it('month starts at [0][6] if first day is Sunday', () => {
        const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start);
        const firstDayOfMonth = weeksInJanuary2017[0][6];
        const rightPosition = january2017Start.isSame(firstDayOfMonth, 'day');
        expect(rightPosition).to.equal(true);
      });

      it('month ends at [n][1] if last day is Tuesday', () => {
        const weeksInJanuary2017 = getCalendarMonthWeeks(january2017Start);
        const lastDayOfMonth = weeksInJanuary2017[weeksInJanuary2017.length - 1][1];
        const rightPosition = january2017End.isSame(lastDayOfMonth, 'day');
        expect(rightPosition).to.equal(true);
      });
    });
  });
});
