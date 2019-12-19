import '../_setup.js';
import {
  stripTime,
  dateValue,
  today,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  dayOfTheWeekOf,
  getWeek,
  startOfYearPeriod
} from '../../../js/lib/date.js';

describe('lib/date', function () {
  describe('stripTime()', function () {
    it('returns the time value of 00:00:00 local time of given time value or date', function () {
      let origDate = new Date(2016, 8, 24, 13, 55, 32, 235);
      expect(stripTime(origDate.getTime()), 'to be', new Date(2016, 8, 24).getTime());

      origDate = new Date(2019, 1, 14, 20, 55);
      expect(stripTime(origDate), 'to be', new Date(2019, 1, 14).getTime());
    });
  });

  describe('today()', function () {
    it('returns the time value of 00:00:00 local time of current date', function () {
      const now = new Date();
      const timeValue = today();
      expect(timeValue, 'to be', now.setHours(0, 0, 0, 0));
    });
  });

  describe('dateValue()', function () {
    it('returns the time value of 00:00:00 local time of the date created by given Date constructor parameters', function () {
      // from Date object
      let origDate = new Date(2016, 8, 24, 13, 55, 32, 235);
      let timeValue = dateValue(origDate);
      expect(timeValue, 'to be', new Date(2016, 8, 24).getTime());

      // from Date constructor args
      timeValue = dateValue(2019, 1, 17, 9, 43, 18, 953);
      expect(timeValue, 'to be', new Date(2019, 1, 17).getTime());

      // from string
      let origDateStr = '2020-04-20T02:27:15Z';
      origDate = new Date(origDateStr);
      timeValue = dateValue(origDateStr);
      expect(timeValue, 'to be', origDate.setHours(0, 0, 0, 0));

      // from time value
      origDate = new Date(2016, 8, 24, 13, 55, 32, 235);
      timeValue = dateValue(origDate.getTime());
      expect(timeValue, 'to be', new Date(2016, 8, 24).getTime());
    });

    it('does not map 2-digit year to 1900\'s', function () {
      let date = new Date(dateValue(86, 8, 24));
      expect(date.getFullYear(), 'to be', 86);
      expect(date.getMonth(), 'to be', 8);
      expect(date.getDate(), 'to be', 24);

      date = new Date(dateValue(19, 1, 17));
      expect(date.getFullYear(), 'to be', 19);
      expect(date.getMonth(), 'to be', 1);
      expect(date.getDate(), 'to be', 17);
    });
  });

  describe('addDays()', function () {
    it('returns the time value of N days after a date or time value', function () {
      let date1 = new Date(2019, 11, 31);
      let date2 = addDays(date1, 1);
      expect(date2, 'to be', new Date(2020, 0, 1).getTime());
      expect(addDays(date2, 30), 'to be', new Date(2020, 0, 31).getTime());

      date1 = new Date(2020, 0, 1);
      expect(addDays(date1, -1), 'to be', new Date(2019, 11, 31).getTime());
      expect(addDays(date1, -10), 'to be', new Date(2019, 11, 22).getTime());
    });
  });

  describe('addWeeks()', function () {
    it('returns the time value of N weeks after a date or time value', function () {
      let date1 = new Date(2019, 11, 28);
      let date2 = addWeeks(date1, 1);
      expect(date2, 'to be', new Date(2020, 0, 4).getTime());
      expect(addWeeks(date2, 4), 'to be', new Date(2020, 1, 1).getTime());

      date1 = new Date(2020, 0, 4);
      expect(addWeeks(date1, -1), 'to be', new Date(2019, 11, 28).getTime());
      expect(addWeeks(date1, -8), 'to be', new Date(2019, 10, 9).getTime());
    });
  });

  describe('addMonths()', function () {
    it('returns the time value of N months after a date or time value', function () {
      let date1 = new Date(2019, 11, 31);
      let date2 = addMonths(date1, 1);
      expect(date2, 'to be', new Date(2020, 0, 31).getTime());
      expect(addMonths(date2, 29), 'to be', new Date(2022, 5, 30).getTime());

      date1 = new Date(2020, 0, 1);
      expect(addMonths(date1, -1), 'to be', new Date(2019, 11, 1).getTime());
      expect(addMonths(date1, -18), 'to be', new Date(2018, 6, 1).getTime());
    });

    it('returns the end of the next/prev month if the day of the old date is not in the new month', function () {
      let date = new Date(2019, 9, 31);
      expect(addMonths(date, 1), 'to be', new Date(2019, 10, 30).getTime());
      expect(addMonths(date, 18), 'to be', new Date(2021, 3, 30).getTime());

      date = new Date(2019, 11, 31);
      expect(addMonths(date, -1), 'to be', new Date(2019, 10, 30).getTime());
      expect(addMonths(date, -30), 'to be', new Date(2017, 5, 30).getTime());

      date = new Date(2019, 0, 31);
      expect(addMonths(date, 1), 'to be', new Date(2019, 1, 28).getTime());
      expect(addMonths(date, 13), 'to be', new Date(2020, 1, 29).getTime());

      date = new Date(2020, 0, 31);
      expect(addMonths(date, 1), 'to be', new Date(2020, 1, 29).getTime());
      expect(addMonths(date, 13), 'to be', new Date(2021, 1, 28).getTime());

      date = new Date(2019, 2, 30);
      expect(addMonths(date, -1), 'to be', new Date(2019, 1, 28).getTime());
      expect(addMonths(date, -37), 'to be', new Date(2016, 1, 29).getTime());

      date = new Date(2020, 2, 30);
      expect(addMonths(date, -1), 'to be', new Date(2020, 1, 29).getTime());
      expect(addMonths(date, -37), 'to be', new Date(2017, 1, 28).getTime());

      date = new Date(2020, 1, 29);
      expect(addMonths(date, 12), 'to be', new Date(2021, 1, 28).getTime());
      expect(addMonths(date, -24), 'to be', new Date(2018, 1, 28).getTime());
    });
  });

  describe('addYears()', function () {
    it('returns the time value of N years after a date or time value', function () {
      let date1 = new Date(2019, 11, 31);
      let date2 = addYears(date1, 1);
      expect(date2, 'to be', new Date(2020, 11, 31).getTime());
      expect(addYears(date2, 3), 'to be', new Date(2023, 11, 31).getTime());

      date1 = new Date(2020, 0, 1);
      expect(addYears(date1, -1), 'to be', new Date(2019, 0, 1).getTime());
      expect(addYears(date1, -3), 'to be', new Date(2017, 0, 1).getTime());
    });

    it('returns 2/28 of the year if the old date is 2/29 and the new year is not a leap year', function () {
      const date = new Date(2020, 1, 29);
      expect(addYears(date, 1), 'to be', new Date(2021, 1, 28).getTime());
      expect(addYears(date, -1), 'to be', new Date(2019, 1, 28).getTime());
      expect(addYears(date, -4), 'to be', new Date(2016, 1, 29).getTime());
    });
  });

  describe('dayOfTheWeekOf()', function () {
    it('returns a date object of given day of the week of given date', function () {
      expect(dayOfTheWeekOf(new Date(2017, 0, 1), 0), 'to be', new Date(2017, 0, 1).getTime());
      expect(dayOfTheWeekOf(new Date(2017, 3, 5), 1), 'to be', new Date(2017, 3, 3).getTime());
      expect(dayOfTheWeekOf(new Date(2017, 5, 8), 2), 'to be', new Date(2017, 5, 6).getTime());
      expect(dayOfTheWeekOf(new Date(2017, 9, 31), 3), 'to be', new Date(2017, 10, 1).getTime());
      expect(dayOfTheWeekOf(new Date(2018, 2, 10), 4), 'to be', new Date(2018, 2, 8).getTime());
      expect(dayOfTheWeekOf(new Date(2018, 5, 19), 5), 'to be', new Date(2018, 5, 22).getTime());
      expect(dayOfTheWeekOf(new Date(2018, 10, 20), 6), 'to be', new Date(2018, 10, 24).getTime());
    });

    it('uses sepecified start day of week if it is given', function () {
      expect(dayOfTheWeekOf(new Date(2017, 0, 1), 0, 1), 'to be', new Date(2017, 0, 1).getTime());
      expect(dayOfTheWeekOf(new Date(2017, 3, 5), 1, 3), 'to be', new Date(2017, 3, 10).getTime());
      expect(dayOfTheWeekOf(new Date(2017, 5, 8), 2, 4), 'to be', new Date(2017, 5, 13).getTime());
      expect(dayOfTheWeekOf(new Date(2017, 9, 31), 3, 6), 'to be', new Date(2017, 10, 1).getTime());
      expect(dayOfTheWeekOf(new Date(2018, 2, 10), 4, 5), 'to be', new Date(2018, 2, 15).getTime());
      expect(dayOfTheWeekOf(new Date(2018, 5, 19), 5, 2), 'to be', new Date(2018, 5, 22).getTime());
    });
  });

  describe('getWeek()', function () {
    it('returns ISO week number of given date', function () {
      expect(getWeek(new Date(2015, 0, 1)), 'to be', 1);
      expect(getWeek(new Date(2015, 3, 26)), 'to be', 17);
      expect(getWeek(new Date(2015, 8, 12)), 'to be', 37);
      expect(getWeek(new Date(2015, 10, 15)), 'to be', 46);
      expect(getWeek(new Date(2016, 0, 1)), 'to be', 53);
      expect(getWeek(new Date(2016, 0, 7)), 'to be', 1);
      expect(getWeek(new Date(2016, 6, 21)), 'to be', 29);
      expect(getWeek(new Date(2016, 8, 6)), 'to be', 36);
      expect(getWeek(new Date(2016, 11, 1)), 'to be', 48);
      expect(getWeek(new Date(2017, 0, 1)), 'to be', 52);
    });
  });

  describe('startOfYearPeriod()', function () {
    it('returns the start year of given length of period of years', function () {
      let date = new Date(2121, 0, 1);
      expect(startOfYearPeriod(date, 10), 'to be', 2120);
      expect(startOfYearPeriod(date, 100), 'to be', 2100);
      expect(startOfYearPeriod(date, 1000), 'to be', 2000);

      date = new Date(1984, 0, 1);
      expect(startOfYearPeriod(date, 10), 'to be', 1980);
      expect(startOfYearPeriod(date, 100), 'to be', 1900);
      expect(startOfYearPeriod(date, 1000), 'to be', 1000);

      expect(startOfYearPeriod(new Date(738, 5, 30), 20), 'to be', 720);
      expect(startOfYearPeriod(new Date(0, 5, 30).setFullYear(88), 25), 'to be', 75);
    });
  });
});
