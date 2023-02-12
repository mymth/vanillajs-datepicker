import {lastItemOf, stringToArray, isInRange} from './lib/utils.js';
import {today, regularizeDate} from './lib/date.js';
import {parseDate, formatDate} from './lib/date-format.js';
import {isActiveElement} from './lib/dom.js';
import {registerListeners, unregisterListeners} from './lib/event.js';
import locales from './i18n/base-locales.js';
import defaultOptions from './options/defaultOptions.js';
import processOptions from './options/processOptions.js';
import createShortcutKeyConfig from './options/shortcutKeys.js';
import Picker from './picker/Picker.js';
import {triggerDatepickerEvent} from './events/functions.js';
import {
  onKeydown,
  onFocus,
  onMousedown,
  onClickInput,
  onPaste,
} from './events/elementListeners.js';
import {onClickOutside} from './events/otherListeners.js';

function stringifyDates(dates, config) {
  return dates
    .map(dt => formatDate(dt, config.format, config.locale))
    .join(config.dateDelimiter);
}

// parse input dates and create an array of time values for selection
// returns undefined if there are no valid dates in inputDates
// when origDates (current selection) is passed, the function works to mix
// the input dates into the current selection
function processInputDates(datepicker, inputDates, clear = false) {
  if (inputDates.length === 0) {
    // empty input is considered valid unless origiDates is passed
    return clear ? [] : undefined;
  }

  const {config, dates: origDates, rangeSideIndex} = datepicker;
  const {pickLevel, maxNumberOfDates} = config;
  let newDates = inputDates.reduce((dates, dt) => {
    let date = parseDate(dt, config.format, config.locale);
    if (date === undefined) {
      return dates;
    }
    // adjust to 1st of the month/Jan 1st of the year
    // or to the last day of the monh/Dec 31st of the year if the datepicker
    // is the range-end picker of a rangepicker
    date = regularizeDate(date, pickLevel, rangeSideIndex);
    if (
      isInRange(date, config.minDate, config.maxDate)
      && !dates.includes(date)
      && !config.checkDisabled(date, pickLevel)
      && (pickLevel > 0 || !config.daysOfWeekDisabled.includes(new Date(date).getDay()))
    ) {
      dates.push(date);
    }
    return dates;
  }, []);
  if (newDates.length === 0) {
    return;
  }
  if (config.multidate && !clear) {
    // get the synmetric difference between origDates and newDates
    newDates = newDates.reduce((dates, date) => {
      if (!origDates.includes(date)) {
        dates.push(date);
      }
      return dates;
    }, origDates.filter(date => !newDates.includes(date)));
  }
  // do length check always because user can input multiple dates regardless of the mode
  return maxNumberOfDates && newDates.length > maxNumberOfDates
    ? newDates.slice(maxNumberOfDates * -1)
    : newDates;
}

// refresh the UI elements
// modes: 1: input only, 2, picker only, 3 both
function refreshUI(datepicker, mode = 3, quickRender = true, viewDate = undefined) {
  const {config, picker, inputField} = datepicker;
  if (mode & 2) {
    const newView = picker.active ? config.pickLevel : config.startView;
    picker.update(viewDate).changeView(newView).render(quickRender);
  }
  if (mode & 1 && inputField) {
    inputField.value = stringifyDates(datepicker.dates, config);
  }
}

function setDate(datepicker, inputDates, options) {
  const config = datepicker.config;
  let {clear, render, autohide, revert, forceRefresh, viewDate} = options;
  if (render === undefined) {
    render = true;
  }
  if (!render) {
    autohide = forceRefresh = false;
  } else if (autohide === undefined) {
    autohide = config.autohide;
  }
  viewDate = parseDate(viewDate, config.format, config.locale);

  const newDates = processInputDates(datepicker, inputDates, clear);
  if (!newDates && !revert) {
    return;
  }
  if (newDates && newDates.toString() !== datepicker.dates.toString()) {
    datepicker.dates = newDates;
    refreshUI(datepicker, render ? 3 : 1, true, viewDate);
    triggerDatepickerEvent(datepicker, 'changeDate');
  } else {
    refreshUI(datepicker, forceRefresh ? 3 : 1, true, viewDate);
  }

  if (autohide) {
    datepicker.hide();
  }
}

function getOutputConverter(datepicker, format) {
  return format
    ? date => formatDate(date, format, datepicker.config.locale)
    : date => new Date(date);
}

/**
 * Class representing a date picker
 */
export default class Datepicker {
  /**
   * Create a date picker
   * @param  {Element} element - element to bind a date picker
   * @param  {Object} [options] - config options
   * @param  {DateRangePicker} [rangepicker] - DateRangePicker instance the
   * date picker belongs to. Use this only when creating date picker as a part
   * of date range picker
   */
  constructor(element, options = {}, rangepicker = undefined) {
    element.datepicker = this;
    this.element = element;
    this.dates = [];

    // initialize config
    const config = this.config = Object.assign({
      buttonClass: (options.buttonClass && String(options.buttonClass)) || 'button',
      container: null,
      defaultViewDate: today(),
      maxDate: undefined,
      minDate: undefined,
    }, processOptions(defaultOptions, this));

    // configure by type
    let inputField;
    if (element.tagName === 'INPUT') {
      inputField = this.inputField = element;
      inputField.classList.add('datepicker-input');
      if (options.container) {
        // omit string type check because it doesn't guarantee to avoid errors
        // (invalid selector string causes abend with sytax error)
        config.container = options.container instanceof HTMLElement
          ? options.container
          : document.querySelector(options.container);
      }
    } else {
      config.container = element;
    }
    if (rangepicker) {
      // check validiry
      const index = rangepicker.inputs.indexOf(inputField);
      const datepickers = rangepicker.datepickers;
      if (index < 0 || index > 1 || !Array.isArray(datepickers)) {
        throw Error('Invalid rangepicker object.');
      }
      // attach itaelf to the rangepicker here so that processInputDates() can
      // determine if this is the range-end picker of the rangepicker while
      // setting inital values when pickLevel > 0
      datepickers[index] = this;
      this.rangepicker = rangepicker;
      this.rangeSideIndex = index;
    }

    // set up config
    this._options = options;
    Object.assign(config, processOptions(options, this));
    config.shortcutKeys = createShortcutKeyConfig(options.shortcutKeys || {});

    // process initial value
    const initialDates = stringToArray(
      element.value || element.dataset.date,
      config.dateDelimiter
    );
    delete element.dataset.date;
    const inputDateValues = processInputDates(this, initialDates);
    if (inputDateValues && inputDateValues.length > 0) {
      this.dates = inputDateValues;
    }
    if (inputField) {
      inputField.value = stringifyDates(this.dates, config);
    }

    // set up picekr element
    const picker = this.picker = new Picker(this);

    const keydownListener = [element, 'keydown', onKeydown.bind(null, this)];
    if (inputField) {
      registerListeners(this, [
        keydownListener,
        [inputField, 'focus', onFocus.bind(null, this)],
        [inputField, 'mousedown', onMousedown.bind(null, this)],
        [inputField, 'click', onClickInput.bind(null, this)],
        [inputField, 'paste', onPaste.bind(null, this)],
        // To detect a click on outside, just listening to mousedown is enough,
        // no need to listen to touchstart.
        // Actually, listening to touchstart can be a problem because, while
        // mousedown is fired only on tapping but not on swiping/pinching,
        // touchstart is fired on swiping/pinching as well.
        // (issue #95)
        [document, 'mousedown', onClickOutside.bind(null, this)],
        [window, 'resize', picker.place.bind(picker)]
      ]);
    } else {
      registerListeners(this, [keydownListener]);
      this.show();
    }
  }

  /**
   * Format Date object or time value in given format and language
   * @param  {Date|Number} date - date or time value to format
   * @param  {String|Object} format - format string or object that contains
   * toDisplay() custom formatter, whose signature is
   * - args:
   *   - date: {Date} - Date instance of the date passed to the method
   *   - format: {Object} - the format object passed to the method
   *   - locale: {Object} - locale for the language specified by `lang`
   * - return:
   *     {String} formatted date
   * @param  {String} [lang=en] - language code for the locale to use
   * @return {String} formatted date
   */
  static formatDate(date, format, lang) {
    return formatDate(date, format, lang && locales[lang] || locales.en);
  }

  /**
   * Parse date string
   * @param  {String|Date|Number} dateStr - date string, Date object or time
   * value to parse
   * @param  {String|Object} format - format string or object that contains
   * toValue() custom parser, whose signature is
   * - args:
   *   - dateStr: {String|Date|Number} - the dateStr passed to the method
   *   - format: {Object} - the format object passed to the method
   *   - locale: {Object} - locale for the language specified by `lang`
   * - return:
   *     {Date|Number} parsed date or its time value
   * @param  {String} [lang=en] - language code for the locale to use
   * @return {Number} time value of parsed date
   */
  static parseDate(dateStr, format, lang) {
    return parseDate(dateStr, format, lang && locales[lang] || locales.en);
  }

  /**
   * @type {Object} - Installed locales in `[languageCode]: localeObject` format
   * en`:_English (US)_ is pre-installed.
   */
  static get locales() {
    return locales;
  }

  /**
   * @type {Boolean} - Whether the picker element is shown. `true` whne shown
   */
  get active() {
    return !!(this.picker && this.picker.active);
  }

  /**
   * @type {HTMLDivElement} - DOM object of picker element
   */
  get pickerElement() {
    return this.picker ? this.picker.element : undefined;
  }

  /**
   * Set new values to the config options
   * @param {Object} options - config options to update
   */
  setOptions(options) {
    const newOptions = processOptions(options, this);
    Object.assign(this._options, options);
    Object.assign(this.config, newOptions);
    this.picker.setOptions(newOptions);

    refreshUI(this, 3);
  }

  /**
   * Show the picker element
   */
  show() {
    if (this.inputField) {
      const {config, inputField} = this;
      if (inputField.disabled || (inputField.readOnly && !config.enableOnReadonly)) {
        return;
      }
      if (!isActiveElement(inputField) && !config.disableTouchKeyboard) {
        this._showing = true;
        inputField.focus();
        delete this._showing;
      }
    }
    this.picker.show();
  }

  /**
   * Hide the picker element
   * Not available on inline picker
   */
  hide() {
    if (!this.inputField) {
      return;
    }
    this.picker.hide();
    this.picker.update().changeView(this.config.startView).render();
  }

  /**
   * Toggle the display of the picker element
   * Not available on inline picker
   *
   * Unlike hide(), the picker does not return to the start view when hiding.
   */
  toggle() {
    if (!this.picker.active) {
      this.show();
    } else if (this.inputField) {
      this.picker.hide();
    }
  }

  /**
   * Destroy the Datepicker instance
   * @return {Detepicker} - the instance destroyed
   */
  destroy() {
    this.hide();
    unregisterListeners(this);
    this.picker.detach();
    const element = this.element;
    element.classList.remove('datepicker-input');
    delete element.datepicker;
    return this;
  }

  /**
   * Get the selected date(s)
   *
   * The method returns a Date object of selected date by default, and returns
   * an array of selected dates in multidate mode. If format string is passed,
   * it returns date string(s) formatted in given format.
   *
   * @param  {String} [format] - format string to stringify the date(s)
   * @return {Date|String|Date[]|String[]} - selected date(s), or if none is
   * selected, empty array in multidate mode and undefined in sigledate mode
   */
  getDate(format = undefined) {
    const callback = getOutputConverter(this, format);

    if (this.config.multidate) {
      return this.dates.map(callback);
    }
    if (this.dates.length > 0) {
      return callback(this.dates[0]);
    }
  }

  /**
   * Set selected date(s)
   *
   * In multidate mode, you can pass multiple dates as a series of arguments
   * or an array. (Since each date is parsed individually, the type of the
   * dates doesn't have to be the same.)
   * The given dates are used to toggle the select status of each date. The
   * number of selected dates is kept from exceeding the length set to
   * maxNumberOfDates.
   *
   * With clear: true option, the method can be used to clear the selection
   * and to replace the selection instead of toggling in multidate mode.
   * If the option is passed with no date arguments or an empty dates array,
   * it works as "clear" (clear the selection then set nothing), and if the
   * option is passed with new dates to select, it works as "replace" (clear
   * the selection then set the given dates)
   *
   * When render: false option is used, the method omits re-rendering the
   * picker element. In this case, you need to call refresh() method later in
   * order for the picker element to reflect the changes. The input field is
   * refreshed always regardless of this option.
   *
   * When invalid (unparsable, repeated, disabled or out-of-range) dates are
   * passed, the method ignores them and applies only valid ones. In the case
   * that all the given dates are invalid, which is distinguished from passing
   * no dates, the method considers it as an error and leaves the selection
   * untouched. (The input field also remains untouched unless revert: true
   * option is used.)
   * Replacing the selection with the same date(s) also causes a similar
   * situation. In both cases, the method does not refresh the picker element
   * unless forceRefresh: true option is used.
   *
   * If viewDate option is used, the method changes the focused date to the
   * specified date instead of the last item of the selection.
   *
   * @param {...(Date|Number|String)|Array} [dates] - Date strings, Date
   * objects, time values or mix of those for new selection
   * @param {Object} [options] - function options
   * - clear: {boolean} - Whether to clear the existing selection
   *     defualt: false
   * - render: {boolean} - Whether to re-render the picker element
   *     default: true
   * - autohide: {boolean} - Whether to hide the picker element after re-render
   *     Ignored when used with render: false
   *     default: config.autohide
   * - revert: {boolean} - Whether to refresh the input field when all the
   *     passed dates are invalid
   *     default: false
   * - forceRefresh: {boolean} - Whether to refresh the picker element when
   *     passed dates don't change the existing selection
   *     default: false
   * - viewDate: {Date|Number|String} - Date to be focused after setiing date(s)
   *     default: The last item of the resulting selection, or defaultViewDate
   *     config option if none is selected
   */
  setDate(...args) {
    const dates = [...args];
    const opts = {};
    const lastArg = lastItemOf(args);
    if (
      lastArg
      && typeof lastArg === 'object'
      && !Array.isArray(lastArg)
      && !(lastArg instanceof Date)
    ) {
      Object.assign(opts, dates.pop());
    }

    const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
    setDate(this, inputDates, opts);
  }

  /**
   * Update the selected date(s) with input field's value
   * Not available on inline picker
   *
   * The input field will be refreshed with properly formatted date string.
   *
   * In the case that all the entered dates are invalid (unparsable, repeated,
   * disabled or out-of-range), which is distinguished from empty input field,
   * the method leaves the input field untouched as well as the selection by
   * default. If revert: true option is used in this case, the input field is
   * refreshed with the existing selection.
   * The method also doesn't refresh the picker element in this case and when
   * the entered dates are the same as the existing selection. If
   * forceRefresh: true option is used, the picker element is refreshed in
   * these cases too.
   *
   * @param  {Object} [options] - function options
   * - autohide: {boolean} - whether to hide the picker element after refresh
   *     default: false
   * - revert: {boolean} - Whether to refresh the input field when all the
   *     passed dates are invalid
   *     default: false
   * - forceRefresh: {boolean} - Whether to refresh the picer element when
   *     input field's value doesn't change the existing selection
   *     default: false
   */
  update(options = undefined) {
    if (!this.inputField) {
      return;
    }

    const opts = Object.assign(options || {}, {clear: true, render: true, viewDate: undefined});
    const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
    setDate(this, inputDates, opts);
  }

  /**
   * Get the focused date
   *
   * The method returns a Date object of focused date by default. If format
   * string is passed, it returns date string formatted in given format.
   *
   * @param  {String} [format] - format string to stringify the date
   * @return {Date|String} - focused date (viewDate)
   */
  getFocusedDate(format = undefined) {
    return getOutputConverter(this, format)(this.picker.viewDate);
  }

  /**
   * Set focused date
   *
   * By default, the method updates the focus on the view shown at the time,
   * or the one set to the startView config option if the picker is hidden.
   * When resetView: true is passed, the view displayed is changed to the
   * pickLevel config option's if the picker is shown.
   *
   * @param {Date|Number|String} viewDate - date string, Date object, time
   * values of the date to focus
   * @param {Boolean} [resetView] - whether to change the view to pickLevel
   * config option's when the picker is shown. Ignored when the picker is
   * hidden
   */
  setFocusedDate(viewDate, resetView = false) {
    const {config, picker, active, rangeSideIndex} = this;
    const pickLevel = config.pickLevel;
    const newViewDate = parseDate(viewDate, config.format, config.locale);
    if (newViewDate === undefined) {
      return;
    }

    picker.changeFocus(regularizeDate(newViewDate, pickLevel, rangeSideIndex));
    if (active && resetView) {
      picker.changeView(pickLevel);
    }
    picker.render();
  }

  /**
   * Refresh the picker element and the associated input field
   * @param {String} [target] - target item when refreshing one item only
   * 'picker' or 'input'
   * @param {Boolean} [forceRender] - whether to re-render the picker element
   * regardless of its state instead of optimized refresh
   */
  refresh(target = undefined, forceRender = false) {
    if (target && typeof target !== 'string') {
      forceRender = target;
      target = undefined;
    }

    let mode;
    if (target === 'picker') {
      mode = 2;
    } else if (target === 'input') {
      mode = 1;
    } else {
      mode = 3;
    }
    refreshUI(this, mode, !forceRender);
  }

  /**
   * Enter edit mode
   * Not available on inline picker or when the picker element is hidden
   */
  enterEditMode() {
    const inputField = this.inputField;
    if (!inputField || inputField.readOnly || !this.picker.active || this.editMode) {
      return;
    }
    this.editMode = true;
    inputField.classList.add('in-edit');
  }

  /**
   * Exit from edit mode
   * Not available on inline picker
   * @param  {Object} [options] - function options
   * - update: {boolean} - whether to call update() after exiting
   *     If false, input field is revert to the existing selection
   *     default: false
   */
  exitEditMode(options = undefined) {
    if (!this.inputField || !this.editMode) {
      return;
    }
    const opts = Object.assign({update: false}, options);
    delete this.editMode;
    this.inputField.classList.remove('in-edit');
    if (opts.update) {
      this.update(opts);
    }
  }
}
