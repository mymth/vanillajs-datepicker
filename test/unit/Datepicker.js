import './_setup.js';
import Datepicker from '../../js/Datepicker.js';
import defaultOptions from '../../js/options/defaultOptions.js';
import {locales} from '../../js/i18n/base-locales.js';
import {dateValue, today} from '../../js/lib/date.js';

const esLocale = {
  months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

describe('Datepicker', function () {
  it('has locales attribute with "en" locale', function () {
    expect(Datepicker.locales, 'to be an object');
    expect(Datepicker.locales.en, 'to equal', locales.en);
  });

  describe('constructor', function () {
    let input;

    beforeEach(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
    });

    after(function () {
      document.querySelectorAll('.datepicker').forEach((el) => {
        el.parentElement.removeChild(el);
      });
      delete input.datepicker;
      testContainer.removeChild(input);
    });

    it('attachs the created instance to the bound element', function () {
      const dp = new Datepicker(input);
      expect(input.datepicker, 'to be', dp);
    });

    it('adds datepicker-input class to the bound element', function () {
      new Datepicker(input);
      expect(input.classList.contains('datepicker-input'), 'to be true');
    });

    it('configures the instance with the default options', function () {
      const dp = new Datepicker(input);
      // config items should be options + container, locale, multidate and weekEnd
      const numOfOptions = Object.keys(defaultOptions).length;
      expect(Object.keys(dp.config), 'to have length', numOfOptions + 5);

      expect(dp.config.autohide, 'to be false');
      expect(dp.config.beforeShowDay, 'to be null');
      expect(dp.config.beforeShowDecade, 'to be null');
      expect(dp.config.beforeShowMonth, 'to be null');
      expect(dp.config.beforeShowYear, 'to be null');
      expect(dp.config.buttonClass, 'to be', 'button');
      expect(dp.config.calendarWeeks, 'to be false');
      expect(dp.config.clearBtn, 'to be false');
      expect(dp.config.container, 'to be', document.body);
      expect(dp.config.dateDelimiter, 'to be', ',');
      expect(dp.config.datesDisabled, 'to equal', []);
      expect(dp.config.daysOfWeekDisabled, 'to equal', []);
      expect(dp.config.daysOfWeekHighlighted, 'to equal', []);
      expect(dp.config.defaultViewDate, 'to be', today());
      expect(dp.config.disableTouchKeyboard, 'to be false');
      expect(dp.config.format, 'to be', 'mm/dd/yyyy');
      expect(dp.config.language, 'to be', 'en');
      expect(dp.config.locale, 'to equal', Object.assign({
        format: defaultOptions.format,
        weekStart: defaultOptions.weekStart,
      }, locales.en));
      expect(dp.config.maxDate, 'to be undefined');
      expect(dp.config.maxNumberOfDates, 'to be', 1);
      expect(dp.config.maxView, 'to be', 3);
      expect(dp.config.minDate, 'to be', dateValue(0, 0, 1));
      expect(dp.config.multidate, 'to be false');
      //
      expect(dp.config.nextArrow, 'to be a', NodeList);
      expect(dp.config.nextArrow.length, 'to be', 1);
      expect(dp.config.nextArrow[0].wholeText, 'to be', '»');
      //
      expect(dp.config.orientation, 'to equal', {x: 'auto', y: 'auto'});
      //
      expect(dp.config.prevArrow, 'to be a', NodeList);
      expect(dp.config.prevArrow.length, 'to be', 1);
      expect(dp.config.prevArrow[0].wholeText, 'to be', '«');
      //
      expect(dp.config.showDaysOfWeek, 'to be true');
      expect(dp.config.showOnFocus, 'to be true');
      expect(dp.config.startView, 'to be', 0);
      expect(dp.config.title, 'to be', '');
      expect(dp.config.todayBtn, 'to be false');
      expect(dp.config.todayHighlight, 'to be false');
      expect(dp.config.weekStart, 'to be', 0);
      expect(dp.config.weekEnd, 'to be', 6);
    });

    it('append datepicker element to the container)', function () {
      new Datepicker(input);

      const dpElem = Array.from(document.body.children).find(el => el.matches('.datepicker'));
      expect(dpElem, 'not to be undefined');
    });

    it('does not add the active class to the picker element', function () {
      new Datepicker(input);

      const dpElem = document.querySelector('.datepicker');
      expect(dpElem.classList.contains('active'), 'to be false');
    });

    it('sets rangepicker and range properties if DateRangePicker to link is passed', function () {
      const fakeRangepicker = new (function DateRangePicker() {
        this.dates = ['foo', 'bar'];
      })();
      const dp = new Datepicker(input, {}, fakeRangepicker);

      expect(dp.rangepicker, 'to be', fakeRangepicker);
      expect(dp.range, 'to equal', fakeRangepicker.dates);

      fakeRangepicker.dates = [123, 456];
      expect(dp.range, 'to equal', [123, 456]);
    });
  });

  describe('destroy()', function () {
    let input;
    let dp;
    let spyHide;
    let returnVal;

    before(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      spyHide = sinon.spy(dp, 'hide');

      returnVal = dp.destroy();
    });

    after(function () {
      spyHide.restore();
      document.querySelectorAll('.datepicker').forEach((el) => {
        el.parentElement.removeChild(el);
      });
      delete input.datepicker;
      testContainer.removeChild(input);
    });

    it('calls hide()', function () {
      expect(spyHide.called, 'to be true');
    });

    it('removes datepicker element from its container', function () {
      expect(document.body.querySelectorAll('.datepicker').length, 'to be', 0);
    });

    it('removes the instance from the bound element', function () {
      expect(Object.prototype.hasOwnProperty.call(input, 'datepicker'), 'to be false');
    });

    it('removes datepicker-input class from the bound element', function () {
      expect(input.classList.contains('datepicker-input'), 'to be false');
    });

    it('returns the instance', function () {
      expect(returnVal, 'to be', dp);
    });
  });

  describe('show()', function () {
    let input;
    let dp;
    let dpElem;

    before(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      dpElem = document.querySelector('.datepicker');
      dp.show();
    });

    after(function () {
      dp.destroy();
      testContainer.removeChild(input);
    });

    it('adds the "active" class to the datepicker element', function () {
      expect(dpElem.classList.contains('active'), 'to be true');
    });

    it('sets true to the picker.active property', function () {
      expect(dp.picker.active, 'to be true');
    });
  });

  describe('hide()', function () {
    let input;
    let dp;
    let dpElem;

    before(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      dpElem = document.querySelector('.datepicker');
      dp.picker.active = true;
      dpElem.classList.add('active');

      dp.hide();
    });

    after(function () {
      dp.destroy();
      testContainer.removeChild(input);
    });

    it('removes the "active" class from the datepicker element', function () {
      expect(dpElem.classList.contains('active'), 'to be false');
    });

    it('deletes the "picker.active" property', function () {
      expect(dp.picker, 'to have property', 'active');
    });
  });

  describe('static formatDate()', function () {
    it('formats a date or time value', function () {
      Datepicker.locales.es = esLocale;

      let date = new Date(2020, 0, 4);
      expect(Datepicker.formatDate(date, 'y-m-d'), 'to be', '2020-1-4');
      expect(Datepicker.formatDate(date.getTime(), 'dd M yy'), 'to be', '04 Jan 20');
      expect(Datepicker.formatDate(date, 'dd M yy', 'es'), 'to be', '04 Ene 20');
      expect(Datepicker.formatDate(date.getTime(), 'MM d, y', 'es'), 'to be', 'Enero 4, 2020');

      delete Datepicker.locales.es;

      // fallback to en
      expect(Datepicker.formatDate(date, 'dd M yy', 'es'), 'to be', '04 Jan 20');
      expect(Datepicker.formatDate(date.getTime(), 'MM d, y', 'es'), 'to be', 'January 4, 2020');
    });
  });

  describe('static parseDate()', function () {
    it('parses a date string and returnes the time value of the date', function () {
      Datepicker.locales.es = esLocale;

      let timeValue = new Date(2020, 0, 4).getTime();
      expect(Datepicker.parseDate('2020-1-4', 'y-m-d'), 'to be', timeValue);
      expect(Datepicker.parseDate('04 Jan 2020', 'dd M yy'), 'to be', timeValue);
      expect(Datepicker.parseDate('04 Ene 2020', 'dd M yy', 'es'), 'to be', timeValue);
      expect(Datepicker.parseDate('Enero 4, 2020', 'MM d, y', 'es'), 'to be', timeValue);

      expect(Datepicker.parseDate('04/20/2022', 'mm/dd/yyyy'), 'to equal', new Date(2022, 3, 20).getTime());
      expect(Datepicker.parseDate('5/3/1994', 'd/m/y'), 'to equal', new Date(1994, 2, 5).getTime());

      delete Datepicker.locales.es;

      // fallback to en
      const fallbackDate = new Date(timeValue).setMonth(new Date().getMonth());
      expect(Datepicker.parseDate('04 Ene 2020', 'dd M yy', 'es'), 'to be', fallbackDate);
      expect(Datepicker.parseDate('Enero 4, 2020', 'MM d, y', 'es'), 'to be', fallbackDate);
      expect(Datepicker.parseDate('04 Jan 2020', 'dd M yy', 'es'), 'to be', timeValue);
      expect(Datepicker.parseDate('2020-1-4', 'y-m-d', 'es'), 'to be', timeValue);
    });
  });
});
