import '../_setup.js';
import {parseDate, formatDate} from '../../../js/lib/date-format.js';

describe('lib/date', function () {
  const locales = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "Today",
      clear: "Clear",
      titleFormat: "MM yyyy"
    },
    de: {
      days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
      months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    },
    es: {
      days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    },
    fr: {
      days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
      daysShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
      daysMin: ["d", "l", "ma", "me", "j", "v", "s"],
      months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
      monthsShort: ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
    }
  };

  describe('parseDate()', function () {
    const today = new Date().setHours(0, 0, 0, 0);
    const thisYear = new Date().getFullYear();

    it('return undefined if the given date is falsy value other than 0 or invalid date', function () {
      expect(parseDate(), 'to be undefined');
      expect(parseDate(''), 'to be undefined');
      expect(parseDate(new Date('')), 'to be undefined');
      expect(parseDate(0), 'not to be undefined');
    });

    it('returns time value of the same day\'s 00:00:00 local time if the given date is a Date object or time value', function () {
      const origDate = new Date().setHours(0, 0, 0, 0);

      expect(parseDate(new Date()), 'to be', origDate);
      expect(parseDate(Date.now()), 'to be', origDate);
    });

    it('invokes custom parse fucntion and returns the result if it\'s given to format.toValue', function () {
      const date = new Date();
      const format = {toValue: sinon.stub()};
      format.toValue.returns(date);

      expect(parseDate('2020-01-01', format, locales.en), 'to be', date.setHours(0, 0, 0, 0));
      expect(format.toValue.calledWith('2020-01-01', format, locales.en), 'to be true');
    });

    it('returns the date that the word means if given date is "today"', function () {
      expect(parseDate('today'), 'to be', today);
    });

    it('uses format: "d" or "dd" as day of month to parse date string', function () {
      expect(parseDate('2012-03-5', 'yyyy-mm-d'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('2012-03-15', 'yyyy-mm-d'), 'to be', new Date(2012, 2, 15).getTime());
      expect(parseDate('2012-03-05', 'yyyy-mm-d'), 'to be', new Date(2012, 2, 5).getTime());

      expect(parseDate('2012-03-5', 'yyyy-mm-dd'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('2012-03-15', 'yyyy-mm-dd'), 'to be', new Date(2012, 2, 15).getTime());
      expect(parseDate('2012-03-05', 'yyyy-mm-dd'), 'to be', new Date(2012, 2, 5).getTime());

      expect(parseDate('5/03/2012', 'dd/mm/yyyy'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('15/03/2012', 'd/mm/yyyy'), 'to be', new Date(2012, 2, 15).getTime());
    });

    it('accepts 0 and number larger than the end of the month for "d", "dd"', function () {
      expect(parseDate('2012-03-0', 'yyyy-mm-d'), 'to be', new Date(2012, 1, 29).getTime());
      expect(parseDate('2012-03-33', 'yyyy-mm-d'), 'to be', new Date(2012, 3, 2).getTime());
      expect(parseDate('2013-02-60', 'yyyy-mm-d'), 'to be', new Date(2013, 3, 1).getTime());
    });

    it('uses format: "m", "mm", "M" or "MM" as month to parse date string', function () {
      const fakeToday = new Date(thisYear, 2, 31);
      const clock = sinon.useFakeTimers({now: fakeToday, shouldAdvanceTime: true});

      // month number
      expect(parseDate('2012-3-5', 'yyyy-m-d'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('2012-12-15', 'yyyy-m-d'), 'to be', new Date(2012, 11, 15).getTime());
      expect(parseDate('2012-03-05', 'yyyy-m-d'), 'to be', new Date(2012, 2, 5).getTime());

      expect(parseDate('2012-3-5', 'yyyy-mm-dd'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('2012-12-15', 'yyyy-mm-dd'), 'to be', new Date(2012, 11, 15).getTime());
      expect(parseDate('2012-03-05', 'yyyy-mm-dd'), 'to be', new Date(2012, 2, 5).getTime());

      expect(parseDate('5/3/2012', 'dd/mm/yyyy'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('15/12/2012', 'd/m/yyyy'), 'to be', new Date(2012, 11, 15).getTime());

      // ensure setting a month w/ < 31days on the 31 of a month works correctly
      expect(parseDate('2012-02-28', 'yyyy-mm-dd'), 'to be', new Date(2012, 1, 28).getTime());
      expect(parseDate('2012-09-15', 'yyyy-mm-dd'), 'to be', new Date(2012, 8, 15).getTime());

      // month name
      expect(parseDate('Mar 5, 2012', 'M d, yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('Dec 15, 2012', 'M d, yyyy', locales.en), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('Mär 5, 2012', 'M d, yyyy', locales.de), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('Dez 15, 2012', 'M d, yyyy', locales.de), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('mars 5, 2012', 'M d, yyyy', locales.fr), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('déc. 15, 2012', 'M d, yyyy', locales.fr), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('March 5, 2012', 'MM d, yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('December 15, 2012', 'MM d, yyyy', locales.en), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('März 5, 2012', 'MM d, yyyy', locales.de), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('Dezember 15, 2012', 'MM d, yyyy', locales.de), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('mars 5, 2012', 'MM d, yyyy', locales.fr), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('décembre 15, 2012', 'MM d, yyyy', locales.fr), 'to be', new Date(2012, 11, 15).getTime());

      // month number for "M" and "MM"
      expect(parseDate('3/5/2012', 'M/dd/yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('12/15/2012', 'MM/dd/yyyy', locales.en), 'to be', new Date(2012, 11, 15).getTime());

      // month name for "m" and "mm"
      expect(parseDate('Mar/5/2012', 'm/d/yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('December/15/2012', 'mm/dd/yyyy', locales.en), 'to be', new Date(2012, 11, 15).getTime());

      clock.restore();
    });

    it('accepts 0 and number larger than 12 for "m", "mm"', function () {
      const fakeToday = new Date(thisYear, 2, 31);
      const clock = sinon.useFakeTimers({now: fakeToday, shouldAdvanceTime: true});

      expect(parseDate('2012-0-05', 'yyyy-m-dd'), 'to be', new Date(2011, 11, 5).getTime());
      expect(parseDate('2012-16-30', 'yyyy-m-d'), 'to be', new Date(2013, 3, 30).getTime());
      expect(parseDate('2012-32-30', 'yyyy-m-d'), 'to be', new Date(2014, 7, 30).getTime());

      clock.restore();
    });

    it('evaluates month name with case-insensible begin-with match', function () {
      const fakeToday = new Date(thisYear, 2, 31);
      const clock = sinon.useFakeTimers({now: fakeToday, shouldAdvanceTime: true});

      expect(parseDate('march 5, 2012', 'M d, yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('DEC 15, 2012', 'MM d, yyyy', locales.en), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('MA 5, 2012', 'MM d, yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('j 5, 2012', 'MM d, yyyy', locales.en), 'to be', new Date(2012, 0, 5).getTime());
      expect(parseDate('ju 5, 2012', 'MM d, yyyy', locales.en), 'to be', new Date(2012, 5, 5).getTime());

      expect(parseDate('march/5/2012', 'm/d/yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('DEC/15/2012', 'mm/dd/yyyy', locales.en), 'to be', new Date(2012, 11, 15).getTime());

      expect(parseDate('MA/05/2012', 'mm/dd/yyyy', locales.en), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('j/05/2012', 'mm/dd/yyyy', locales.en), 'to be', new Date(2012, 0, 5).getTime());
      expect(parseDate('ju/05/2012', 'mm/dd/yyyy', locales.en), 'to be', new Date(2012, 5, 5).getTime());

      clock.restore();
    });

    it('uses format: "y", "yy" or "yyyy" as year to parse date string', function () {
      expect(parseDate('2012-3-5', 'y-m-d'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('1984-3-15', 'y-m-d'), 'to be', new Date(1984, 2, 15).getTime());
      expect(parseDate('12-03-05', 'y-m-d'), 'to be', new Date(0, 2, 5).setFullYear(12));

      expect(parseDate('2012-3-5', 'yy-m-d'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('1984-3-15', 'yy-m-d'), 'to be', new Date(1984, 2, 15).getTime());
      expect(parseDate('12-03-05', 'yy-m-d'), 'to be', new Date(0, 2, 5).setFullYear(12));

      expect(parseDate('2012-03-5', 'yyyy-mm-dd'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('1984-03-15', 'yyyy-mm-dd'), 'to be', new Date(1984, 2, 15).getTime());
      expect(parseDate('12-03-05', 'yyyy-mm-dd'), 'to be', new Date(0, 2, 5).setFullYear(12));

      expect(parseDate('5/03/2012', 'dd/mm/yyyy'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('15/03/1984', 'd/m/yy'), 'to be', new Date(1984, 2, 15).getTime());
    });

    it('ignores "D" and "DD" (day of week)', function () {
      let date = parseDate('2012-03-05', 'yyyy-mm-dd-D');
      expect(date, 'to be', new Date(2012, 2, 5).getTime());

      date = parseDate('Sat, Dec 15, 2012', 'DD, M dd, yyyy', locales.en);
      expect(date, 'to be', new Date(2012, 11, 15).getTime());
    });

    it('uses current date\'s year/month/day to complement undefined, missing or unparsable parts', function () {
      const fakeToday = new Date(thisYear, 2, 31);
      const clock = sinon.useFakeTimers({now: fakeToday, shouldAdvanceTime: true});

      expect(parseDate('03-05', 'mm-dd'), 'to be', new Date(thisYear, 2, 5).getTime());
      expect(parseDate('2012-06', 'yyyy-mm'), 'to be', new Date(2012, 5, 30).getTime());
      expect(parseDate('5, 2012', 'd, yyyy'), 'to be', new Date(2012, 2, 5).getTime());
      expect(parseDate('Mai/10', 'M/d', locales.en), 'to be', new Date(thisYear, 2, 10).getTime());
      expect(parseDate('Maya/10', 'M/d', locales.en), 'to be', new Date(thisYear, 2, 10).getTime());

      expect(parseDate('03-05', 'yyyy-mm-dd'), 'to be', new Date(0, 4, 31).setFullYear(3));
      expect(parseDate('Sun, 23', 'DD, mm-dd'), 'to be', new Date(thisYear + 1, 10, 30).getTime());

      expect(parseDate('Mar/05/12', 'yyyy/mm/dd', locales.en), 'to be', new Date(thisYear, 4, 12).getTime());
      expect(parseDate('05/Mar/12', 'yyyy/mm/dd', locales.en), 'to be', new Date(0, 2, 12).setFullYear(5));
      expect(parseDate('2012年十二月十五日', 'yyyy年mm月dd日', locales.en), 'to be', new Date(2012, 2, 31).getTime());

      clock.restore();
    });

    it('throws an Error if format is neither a valid format string nor an object w/ toValue property', function () {
      expect(() => parseDate('01-01-01', {}), 'to throw error');
      expect(() => parseDate('01-01-01', 1), 'to throw error');
      expect(() => parseDate('01-01-01', 'aa-bb-cc'), 'to throw error');
    });
  });

  describe('formatDate()', function () {
    it('return empty string if the given date is falsy value other than 0 or invalid date', function () {
      expect(formatDate(), 'to be', '');
      expect(formatDate(''), 'to be', '');
      expect(formatDate(new Date('')), 'to be', '');
      expect(formatDate(0, 'yyyy', locales.en), 'not to be', '');
    });

    it('invokes custom format fucntion and returns the result if it\'s given to format.toDisplay', function () {
      const date = new Date(2012, 2, 5);
      const format = {toDisplay: sinon.stub()};
      format.toDisplay.returns('foo-bar');

      expect(formatDate(date, format, locales.en), 'to be', 'foo-bar');
      expect(format.toDisplay.calledWith(date, format, locales.en), 'to be true');
    });

    it('uses format: "d" as day of month, no leading zero to format date', function () {
      expect(formatDate(new Date(2012, 2, 5), 'yyyy-mm-d', locales.en), 'to be', '2012-03-5');
      expect(formatDate(0, 'd', locales.en), 'to be', String(new Date(0).getDate()));
    });

    it('uses format: "dd" as day of month, leading zero to format date', function () {
      const date = new Date(2012, 2, 5);
      expect(formatDate(date, 'yyyy-mm-dd', locales.en), 'to be', '2012-03-05');
      expect(formatDate(date.getTime(), 'yyyy-mm-dd', locales.en), 'to be', '2012-03-05');
    });

    it('uses format: "D" as short day of week in given language to format date', function () {
      const date = new Date(2012, 2, 5);
      expect(formatDate(date, 'yyyy-mm-dd-D', locales.en), 'to be', '2012-03-05-Mon');
      expect(formatDate(date, 'yyyy-mm-dd-D', locales.es), 'to be', '2012-03-05-Lun');
    });

    it('uses format: "DD" as long day of week in given language to format date', function () {
      const date = new Date(2012, 2, 5);
      expect(formatDate(date, 'yyyy-mm-dd-DD', locales.en), 'to be', '2012-03-05-Monday');
      expect(formatDate(date, 'yyyy-mm-dd-DD', locales.es), 'to be', '2012-03-05-Lunes');
    });

    it('uses format: "m" as Month, no leading zero. to format date', function () {
      expect(formatDate(new Date(2012, 2, 5), 'yyyy-m-dd', locales.en), 'to be', '2012-3-05');
    });

    it('uses format: "mm" as Month, leading zero. to format date', function () {
      expect(formatDate(new Date(2012, 2, 5), 'yyyy-mm-dd', locales.en), 'to be', '2012-03-05');
    });

    it('uses format: "M" as month shortname in given language to format date', function () {
      const date = new Date(2012, 2, 5);
      expect(formatDate(date, 'yyyy-M-dd', locales.en), 'to be', '2012-Mar-05');
      expect(formatDate(date, 'yyyy-M-dd', locales.de), 'to be', '2012-Mär-05');
    });

    it('uses format: "MM" as month full name in given language to format date', function () {
      const date = new Date(2012, 2, 5);
      expect(formatDate(date, 'yyyy-MM-dd', locales.en), 'to be', '2012-March-05');
      expect(formatDate(date, 'yyyy-MM-dd', locales.de), 'to be', '2012-März-05');
    });

    it('uses format: "y" as Year, no leading zero. to format date', function () {
      expect(formatDate(new Date(0, 2, 5).setFullYear(2), 'y-m-d', locales.en), 'to be', '2-3-5');
      expect(formatDate(new Date(0, 2, 5).setFullYear(12), 'y-m-d', locales.en), 'to be', '12-3-5');
      expect(formatDate(new Date(2012, 2, 5), 'y-m-d', locales.en), 'to be', '2012-3-5');
    });

    it('uses format: "yy" as Year, two-digit. to format date', function () {
      expect(formatDate(new Date(0, 2, 5).setFullYear(2), 'yy-mm-dd', locales.en), 'to be', '02-03-05');
      expect(formatDate(new Date(0, 2, 5).setFullYear(12), 'yy-mm-dd', locales.en), 'to be', '12-03-05');
      expect(formatDate(new Date(2012, 2, 5), 'yy-mm-dd', locales.en), 'to be', '12-03-05');
    });

    it('uses format: "yyyy" as Year, four-digit. to format date', function () {
      expect(formatDate(new Date(0, 2, 5).setFullYear(2), 'yyyy-mm-dd', locales.en), 'to be', '0002-03-05');
      expect(formatDate(new Date(0, 2, 5).setFullYear(12), 'yyyy-mm-dd', locales.en), 'to be', '0012-03-05');
      expect(formatDate(new Date(2012, 2, 5), 'yyyy-mm-dd', locales.en), 'to be', '2012-03-05');
    });

    it('accepts separators come before and after the date numbers', function () {
      expect(formatDate(new Date(2012, 2, 5), '西暦yyyy年mm月dd日', locales.en), 'to be', '西暦2012年03月05日');
    });

    it('throws an Error if format is neither a valid format string nor an object w/ toValue property', function () {
      const date = new Date(2012, 2, 5);
      expect(() => formatDate(date, {}), 'to throw error');
      expect(() => formatDate(date, 1), 'to throw error');
      expect(() => formatDate(date, 'aa-bb-cc'), 'to throw error');
    });
  });
});
