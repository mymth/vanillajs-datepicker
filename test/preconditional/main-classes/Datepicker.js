import '../_setup.js';
import Datepicker from '../../../js/Datepicker.js';
import Picker from '../../../js/picker/Picker.js';
import DaysView from '../../../js/picker/views/DaysView.js';
import MonthsView from '../../../js/picker/views/MonthsView.js';
import YearsView from '../../../js/picker/views/YearsView.js';
import defaultOptions from '../../../js/options/defaultOptions.js';
import locales from '../../../js/i18n/base-locales.js';
import {onKeydown} from '../../../js/events/elementListeners.js';
import {dateValue, today, startOfYearPeriod} from '../../../js/lib/date.js';
import expect from 'unexpected';

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

    afterEach(function () {
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
      // config items should be options + buttonClass, checkDisabled, container,
      // locale, getWeekNumber, multidate, shortcutKeys and weekEnd
      const numOfOptions = Object.keys(defaultOptions).length;
      expect(Object.keys(dp.config), 'to have length', numOfOptions + 8);

      expect(dp.config.autohide, 'to be false');
      expect(dp.config.beforeShowDay, 'to be null');
      expect(dp.config.beforeShowDecade, 'to be null');
      expect(dp.config.beforeShowMonth, 'to be null');
      expect(dp.config.beforeShowYear, 'to be null');
      expect(dp.config.buttonClass, 'to be', 'button');
      expect(dp.config.checkDisabled, 'to be a function');
      expect(dp.config.clearButton, 'to be false');
      expect(dp.config.container, 'to be null');
      expect(dp.config.dateDelimiter, 'to be', ',');
      expect(dp.config.datesDisabled, 'to equal', []);
      expect(dp.config.daysOfWeekDisabled, 'to equal', []);
      expect(dp.config.daysOfWeekHighlighted, 'to equal', []);
      expect(dp.config.defaultViewDate, 'to be', today());
      expect(dp.config.disableTouchKeyboard, 'to be false');
      expect(dp.config.enableOnReadonly, 'to be true');
      expect(dp.config.format, 'to be', 'mm/dd/yyyy');
      expect(dp.config.getWeekNumber, 'to be null');
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
      expect(dp.config.pickLevel, 'to be', 0);
      //
      expect(dp.config.prevArrow, 'to be a', NodeList);
      expect(dp.config.prevArrow.length, 'to be', 1);
      expect(dp.config.prevArrow[0].wholeText, 'to be', '«');
      //
      expect(dp.config.shortcutKeys, 'to equal', {
        show: {key: 'ArrowDown', ctrlOrMetaKey: false, altKey: false, shiftKey: false},
        toggle: {key: 'Escape', ctrlOrMetaKey: false, altKey: false, shiftKey: false},
        prevButton: {key: 'ArrowLeft', ctrlOrMetaKey: true, altKey: false, shiftKey: false},
        nextButton: {key: 'ArrowRight', ctrlOrMetaKey: true, altKey: false, shiftKey: false},
        viewSwitch: {key: 'ArrowUp', ctrlOrMetaKey: true, altKey: false, shiftKey: false},
        clearButton: {key: 'Backspace', ctrlOrMetaKey: true, altKey: false, shiftKey: false},
        todayButton: {key: '.', ctrlOrMetaKey: true},
        exitEditMode: {key: 'ArrowDown', ctrlOrMetaKey: true, altKey: false, shiftKey: false},
      });
      expect(dp.config.showDaysOfWeek, 'to be true');
      expect(dp.config.showOnFocus, 'to be true');
      expect(dp.config.startView, 'to be', 0);
      expect(dp.config.title, 'to be', '');
      expect(dp.config.todayButton, 'to be false');
      expect(dp.config.todayHighlight, 'to be false');
      expect(dp.config.updateOnBlur, 'to be true');
      expect(dp.config.weekNumbers, 'to be', 0);
      expect(dp.config.weekStart, 'to be', 0);
      expect(dp.config.weekEnd, 'to be', 6);
    });

    it('creates Picker object', function () {
      const dp = new Datepicker(input);
      const picker = dp.picker;

      expect(picker, 'to be a', Picker);
      expect(picker, 'not to have property', 'active');
      expect(picker.element, 'to be an', HTMLElement);
      expect(picker.element.classList.contains('datepicker'), 'to be true');
      expect(picker.views, 'to have length', 4);
      expect(picker.views, 'to satisfy', {
        0: expect.it('to be a', DaysView),
        1: expect.it('to be a', MonthsView),
        2: expect.it('to be a', YearsView).and('to have properties', {id: 2, step: 1}),
        3: expect.it('to be a', YearsView).and('to have properties', {id: 3, step: 10}),
      });
      expect(picker.currentView, 'to be', picker.views[dp.config.startView]);
      expect(picker.main, 'to be', picker.element.querySelector('.datepicker-main'));
      expect(Array.from(picker.main.childNodes), 'to equal', [picker.currentView.element]);
      expect(picker.viewDate, 'to be', dp.config.defaultViewDate);
    });

    it('inserts datepicker element after the input element', function () {
      const dp = new Datepicker(input);

      const dpElems = document.querySelectorAll('.datepicker');
      expect(dpElems.length, 'to be', 1);
      expect(dpElems[0], 'to be', dp.picker.element);
      expect(dpElems[0].previousElementSibling, 'to be', input);
    });

    it('does not add the active class to the picker element', function () {
      const dp = new Datepicker(input);

      expect(dp.picker.element.classList.contains('active'), 'to be false');
    });

    it('sets rangepicker property if DateRangePicker to link is passed', function () {
      const fakeRangepicker = {
        inputs: [input],
        datepickers: [],
      };
      const dp = new Datepicker(input, {}, fakeRangepicker);

      expect(dp.rangepicker, 'to be', fakeRangepicker);
    });

    it('sets the index of the datepicker of the range to rangeSideIndex property if DateRangePicker to link is passed', function () {
      const fakeRangepicker = {
        inputs: [input],
        datepickers: [],
      };
      let dp = new Datepicker(input, {}, fakeRangepicker);

      expect(dp.rangeSideIndex, 'to be', 0);

      dp.destroy();

      fakeRangepicker.inputs = [undefined, input];
      dp = new Datepicker(input, {}, fakeRangepicker);

      expect(dp.rangeSideIndex, 'to be', 1);
    });

    it('adds itself to rangepicker.datepickers if DateRangePicker to link is passed', function () {
      let fakeRangepicker = {
        inputs: [input],
        datepickers: [],
      };
      let dp = new Datepicker(input, {}, fakeRangepicker);

      expect(fakeRangepicker.datepickers[0], 'to be', dp);

      fakeRangepicker = {
        inputs: [undefined, input],
        datepickers: [],
      };
      dp = new Datepicker(input, {}, fakeRangepicker);

      expect(fakeRangepicker.datepickers[1], 'to be', dp);
    });

    it('throws an error if invalid rangepicker is passed', function () {
      const testFn = rangepicker => new Datepicker(input, {}, rangepicker);
      const errMsg = 'Invalid rangepicker object.';

      let fakeRangepicker = {
        inputs: [],
        datepickers: [],
      };
      expect(() => testFn(fakeRangepicker), 'to throw', errMsg);

      fakeRangepicker = {
        inputs: ['foo', 'bar', input],
        datepickers: [],
      };
      expect(() => testFn(fakeRangepicker), 'to throw', errMsg);

      fakeRangepicker = {
        inputs: [input],
      };
      expect(() => testFn(fakeRangepicker), 'to throw', errMsg);
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

  describe('picker.changeView()', function () {
    let input;
    let dp;
    let picker;
    let initialView;
    let views;
    let main;

    before(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      picker = dp.picker;
      initialView = picker.currentView;
      ({views, main} = picker);
    });

    after(function () {
      dp.destroy();
      testContainer.removeChild(input);
    });

    it('changes the currentView to the view object of given id', function () {
      picker.changeView(2);
      expect(picker.currentView, 'to be', views[2]);
      // picker element is not updated
      expect(Array.from(main.childNodes), 'to equal', [initialView.element]);

      picker.changeView(initialView.id);
      expect(picker.currentView, 'to be', initialView);
      expect(Array.from(main.childNodes), 'to equal', [initialView.element]);
    });
  });

  describe('picker.changeFocus()', function () {
    let clock;
    let input;
    let dp;
    let picker;

    before(function () {
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      picker = dp.picker;
    });

    after(function () {
      clock.restore();
      dp.destroy();
      testContainer.removeChild(input);
    });

    it('updates viewDate to given date', function () {
      const views = picker.views;
      let newViewDate = dateValue(2016, 10, 8);

      picker.changeFocus(newViewDate);
      expect(picker.viewDate, 'to be', newViewDate);
      // also update view objects' focused properties
      expect(views[0].focused, 'to be', newViewDate);
      expect(views[1].focused, 'to be', 10);
      expect(views[1].year, 'to be', 2016);
      expect(views[2].focused, 'to be', 2016);
      expect(views[3].focused, 'to be', 2010);

      newViewDate = dateValue(2020, 1, 14);

      picker.changeFocus(newViewDate);
      expect(picker.viewDate, 'to be', newViewDate);

      expect(views[0].focused, 'to be', newViewDate);
      expect(views[1].focused, 'to be', 1);
      expect(views[1].year, 'to be', 2020);
      expect(views[2].focused, 'to be', 2020);
      expect(views[3].focused, 'to be', 2020);
    });
  });

  describe('picker.update()', function () {
    let input;
    let dp;
    let picker;
    let views;
    let defaultViewDate;

    before(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      picker = dp.picker;
      views = picker.views;
      defaultViewDate = dp.config.defaultViewDate;
    });

    after(function () {
      dp.destroy();
      testContainer.removeChild(input);
    });

    it('applies selected dates to views, updates viewDate to the last item', function () {
      const date1 = dateValue(2016, 10, 8);
      const date2 = dateValue(2020, 2, 14);
      const date3 = dateValue(2020, 1, 4);
      dp.dates.push(date1);

      picker.update();
      expect(views[0].selected, 'to equal', [date1]);
      expect(views[1].selected, 'to equal', {2016: [10]});
      expect(views[2].selected, 'to equal', [2016]);
      expect(views[3].selected, 'to equal', [2010]);
      expect(picker.viewDate, 'to be', date1);
      // also update view objects' focused properties
      expect(views[0].focused, 'to be', date1);
      expect(views[1].focused, 'to be', 10);
      expect(views[1].year, 'to be', 2016);
      expect(views[2].focused, 'to be', 2016);
      expect(views[3].focused, 'to be', 2010);

      dp.dates.push(date2, date3);

      picker.update();
      expect(views[0].selected, 'to equal', [date1, date2, date3]);
      expect(views[1].selected, 'to equal', {2016: [10], 2020: [2, 1]});
      expect(views[2].selected, 'to equal', [2016, 2020]);
      expect(views[3].selected, 'to equal', [2010, 2020]);
      expect(picker.viewDate, 'to be', date3);

      expect(views[0].focused, 'to be', date3);
      expect(views[1].focused, 'to be', 1);
      expect(views[1].year, 'to be', 2020);
      expect(views[2].focused, 'to be', 2020);
      expect(views[3].focused, 'to be', 2020);

      // if no dates in the selection, use defaultViewDate config for viewDate
      const dateDefault = new Date(defaultViewDate);

      dp.dates = [];

      picker.update();
      expect(views[0].selected, 'to equal', []);
      expect(views[1].selected, 'to equal', {});
      expect(views[2].selected, 'to equal', []);
      expect(views[3].selected, 'to equal', []);
      expect(picker.viewDate, 'to be', defaultViewDate);

      expect(views[0].focused, 'to be', defaultViewDate);
      expect(views[1].focused, 'to be', dateDefault.getMonth());
      expect(views[1].year, 'to be', dateDefault.getFullYear());
      expect(views[2].focused, 'to be', dateDefault.getFullYear());
      expect(views[3].focused, 'to be', startOfYearPeriod(dateDefault, 10));
    });

    it('sets given date to viewDate insteead of the last item of the selection if it is passed', function () {
      const date1 = dateValue(2020, 1, 4);
      const date2 = dateValue(2020, 2, 14);
      const date3 = dateValue(2016, 10, 8);
      dp.dates.push(date1, date2);

      picker.update(date3);
      expect(views[0].selected, 'to equal', [date1, date2]);
      expect(views[1].selected, 'to equal', {2020: [1, 2]});
      expect(views[2].selected, 'to equal', [2020]);
      expect(views[3].selected, 'to equal', [2020]);
      expect(picker.viewDate, 'to be', date3);

      expect(views[0].focused, 'to be', date3);
      expect(views[1].focused, 'to be', 10);
      expect(views[1].year, 'to be', 2016);
      expect(views[2].focused, 'to be', 2016);
      expect(views[3].focused, 'to be', 2010);
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
      dpElem = dp.picker.element;
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

    it('sets false to the "picker.active" property', function () {
      expect(dp.picker.active, 'to be false');
    });

    it('resets the picker to the start view state', function () {
      const {config, picker} = dp;
      const {views, currentView} = picker;
      const newViewDate = dateValue(2020, 1, 14);

      picker.active = true;
      picker.changeFocus(newViewDate);
      picker.changeView(2);
      dp.hide();

      expect(picker.viewDate, 'to be', config.defaultViewDate);
      expect(currentView, 'to be', views[config.startView]);
      expect(currentView.selected, 'to equal', []);

      picker.active = true;
      dp.dates = [newViewDate];
      picker.changeView(1);
      dp.hide();

      expect(picker.viewDate, 'to be', newViewDate);
      expect(currentView, 'to be', views[config.startView]);
      expect(currentView.selected, 'to equal', [newViewDate]);
    });
  });

  describe('toggle()', function () {
    let input;
    let dp;
    let dpElem;

    before(function () {
      input = document.createElement('input');
      testContainer.appendChild(input);
      dp = new Datepicker(input);
      dpElem = dp.picker.element;
    });

    after(function () {
      dp.destroy();
      testContainer.removeChild(input);
    });

    it('toggles picker.active and the datepicker element\'s "active" class', function () {
      dp.toggle();

      expect(dpElem.classList.contains('active'), 'to be true');
      expect(dp.picker.active, 'to be true');

      dp.toggle();

      expect(dpElem.classList.contains('active'), 'to be false');
      expect(dp.picker.active, 'to be false');
    });

    it('does not reset the picker to the start view state when removing active state', function () {
      const picker = dp.picker;
      const views = picker.views;
      const newViewDate = dateValue(2020, 1, 14);
      const currentDate = today();
      dp.toggle();

      picker.changeFocus(newViewDate);
      picker.changeView(2);
      dp.toggle();

      expect(picker.viewDate, 'to be', newViewDate);
      expect(picker.currentView, 'to be', views[2]);
      expect(picker.currentView.selected, 'to equal', []);

      dp.dates = [newViewDate];
      picker.update();
      dp.toggle();

      picker.changeFocus(currentDate);
      picker.changeView(1);
      dp.toggle();

      expect(picker.viewDate, 'to be', currentDate);
      expect(picker.currentView, 'to be', views[1]);
      expect(picker.currentView.selected, 'to equal', {2020: [1]});
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

  describe('keydown event listere', function () {
    it('ignores fake keydown event triggered by Chrome when autofill is performed', function () {
      const input = document.createElement('input');
      testContainer.appendChild(input);
      const dp = new Datepicker(input);
      dp.show();

      // for issue #144
      const spyPickerRender = sinon.spy(dp.picker, 'render');
      const ev = new Event('keydown', {bubbles: true, cancelable: true});
      expect(() => {
        onKeydown(dp, ev);
      }, 'not to throw');
      expect(ev.bubbles, 'to be true');
      expect(ev.defaultPrevented, 'to be false');
      expect(dp.active, 'to be true');
      expect(dp._editMode, 'to be undefined');
      expect(spyPickerRender.called, 'to be false');

      spyPickerRender.restore();
      dp.destroy();
      testContainer.removeChild(input);
    });
  });
});
