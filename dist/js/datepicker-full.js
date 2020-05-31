(function () {
  'use strict';

  function hasProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function lastItemOf(arr) {
    return arr[arr.length - 1];
  }

  // push only the items not included in the array
  function pushUnique(arr, ...items) {
    items.forEach((item) => {
      if (arr.includes(item)) {
        return;
      }
      arr.push(item);
    });
    return arr;
  }

  function stringToArray(str, separator) {
    // convert empty string to an empty array
    return str ? str.split(separator) : [];
  }

  function isInRange(testVal, min, max) {
    const minOK = min === undefined || testVal >= min;
    const maxOK = max === undefined || testVal <= max;
    return minOK && maxOK;
  }

  function limitToRange(val, min, max) {
    if (val < min) {
      return min;
    }
    if (val > max) {
      return max;
    }
    return val;
  }

  function createTagRepeat(tagName, repeat, attributes = {}, index = 0, html = '') {
    const openTagSrc = Object.keys(attributes).reduce((src, attr) => {
      let val = attributes[attr];
      if (typeof val === 'function') {
        val = val(index);
      }
      return `${src} ${attr}="${val}"`;
    }, tagName);
    html += `<${openTagSrc}></${tagName}>`;

    const next = index + 1;
    return next < repeat
      ? createTagRepeat(tagName, repeat, attributes, next, html)
      : html;
  }

  // Remove the spacing surrounding tags for HTML parser not to create text nodes
  // before/after elements
  function optimizeTemplateHTML(html) {
    return html.replace(/>\s+/g, '>').replace(/\s+</, '<');
  }

  function stripTime(timeValue) {
    return new Date(timeValue).setHours(0, 0, 0, 0);
  }

  function today() {
    return new Date().setHours(0, 0, 0, 0);
  }

  // Get the time value of the start of given date or year, month and day
  function dateValue(...args) {
    switch (args.length) {
      case 0:
        return today();
      case 1:
        return stripTime(args[0]);
    }

    // use setFullYear() to keep 2-digit year from being mapped to 1900-1999
    const newDate = new Date(0);
    newDate.setFullYear(...args);
    return newDate.setHours(0, 0, 0, 0);
  }

  function addDays(date, amount) {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + amount);
  }

  function addWeeks(date, amount) {
    return addDays(date, amount * 7);
  }

  function addMonths(date, amount) {
    // If the day of the date is not in the new month, the last day of the new
    // month will be returned. e.g. Jan 31 + 1 month → Feb 28 (not Mar 03)
    const newDate = new Date(date);
    const monthsToSet = newDate.getMonth() + amount;
    let expectedMonth = monthsToSet % 12;
    if (expectedMonth < 0) {
      expectedMonth += 12;
    }

    const time = newDate.setMonth(monthsToSet);
    return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
  }

  function addYears(date, amount) {
    // If the date is Feb 29 and the new year is not a leap year, Feb 28 of the
    // new year will be returned.
    const newDate = new Date(date);
    const expectedMonth = newDate.getMonth();
    const time = newDate.setFullYear(newDate.getFullYear() + amount);
    return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
  }

  // Calculate the distance bettwen 2 days of the week
  function dayDiff(day, from) {
    return (day - from + 7) % 7;
  }

  // Get the date of the specified day of the week of given base date
  function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
    const baseDay = new Date(baseDate).getDay();
    return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
  }

  // Get the ISO week of a date
  function getWeek(date) {
    // start of ISO week is Monday
    const thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
    // 1st week == the week where the 4th of January is in
    const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
    return Math.round((thuOfTheWeek - firstThu) / 604800000) + 1;
  }

  // Get the start year of the period of years that includes given date
  // years: length of the year period
  function startOfYearPeriod(date, years) {
    /* @see https://en.wikipedia.org/wiki/Year_zero#ISO_8601 */
    const year = new Date(date).getFullYear();
    return Math.floor(year / years) * years;
  }

  // pattern for format parts
  const reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
  // pattern for non date parts
  const reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
  // cache for persed formats
  let knownFormats = {};
  // parse funtions for date parts
  const parseFns = {
    y(date, year) {
      return new Date(date).setFullYear(parseInt(year, 10));
    },
    M: undefined,  // placeholder to maintain the key order
    m(date, month, locale) {
      const newDate = new Date(date);
      let monthIndex = parseInt(month, 10) - 1;

      if (isNaN(monthIndex)) {
        if (!month) {
          return NaN;
        }

        const monthName = month.toLowerCase();
        const compareNames = name => name.toLowerCase().startsWith(monthName);
        // compare with both short and full names because some locales have periods
        // in the short names (not equal to the first X letters of the full names)
        monthIndex = locale.monthsShort.findIndex(compareNames);
        if (monthIndex < 0) {
          monthIndex = locale.months.findIndex(compareNames);
        }
        return monthIndex < 0 ? NaN : newDate.setMonth(monthIndex);
      }

      newDate.setMonth(monthIndex);
      return newDate.getMonth() !== normalizeMonth(monthIndex)
        ? newDate.setDate(0)
        : newDate.getTime();
    },
    d(date, day) {
      return new Date(date).setDate(parseInt(day, 10));
    },
  };
  parseFns.M = parseFns.m;  // make "M" an alias of "m"
  // format functions for date parts
  const formatFns = {
    d(date) {
      return date.getDate();
    },
    dd(date) {
      return padZero(date.getDate(), 2);
    },
    D(date, locale) {
      return locale.daysShort[date.getDay()];
    },
    DD(date, locale) {
      return locale.days[date.getDay()];
    },
    m(date) {
      return date.getMonth() + 1;
    },
    mm(date) {
      return padZero(date.getMonth() + 1, 2);
    },
    M(date, locale) {
      return locale.monthsShort[date.getMonth()];
    },
    MM(date, locale) {
      return locale.months[date.getMonth()];
    },
    y(date) {
      return date.getFullYear();
    },
    yy(date) {
      return padZero(date.getFullYear(), 2).slice(-2);
    },
    yyyy(date) {
      return padZero(date.getFullYear(), 4);
    },
  };

  // get month index in normal range (0 - 11) from any number
  function normalizeMonth(monthIndex) {
    return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
  }

  function padZero(num, length) {
    return num.toString().padStart(length, '0');
  }

  function parseFormatString(format) {
    if (typeof format !== 'string') {
      throw new Error("Invalid date format.");
    }
    if (format in knownFormats) {
      return knownFormats[format];
    }

    // sprit the format string into parts and seprators
    const separators = format.split(reFormatTokens);
    const parts = format.match(new RegExp(reFormatTokens, 'g'));
    if (separators.length === 0 || !parts) {
      throw new Error("Invalid date format.");
    }

    // collect format functions used in the format
    const partFormatters = parts.map(token => formatFns[token]);

    // collect parse functions used in the format
    // iterate over parseFns' keys in order to keep the order of the keys.
    const partParsers = Object.keys(parseFns).reduce((parsers, key) => {
      const token = parts.find(part => part[0] === key);
      if (!token) {
        return parsers;
      }
      parsers[key] = parseFns[key];
      return parsers;
    }, {});
    const partParserKeys = Object.keys(partParsers);

    return knownFormats[format] = {
      parser(dateStr, locale) {
        const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
          if (part.length > 0 && parts[index]) {
            const token = parts[index][0];
            if (parseFns[token] !== undefined) {
              dtParts[token] = part;
            }
          }
          return dtParts;
        }, {});

        // iterate over partParsers' keys so that the parsing is made in the oder
        // of year, month and day to prevent the day parser from correcting last
        // day of month wrongly
        return partParserKeys.reduce((origDate, key) => {
          const newDate = partParsers[key](origDate, dateParts[key], locale);
          // ingnore the part failed to parse
          return isNaN(newDate) ? origDate : newDate;
        }, today());
      },
      formatter(date, locale) {
        let dateStr = partFormatters.reduce((str, fn, index) => {
          return str += `${separators[index]}${fn(date, locale)}`;
        }, '');
        // separators' length is always parts' length + 1,
        return dateStr += lastItemOf(separators);
      },
    };
  }

  function parseDate(dateStr, format, locale) {
    if (dateStr instanceof Date || typeof dateStr === 'number') {
      const date = stripTime(dateStr);
      return isNaN(date) ? undefined : date;
    }
    if (!dateStr) {
      return undefined;
    }
    if (dateStr === 'today') {
      return today();
    }

    if (format && format.toValue) {
      const date = format.toValue(dateStr, format, locale);
      return isNaN(date) ? undefined : stripTime(date);
    }

    return parseFormatString(format).parser(dateStr, locale);
  }

  function formatDate(date, format, locale) {
    if (isNaN(date) || (!date && date !== 0)) {
      return '';
    }

    const dateObj = typeof date === 'number' ? new Date(date) : date;

    if (format.toDisplay) {
      return format.toDisplay(dateObj, format, locale);
    }

    return parseFormatString(format).formatter(dateObj, locale);
  }

  const listenerRegistry = new WeakMap();
  const {addEventListener, removeEventListener} = EventTarget.prototype;

  // Register event listeners to a key object
  // listeners: array of listener definitions;
  //   - each definition must be a flat array of event target and the arguments
  //     used to call addEventListener() on the target
  function registerListeners(keyObj, listeners) {
    let registered = listenerRegistry.get(keyObj);
    if (!registered) {
      registered = [];
      listenerRegistry.set(keyObj, registered);
    }
    listeners.forEach((listener) => {
      addEventListener.call(...listener);
      registered.push(listener);
    });
  }

  function unregisterListeners(keyObj) {
    let listeners = listenerRegistry.get(keyObj);
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => {
      removeEventListener.call(...listener);
    });
    listenerRegistry.delete(keyObj);
  }

  // Event.composedPath() polyfill for Edge
  // based on https://gist.github.com/kleinfreund/e9787d73776c0e3750dcfcdc89f100ec
  if (!Event.prototype.composedPath) {
    const getComposedPath = (node, path = []) => {
      path.push(node);

      let parent;
      if (node.parentNode) {
        parent = node.parentNode;
      } else if (node.host) { // ShadowRoot
        parent = node.host;
      } else if (node.defaultView) {  // Document
        parent = node.defaultView;
      }
      return parent ? getComposedPath(parent, path) : path;
    };

    Event.prototype.composedPath = function () {
      return getComposedPath(this.target);
    };
  }

  function findFromPath(path, criteria, currentTarget, index = 0) {
    const el = path[index];
    if (criteria(el)) {
      return el;
    } else if (el === currentTarget || !el.parentElement) {
      // stop when reaching currentTarget or <html>
      return;
    }
    return findFromPath(path, criteria, currentTarget, index + 1);
  }

  // Search for the actual target of a delegated event
  function findElementInEventPath(ev, selector) {
    const criteria = typeof selector === 'function' ? selector : el => el.matches(selector);
    return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
  }

  // default locales
  const locales = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "Today",
      clear: "Clear",
      titleFormat: "MM y"
    }
  };

  // config options updatable by setOptions() and their default values
  const defaultOptions = {
    autohide: false,
    beforeShowDay: null,
    beforeShowDecade: null,
    beforeShowMonth: null,
    beforeShowYear: null,
    calendarWeeks: false,
    clearBtn: false,
    dateDelimiter: ',',
    datesDisabled: [],
    daysOfWeekDisabled: [],
    daysOfWeekHighlighted: [],
    defaultViewDate: undefined, // placeholder, defaults to today() by the program
    disableTouchKeyboard: false,
    format: 'mm/dd/yyyy',
    language: 'en',
    maxDate: null,
    maxNumberOfDates: 1,
    maxView: 3,
    minDate: null,
    nextArrow: '»',
    orientation: 'auto',
    prevArrow: '«',
    showDaysOfWeek: true,
    showOnFocus: true,
    startView: 0,
    title: '',
    todayBtn: false,
    todayBtnMode: 0,
    todayHighlight: false,
    weekStart: 0,
  };

  const range = document.createRange();

  function parseHTML(html) {
    return range.createContextualFragment(html);
  }

  function hideElement(el) {
    if (el.style.display === 'none') {
      return;
    }
    // back up the existing display setting in data-style-display
    if (el.style.display) {
      el.dataset.styleDisplay = el.style.display;
    }
    el.style.display = 'none';
  }

  function showElement(el) {
    if (el.style.display !== 'none') {
      return;
    }
    if (el.dataset.styleDisplay) {
      // restore backed-up dispay property
      el.style.display = el.dataset.styleDisplay;
      delete el.dataset.styleDisplay;
    } else {
      el.style.display = '';
    }
  }

  function emptyChildNodes(el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
      emptyChildNodes(el);
    }
  }

  function replaceChildNodes(el, newChildNodes) {
    emptyChildNodes(el);
    if (newChildNodes instanceof DocumentFragment) {
      el.appendChild(newChildNodes);
    } else if (typeof newChildNodes === 'string') {
      el.appendChild(parseHTML(newChildNodes));
    } else if (typeof newChildNodes.forEach === 'function') {
      newChildNodes.forEach((node) => {
        el.appendChild(node);
      });
    }
  }

  const {
    language: defaultLang,
    format: defaultFormat,
    weekStart: defaultWeekStart,
  } = defaultOptions;

  // Reducer function to filter out invalid day-of-week from the input
  function sanitizeDOW(dow, day) {
    return dow.length < 6 && day >= 0 && day < 7
      ? pushUnique(dow, day)
      : dow;
  }

  function calcEndOfWeek(startOfWeek) {
    return (startOfWeek + 6) % 7;
  }

  // validate input date. if invalid, fallback to the original value
  function validateDate(value, format, locale, origValue) {
    const date = parseDate(value, format, locale);
    return date !== undefined ? date : origValue;
  }

  // Validate viewId. if invalid, fallback to the original value
  function validateViewId(value, origValue) {
    const viewId = parseInt(value, 10);
    return viewId >= 0 && viewId < 4 ? viewId : origValue;
  }

  // Create Datepicker configuration to set
  function processOptions(options, datepicker) {
    const inOpts = Object.assign({}, options);
    const config = {};
    const locales = datepicker.constructor.locales;
    let {
      format,
      language,
      locale,
      maxDate,
      maxView,
      minDate,
      startView,
      weekStart,
    } = datepicker.config || {};

    if (inOpts.language) {
      let lang;
      if (inOpts.language !== language) {
        if (locales[inOpts.language]) {
          lang = inOpts.language;
        } else {
          // Check if langauge + region tag can fallback to the one without
          // region (e.g. fr-CA → fr)
          lang = inOpts.language.split('-')[0];
          if (locales[lang] === undefined) {
            lang = false;
          }
        }
      }
      delete inOpts.language;
      if (lang) {
        language = config.language = lang;

        // update locale as well when updating language
        const origLocale = locale || locales[defaultLang];
        // use default language's properties for the fallback
        locale = Object.assign({
          format: defaultFormat,
          weekStart: defaultWeekStart
        }, locales[defaultLang]);
        if (language !== defaultLang) {
          Object.assign(locale, locales[language]);
        }
        config.locale = locale;
        // if format and/or weekStart are the same as old locale's defaults,
        // update them to new locale's defaults
        if (format === origLocale.format) {
          format = config.format = locale.format;
        }
        if (weekStart === origLocale.weekStart) {
          weekStart = config.weekStart = locale.weekStart;
          config.weekEnd = calcEndOfWeek(locale.weekStart);
        }
      }
    }

    if (inOpts.format) {
      const hasToDisplay = typeof inOpts.format.toDisplay === 'function';
      const hasToValue = typeof inOpts.format.toValue === 'function';
      const validFormatString = reFormatTokens.test(inOpts.format);
      if ((hasToDisplay && hasToValue) || validFormatString) {
        format = config.format = inOpts.format;
      }
      delete inOpts.format;
    }

    //*** dates ***//
    // while min and maxDate for "no limit" in the options are better to be null
    // (especially when updating), the ones in the config have to be undefined
    // because null is treated as 0 (= unix epoch) when comparing with time value
    let minDt = minDate;
    let maxDt = maxDate;
    if (inOpts.minDate !== undefined) {
      minDt = inOpts.minDate === null
        ? dateValue(0, 0, 1)  // set 0000-01-01 to prevent negative values for year
        : validateDate(inOpts.minDate, format, locale, minDt);
      delete inOpts.minDate;
    }
    if (inOpts.maxDate !== undefined) {
      maxDt = inOpts.maxDate === null
        ? undefined
        : validateDate(inOpts.maxDate, format, locale, maxDt);
      delete inOpts.maxDate;
    }
    if (maxDt < minDt) {
      minDate = config.minDate = maxDt;
      maxDate = config.maxDate = minDt;
    } else {
      if (minDate !== minDt) {
        minDate = config.minDate = minDt;
      }
      if (maxDate !== maxDt) {
        maxDate = config.maxDate = maxDt;
      }
    }

    if (inOpts.datesDisabled) {
      config.datesDisabled = inOpts.datesDisabled.reduce((dates, dt) => {
        const date = parseDate(dt, format, locale);
        return date !== undefined ? pushUnique(dates, date) : dates;
      }, []);
      delete inOpts.datesDisabled;
    }
    if (inOpts.defaultViewDate !== undefined) {
      const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
      if (viewDate !== undefined) {
        config.defaultViewDate = viewDate;
      }
      delete inOpts.defaultViewDate;
    }

    //*** days of week ***//
    if (inOpts.weekStart !== undefined) {
      const wkStart = Number(inOpts.weekStart) % 7;
      if (!isNaN(wkStart)) {
        weekStart = config.weekStart = wkStart;
        config.weekEnd = calcEndOfWeek(wkStart);
      }
      delete inOpts.weekStart;
    }
    if (inOpts.daysOfWeekDisabled) {
      config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekDisabled;
    }
    if (inOpts.daysOfWeekHighlighted) {
      config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekHighlighted;
    }

    //*** multi date ***//
    if (inOpts.maxNumberOfDates !== undefined) {
      const maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
      if (maxNumberOfDates >= 0) {
        config.maxNumberOfDates = maxNumberOfDates;
        config.multidate = maxNumberOfDates !== 1;
      }
      delete inOpts.maxNumberOfDates;
    }
    if (inOpts.dateDelimiter) {
      config.dateDelimiter = String(inOpts.dateDelimiter);
      delete inOpts.dateDelimiter;
    }

    //*** view mode ***//
    let newMaxView = maxView;
    if (inOpts.maxView !== undefined) {
      newMaxView = validateViewId(inOpts.maxView, maxView);
      delete inOpts.maxView;
    }
    if (newMaxView !== maxView) {
      maxView = config.maxView = newMaxView;
    }

    let newStartView = startView;
    if (inOpts.startView !== undefined) {
      newStartView = validateViewId(inOpts.startView, newStartView);
      delete inOpts.startView;
    }
    // ensure start view < max
    newStartView = maxView < newStartView ? maxView : newStartView;
    if (newStartView !== startView) {
      config.startView = newStartView;
    }

    //*** template ***//
    if (inOpts.prevArrow) {
      const prevArrow = parseHTML(inOpts.prevArrow);
      if (prevArrow.childNodes.length > 0) {
        config.prevArrow = prevArrow.childNodes;
      }
      delete inOpts.prevArrow;
    }
    if (inOpts.nextArrow) {
      const nextArrow = parseHTML(inOpts.nextArrow);
      if (nextArrow.childNodes.length > 0) {
        config.nextArrow = nextArrow.childNodes;
      }
      delete inOpts.nextArrow;
    }

    //*** misc ***//
    if (inOpts.disableTouchKeyboard !== undefined) {
      config.disableTouchKeyboard = 'ontouchstart' in document && !!inOpts.disableTouchKeyboard;
      delete inOpts.disableTouchKeyboard;
    }
    if (inOpts.orientation) {
      const orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
      config.orientation = {
        x: orientation.find(x => (x === 'left' || x === 'right')) || 'auto',
        y: orientation.find(y => (y === 'top' || y === 'bottom')) || 'auto',
      };
      delete inOpts.orientation;
    }
    if (inOpts.todayBtnMode !== undefined) {
      switch(inOpts.todayBtnMode) {
        case 0:
        case 1:
          config.todayBtnMode = inOpts.todayBtnMode;
      }
      delete inOpts.todayBtnMode;
    }

    //*** copy the rest ***//
    Object.keys(inOpts).forEach((key) => {
      if (inOpts[key] !== undefined && hasProperty(defaultOptions, key)) {
        config[key] = inOpts[key];
      }
    });

    return config;
  }

  const pickerTemplate = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        <button class="%buttonClass% prev-btn"></button>
        <button class="%buttonClass% view-switch"></button>
        <button class="%buttonClass% next-btn"></button>
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        <button class="%buttonClass% today-btn"></button>
        <button class="%buttonClass% clear-btn"></button>
      </div>
    </div>
  </div>
</div>`);

  const daysTemplate = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat('span', 7, {class: 'dow'})}</div>
  <div class="datepicker-grid">${createTagRepeat('span', 42)}</div>
</div>`);

  const calendarWeeksTemplate = optimizeTemplateHTML(`<div class="calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat('span', 6, {class: 'week'})}</div>
</div>`);

  // Base class of the view classes
  class View {
    constructor(picker, config) {
      Object.assign(this, config, {
        picker,
        element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
        selected: [],
      });
      this.init(this.picker.datepicker.config);
    }

    init(options) {
      this.setOptions(options);
      this.updateFocus();
      this.updateSelection();
    }

    // Execute beforeShow() callback and apply the result to the element
    // args:
    // - current - current value on the iteration on view rendering
    // - timeValue - time value of the date to pass to beforeShow()
    performBeforeHook(el, current, timeValue) {
      let result = this.beforeShow(new Date(timeValue));
      switch (typeof result) {
        case 'boolean':
          result = {enabled: result};
          break;
        case 'string':
          result = {classes: result};
      }

      if (result) {
        if (result.enabled === false) {
          el.classList.add('disabled');
          pushUnique(this.disabled, current);
        }
        if (result.classes) {
          const extraClasses = result.classes.split(/\s+/);
          el.classList.add(...extraClasses);
          if (extraClasses.includes('disabled')) {
            pushUnique(this.disabled, current);
          }
        }
        if (result.content) {
          replaceChildNodes(el, result.content);
        }
      }
    }
  }

  class DaysView extends View {
    constructor(picker) {
      super(picker, {
        id: 0,
        name: 'days',
        cellClass: 'day',
      });
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        const inner = parseHTML(daysTemplate).firstChild;
        this.dow = inner.firstChild;
        this.grid = inner.lastChild;
        this.element.appendChild(inner);
      }
      super.init(options);
    }

    setOptions(options) {
      let updateDOW;

      if (hasProperty(options, 'minDate')) {
        this.minDate = options.minDate;
      }
      if (hasProperty(options, 'maxDate')) {
        this.maxDate = options.maxDate;
      }
      if (options.datesDisabled) {
        this.datesDisabled = options.datesDisabled;
      }
      if (options.daysOfWeekDisabled) {
        this.daysOfWeekDisabled = options.daysOfWeekDisabled;
        updateDOW = true;
      }
      if (options.daysOfWeekHighlighted) {
        this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
      }
      if (options.todayHighlight !== undefined) {
        this.todayHighlight = options.todayHighlight;
      }
      if (options.weekStart !== undefined) {
        this.weekStart = options.weekStart;
        this.weekEnd = options.weekEnd;
        updateDOW = true;
      }
      if (options.locale) {
        const locale = this.locale = options.locale;
        this.dayNames = locale.daysMin;
        this.switchLabelFormat = locale.titleFormat;
        this.switchLabel = formatDate(this.picker.viewDate, locale.titleFormat, locale);
        updateDOW = true;
      }
      if (options.beforeShowDay !== undefined) {
        this.beforeShow = typeof options.beforeShowDay === 'function'
          ? options.beforeShowDay
          : undefined;
      }

      if (options.calendarWeeks !== undefined) {
        if (options.calendarWeeks && !this.calendarWeeks) {
          const weeksElem = parseHTML(calendarWeeksTemplate).firstChild;
          this.calendarWeeks = {
            element: weeksElem,
            dow: weeksElem.firstChild,
            weeks: weeksElem.lastChild,
          };
          this.element.insertBefore(weeksElem, this.element.firstChild);
        } else if (this.calendarWeeks && !options.calendarWeeks) {
          this.element.removeChild(this.calendarWeeks.element);
          this.calendarWeeks = null;
        }
      }
      if (options.showDaysOfWeek !== undefined) {
        if (options.showDaysOfWeek) {
          showElement(this.dow);
          if (this.calendarWeeks) {
            showElement(this.calendarWeeks.dow);
          }
        } else {
          hideElement(this.dow);
          if (this.calendarWeeks) {
            hideElement(this.calendarWeeks.dow);
          }
        }
      }

      // update days-of-week when locale, daysOfweekDisabled or weekStart is changed
      if (updateDOW) {
        Array.from(this.dow.children).forEach((el, index) => {
          const dow = (this.weekStart + index) % 7;
          el.textContent = this.dayNames[dow];
          el.className = this.daysOfWeekDisabled.includes(dow) ? 'dow disabled' : 'dow';
        });
      }
    }

    // Apply update on the focused date to view's settings
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const viewYear = viewDate.getFullYear();
      const viewMonth = viewDate.getMonth();
      const firstOfMonth = dateValue(viewYear, viewMonth, 1);
      const start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);

      this.first = firstOfMonth;
      this.last = dateValue(viewYear, viewMonth + 1, 0);
      this.start = start;

      this.switchLabel = formatDate(viewDate, this.switchLabelFormat, this.locale);
      this.focused = this.picker.viewDate;
    }

    // Apply update on the selected dates to view's settings
    updateSelection() {
      const {dates, range} = this.picker.datepicker;
      this.selected = dates;
      this.range = range;
    }

     // Update the entire view UI
    render() {
      // update today marker on ever render
      this.today = this.todayHighlight ? today() : undefined;
      // refresh disabled dates on every render in order to clear the ones added
      // by beforeShow hook at previous render
      this.disabled = [...this.datesDisabled];

      this.picker.setViewSwitchLabel(this.switchLabel);
      this.picker.setPrevBtnDisabled(this.first <= this.minDate);
      this.picker.setNextBtnDisabled(this.last >= this.maxDate);

      if (this.calendarWeeks) {
        // start of the UTC week (Monday) of the 1st of the month
        const startOfWeek = dayOfTheWeekOf(this.first, 1, 1);
        Array.from(this.calendarWeeks.weeks.children).forEach((el, index) => {
          el.textContent = getWeek(addWeeks(startOfWeek, index));
        });
      }
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const current = addDays(this.start, index);
        const date = new Date(current);
        const day = date.getDay();

        el.className = `datepicker-cell ${this.cellClass}`;
        el.dataset.date = current;
        el.textContent = date.getDate();

        if (current < this.first) {
          classList.add('prev');
        } else if (current > this.last) {
          classList.add('next');
        }
        if (this.today === current) {
          classList.add('today');
        }
        if (current < this.minDate || current > this.maxDate || this.disabled.includes(current)) {
          classList.add('disabled');
        }
        if (this.daysOfWeekDisabled.includes(day)) {
          classList.add('disabled');
          pushUnique(this.disabled, current);
        }
        if (this.daysOfWeekHighlighted.includes(day)) {
          classList.add('highlighted');
        }
        if (this.range){
          const [rangeStart, rangeEnd] = this.range;
          if (current > rangeStart && current < rangeEnd) {
            classList.add('range');
          }
          if (current === rangeStart) {
            classList.add('range-start');
          }
          if (current === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, current, current);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const [rangeStart, rangeEnd] = this.range || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el) => {
        const current = Number(el.dataset.date);
        const classList = el.classList;
        if (current > rangeStart && current < rangeEnd) {
          classList.add('range');
        }
        if (current === rangeStart) {
          classList.add('range-start');
        }
        if (current === rangeEnd) {
          classList.add('range-end');
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      const index = Math.round((this.focused - this.start) / 86400000);
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[index].classList.add('focused');
    }
  }

  class MonthsView extends View {
    constructor(picker) {
      super(picker, {
        id: 1,
        name: 'months',
        cellClass: 'month',
      });
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        this.grid = this.element;
        this.element.classList.add('months', 'datepicker-grid');
        this.grid.appendChild(parseHTML(createTagRepeat('span', 12, {'data-month': ix => ix})));
      }
      super.init(options);
    }

    setOptions(options) {
      if (options.locale) {
        this.monthNames = options.locale.monthsShort;
      }
      if (hasProperty(options, 'minDate')) {
        if (options.minDate === undefined) {
          this.minYear = this.minMonth = this.minDate = undefined;
        } else {
          const minDateObj = new Date(options.minDate);
          this.minYear = minDateObj.getFullYear();
          this.minMonth = minDateObj.getMonth();
          this.minDate = minDateObj.setDate(1);
        }
      }
      if (hasProperty(options, 'maxDate')) {
        if (options.maxDate === undefined) {
          this.maxYear = this.maxMonth = this.maxDate = undefined;
        } else {
          const maxDateObj = new Date(options.maxDate);
          this.maxYear = maxDateObj.getFullYear();
          this.maxMonth = maxDateObj.getMonth();
          this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
        }
      }
      if (options.beforeShowMonth !== undefined) {
        this.beforeShow = typeof options.beforeShowMonth === 'function'
          ? options.beforeShowMonth
          : undefined;
      }
    }

    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      this.year = viewDate.getFullYear();
      this.switchLabel = this.year;
      this.focused = viewDate.getMonth();
    }

    // Update view's settings to reflect the selected dates
    updateSelection() {
      this.selected = this.picker.datepicker.dates.reduce((selected, timeValue) => {
        const date = new Date(timeValue);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (selected[year] === undefined) {
          selected[year] = [month];
        } else {
          pushUnique(selected[year], month);
        }
        return selected;
      }, {});
    }

    // Update the entire view UI
    render() {
      // refresh disabled months on every render in order to clear the ones added
      // by beforeShow hook at previous render
      this.disabled = [];

      this.picker.setViewSwitchLabel(this.switchLabel);
      this.picker.setPrevBtnDisabled(this.year <= this.minYear);
      this.picker.setNextBtnDisabled(this.year >= this.maxYear);

      const selected = this.selected[this.year] || [];
      const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
      const isMinYear = this.year === this.minYear;
      const isMaxYear = this.year === this.maxYear;
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;

        el.className = `datepicker-cell ${this.cellClass}`;
        // reset text on every render to clear the custom content set
        // by beforeShow hook at previous render
        el.textContent = this.monthNames[index];

        if (
          yrOutOfRange
          || isMinYear && index < this.minMonth
          || isMaxYear && index > this.maxMonth
        ) {
          classList.add('disabled');
        }
        if (selected.includes(index)) {
          classList.add('selected');
        }
        if (index === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, index, dateValue(this.year, index, 1));
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const selected = this.selected[this.year] || [];
      this.grid.querySelectorAll('.selected, .focused').forEach((el) => {
        el.classList.remove('selected', 'focused');
      });
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        if (selected.includes(index)) {
          classList.add('selected');
        }
        if (index === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[this.focused].classList.add('focused');
    }
  }

  function toTitleCase(word) {
    return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), '');
  }

  // Class representing the years and decades view elements
  class YearsView extends View {
    constructor(picker, config) {
      super(picker, config);
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        this.navStep = this.step * 10;
        this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
        this.grid = this.element;
        this.element.classList.add(this.name, 'datepicker-grid');
        this.grid.appendChild(parseHTML(createTagRepeat('span', 12)));
      }
      super.init(options);
    }

    setOptions(options) {
      if (hasProperty(options, 'minDate')) {
        if (options.minDate === undefined) {
          this.minYear = this.minDate = undefined;
        } else {
          this.minYear = startOfYearPeriod(options.minDate, this.step);
          this.minDate = dateValue(this.minYear, 0, 1);
        }
      }
      if (hasProperty(options, 'maxDate')) {
        if (options.maxDate === undefined) {
          this.maxYear = this.maxDate = undefined;
        } else {
          this.maxYear = startOfYearPeriod(options.maxDate, this.step);
          this.maxDate = dateValue(this.maxYear, 11, 31);
        }
      }
      if (options[this.beforeShowOption] !== undefined) {
        const beforeShow = options[this.beforeShowOption];
        this.beforeShow = typeof beforeShow === 'function' ? beforeShow : undefined;
      }
    }

    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const first = startOfYearPeriod(viewDate, this.navStep);
      const last = first + 9 * this.step;

      this.first = first;
      this.last = last;
      this.start = first - this.step;
      this.switchLabel = `${first}-${last}`;
      this.focused = startOfYearPeriod(viewDate, this.step);
    }

    // Update view's settings to reflect the selected dates
    updateSelection() {
      this.selected = this.picker.datepicker.dates.reduce((years, timeValue) => {
        return pushUnique(years, startOfYearPeriod(timeValue, this.step));
      }, []);
    }

    // Update the entire view UI
    render() {
      // refresh disabled years on every render in order to clear the ones added
      // by beforeShow hook at previous render
      this.disabled = [];

      this.picker.setViewSwitchLabel(this.switchLabel);
      this.picker.setPrevBtnDisabled(this.first <= this.minYear);
      this.picker.setNextBtnDisabled(this.last >= this.maxYear);

      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const current = this.start + (index * this.step);

        el.className = `datepicker-cell ${this.cellClass}`;
        el.textContent = el.dataset.year = current;

        if (index === 0) {
          classList.add('prev');
        } else if (index === 11) {
          classList.add('next');
        }
        if (current < this.minYear || current > this.maxYear) {
          classList.add('disabled');
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, current, dateValue(current, 0, 1));
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      this.grid.querySelectorAll('.selected, .focused').forEach((el) => {
        el.classList.remove('selected', 'focused');
      });
      Array.from(this.grid.children).forEach((el) => {
        const current = Number(el.textContent);
        const classList = el.classList;
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      const index = Math.round((this.focused - this.start) / this.step);
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[index].classList.add('focused');
    }
  }

  function triggerDatepickerEvent(datepicker, type) {
    const detail = {
      date: datepicker.getDate(),
      viewDate: new Date(datepicker.picker.viewDate),
      viewId: datepicker.picker.currentView.id,
      datepicker,
    };
    datepicker.element.dispatchEvent(new CustomEvent(type, {detail}));
  }

  // direction: -1 (to previous), 1 (to next)
  function goToPrevOrNext(datepicker, direction) {
    const {minDate, maxDate} = datepicker.config;
    const {currentView, viewDate} = datepicker.picker;
    let newViewDate;
    switch (currentView.id) {
      case 0:
        newViewDate = addMonths(viewDate, direction);
        break;
      case 1:
        newViewDate = addYears(viewDate, direction);
        break;
      default:
        newViewDate = addYears(viewDate, direction * currentView.navStep);
    }
    newViewDate = limitToRange(newViewDate, minDate, maxDate);
    datepicker.picker.changeFocus(newViewDate).render();
  }

  function switchView(datepicker) {
    const viewId = datepicker.picker.currentView.id;
    if (viewId === datepicker.config.maxView) {
      return;
    }
    datepicker.picker.changeView(viewId + 1).render();
  }

  function goToSelectedMonthOrYear(datepicker, selection) {
    const picker = datepicker.picker;
    const viewDate = new Date(picker.viewDate);
    const viewId = picker.currentView.id;
    const newDate = viewId === 1
      ? addMonths(viewDate, selection - viewDate.getMonth())
      : addYears(viewDate, selection - viewDate.getFullYear());

    picker.changeFocus(newDate).changeView(viewId - 1).render();
  }

  function onClickTodayBtn(datepicker) {
    const picker = datepicker.picker;
    const currentDate = today();
    if (datepicker.config.todayBtnMode === 1) {
      if (datepicker.config.autohide) {
        datepicker.setDate(currentDate);
        return;
      }
      datepicker.setDate(currentDate, {render: false});
      picker.update();
    }
    if (picker.viewDate !== currentDate) {
      picker.changeFocus(currentDate);
    }
    picker.changeView(0).render();
  }

  function onClickClearBtn(datepicker) {
    datepicker.setDate({clear: true});
  }

  function onClickViewSwitch(datepicker) {
    switchView(datepicker);
  }

  function onClickPrevBtn(datepicker) {
    goToPrevOrNext(datepicker, -1);
  }

  function onClickNextBtn(datepicker) {
    goToPrevOrNext(datepicker, 1);
  }

  // For the picker's main block to delegete the events from `datepicker-cell`s
  function onClickView(datepicker, ev) {
    const target = findElementInEventPath(ev, '.datepicker-cell');
    if (!target || target.classList.contains('disabled')) {
      return;
    }

    switch (datepicker.picker.currentView.id) {
      case 0:
        datepicker.setDate(Number(target.dataset.date));
        break;
      case 1:
        goToSelectedMonthOrYear(datepicker, Number(target.dataset.month));
        break;
      default:
        goToSelectedMonthOrYear(datepicker, Number(target.dataset.year));
    }
  }

  function onClickPicker(datepicker, ev) {
    ev.preventDefault();
    ev.stopPropagation();

    // check if the picker is active in order to prevent the picker from being
    // re-shown after auto-hide when showOnFocus: true
    // it's caused by bubbled event from cells/buttons, but the bubbling cannot
    // be disabled because it's needed to keep the focus on the input element
    if (!datepicker.inline && datepicker.picker.active && !datepicker.config.disableTouchKeyboard) {
      datepicker.inputField.focus();
    }
  }

  function processPickerOptions(picker, options) {
    if (options.title !== undefined) {
      if (options.title) {
        picker.controls.title.textContent = options.title;
        showElement(picker.controls.title);
      } else {
        picker.controls.title.textContent = '';
        hideElement(picker.controls.title);
      }
    }
    if (options.prevArrow) {
      const prevBtn = picker.controls.prevBtn;
      emptyChildNodes(prevBtn);
      options.prevArrow.forEach((node) => {
        prevBtn.appendChild(node.cloneNode(true));
      });
    }
    if (options.nextArrow) {
      const nextBtn = picker.controls.nextBtn;
      emptyChildNodes(nextBtn);
      options.nextArrow.forEach((node) => {
        nextBtn.appendChild(node.cloneNode(true));
      });
    }
    if (options.locale) {
      picker.controls.todayBtn.textContent = options.locale.today;
      picker.controls.clearBtn.textContent = options.locale.clear;
    }
    if (options.todayBtn !== undefined) {
      if (options.todayBtn) {
        showElement(picker.controls.todayBtn);
      } else {
        hideElement(picker.controls.todayBtn);
      }
    }
    if (hasProperty(options, 'minDate') || hasProperty(options, 'maxDate')) {
      const {minDate, maxDate} = picker.datepicker.config;
      picker.controls.todayBtn.disabled = !isInRange(today(), minDate, maxDate);
    }
    if (options.clearBtn !== undefined) {
      if (options.clearBtn) {
        showElement(picker.controls.clearBtn);
      } else {
        hideElement(picker.controls.clearBtn);
      }
    }
  }

  // Compute view date to reset, which will be...
  // - the last item of the selected dates or defaultViewDate if no selection
  // - limitted to minDate or maxDate if it exceeds the range
  function computeResetViewDate(datepicker) {
    const {dates, config} = datepicker;
    const viewDate = dates.length > 0 ? lastItemOf(dates) : config.defaultViewDate;
    return limitToRange(viewDate, config.minDate, config.maxDate);
  }

  // Change current view's view date
  function setViewDate(picker, newDate) {
    const oldViewDate = new Date(picker.viewDate);
    const newViewDate = new Date(newDate);
    const {id, year, first, last} = picker.currentView;
    const viewYear = newViewDate.getFullYear();

    picker.viewDate = newDate;
    if (viewYear !== oldViewDate.getFullYear()) {
      triggerDatepickerEvent(picker.datepicker, 'changeYear');
    }
    if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
      triggerDatepickerEvent(picker.datepicker, 'changeMonth');
    }

    // return whether the new date is in different period on time from the one
    // displayed in the current view
    // when true, the view needs to be re-rendered on the next UI refresh.
    switch (id) {
      case 0:
        return newDate < first || newDate > last;
      case 1:
        return viewYear !== year;
      default:
        return viewYear < first || viewYear > last;
    }
  }

  function getTextDirection(el) {
    return window.getComputedStyle(el).direction;
  }

  // Class representing the picker UI
  class Picker {
    constructor(datepicker) {
      this.datepicker = datepicker;

      const template = pickerTemplate.replace(/%buttonClass%/g, datepicker.config.buttonClass);
      const element = this.element = parseHTML(template).firstChild;
      const [header, main, footer] = element.firstChild.children;
      const title = header.firstElementChild;
      const [prevBtn, viewSwitch, nextBtn] = header.lastElementChild.children;
      const [todayBtn, clearBtn] = footer.firstChild.children;
      const controls = {
        title,
        prevBtn,
        viewSwitch,
        nextBtn,
        todayBtn,
        clearBtn,
      };
      this.main = main;
      this.controls = controls;

      const elementClass = datepicker.inline ? 'inline' : 'dropdown';
      element.classList.add(`datepicker-${elementClass}`);

      processPickerOptions(this, datepicker.config);
      this.viewDate = computeResetViewDate(datepicker);

      // set up event listeners
      registerListeners(datepicker, [
        [element, 'click', onClickPicker.bind(null, datepicker)],
        [main, 'click', onClickView.bind(null, datepicker)],
        [controls.viewSwitch, 'click', onClickViewSwitch.bind(null, datepicker)],
        [controls.prevBtn, 'click', onClickPrevBtn.bind(null, datepicker)],
        [controls.nextBtn, 'click', onClickNextBtn.bind(null, datepicker)],
        [controls.todayBtn, 'click', onClickTodayBtn.bind(null, datepicker)],
        [controls.clearBtn, 'click', onClickClearBtn.bind(null, datepicker)],
      ]);

      // set up views
      this.views = [
        new DaysView(this),
        new MonthsView(this),
        new YearsView(this, {id: 2, name: 'years', cellClass: 'year', step: 1}),
        new YearsView(this, {id: 3, name: 'decades', cellClass: 'decade', step: 10}),
      ];
      this.currentView = this.views[datepicker.config.startView];

      this.currentView.render();
      this.main.appendChild(this.currentView.element);
      datepicker.config.container.appendChild(this.element);
    }

    setOptions(options) {
      processPickerOptions(this, options);
      this.views.forEach((view) => {
        view.init(options, false);
      });
      this.currentView.render();
    }

    detach(){
      this.datepicker.config.container.removeChild(this.element);
    }

    show() {
      if (this.active) {
        return;
      }
      this.element.classList.add('active');
      this.active = true;

      const datepicker = this.datepicker;
      if (!datepicker.inline) {
        // ensure picker's direction matches input's
        const inputDirection = getTextDirection(datepicker.inputField);
        if (inputDirection !== getTextDirection(datepicker.config.container)) {
          this.element.dir = inputDirection;
        } else if (this.element.dir) {
          this.element.removeAttribute('dir');
        }

        this.place();
        if (datepicker.config.disableTouchKeyboard) {
          datepicker.inputField.blur();
        }
      }
      triggerDatepickerEvent(datepicker, 'show');
    }

    hide() {
      if (!this.active) {
        return;
      }
      this.datepicker.exitEditMode();
      this.element.classList.remove('active');
      this.active = false;
      triggerDatepickerEvent(this.datepicker, 'hide');
    }

    place() {
      const {classList, style} = this.element;
      const {config, inputField} = this.datepicker;
      const container = config.container;
      const {
        width: calendarWidth,
        height: calendarHeight,
      } = this.element.getBoundingClientRect();
      const {
        left: containerLeft,
        top: containerTop,
        width: containerWidth,
      } = container.getBoundingClientRect();
      const {
        left: inputLeft,
        top: inputTop,
        width: inputWidth,
        height: inputHeight
      } = inputField.getBoundingClientRect();
      let {x: orientX, y: orientY} = config.orientation;
      let scrollTop;
      let left;
      let top;

      if (container === document.body) {
        scrollTop = window.scrollY;
        left = inputLeft + window.scrollX;
        top = inputTop + scrollTop;
      } else {
        scrollTop = container.scrollTop;
        left = inputLeft - containerLeft;
        top = inputTop - containerTop + scrollTop;
      }

      if (orientX === 'auto') {
        if (left < 0) {
          // align to the left and move into visible area if input's left edge < window's
          orientX = 'left';
          left = 10;
        } else if (left + calendarWidth > containerWidth) {
          // align to the right if canlendar's right edge > container's
          orientX = 'right';
        } else {
          orientX = getTextDirection(inputField) === 'rtl' ? 'right' : 'left';
        }
      }
      if (orientX === 'right') {
        left -= calendarWidth - inputWidth;
      }

      if (orientY === 'auto') {
        orientY = top - calendarHeight < scrollTop ? 'bottom' : 'top';
      }
      if (orientY === 'top') {
        top -= calendarHeight;
      } else {
        top += inputHeight;
      }

      classList.remove(
        'datepicker-orient-top',
        'datepicker-orient-bottom',
        'datepicker-orient-right',
        'datepicker-orient-left'
      );
      classList.add(`datepicker-orient-${orientY}`, `datepicker-orient-${orientX}`);

      style.top = top ? `${top}px` : top;
      style.left = left ? `${left}px` : left;
    }

    setViewSwitchLabel(labelText) {
      this.controls.viewSwitch.textContent = labelText;
    }

    setPrevBtnDisabled(disabled) {
      this.controls.prevBtn.disabled = disabled;
    }

    setNextBtnDisabled(disabled) {
      this.controls.nextBtn.disabled = disabled;
    }

    changeView(viewId) {
      const oldView = this.currentView;
      const newView =  this.views[viewId];
      if (newView.id !== oldView.id) {
        this.currentView = newView;
        this._renderMethod = 'render';
        triggerDatepickerEvent(this.datepicker, 'changeView');
        this.main.replaceChild(newView.element, oldView.element);
      }
      return this;
    }

    // Change the focused date (view date)
    changeFocus(newViewDate) {
      this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refreshFocus';
      this.views.forEach((view) => {
        view.updateFocus();
      });
      return this;
    }

    // Apply the change of the selected dates
    update() {
      const newViewDate = computeResetViewDate(this.datepicker);
      this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refresh';
      this.views.forEach((view) => {
        view.updateFocus();
        view.updateSelection();
      });
      return this;
    }

    // Refresh the picker UI
    render() {
      const renderMethod = this._renderMethod || 'render';
      delete this._renderMethod;

      this.currentView[renderMethod]();
    }
  }

  // Find the closest date that doesn't meet the condition for unavailable date
  // Returns undefined if no available date is found
  // addFn: function to calculate the next date
  //   - args: time value, amount
  // increase: amount to pass to addFn
  // testFn: function to test the unavailablity of the date
  //   - args: time value; retun: true if unavailable
  function findNextAvailableOne(date, addFn, increase, testFn, min, max) {
    if (!isInRange(date, min, max)) {
      return;
    }
    if (testFn(date)) {
      const newDate = addFn(date, increase);
      return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
    }
    return date;
  }

  // direction: -1 (left/up), 1 (right/down)
  // vertical: true for up/down, false for left/right
  function moveByArrowKey(datepicker, ev, direction, vertical) {
    const currentView = datepicker.picker.currentView;
    const step = currentView.step || 1;
    let viewDate = datepicker.picker.viewDate;
    let addFn;
    let testFn;
    switch (currentView.id) {
      case 0:
        if (vertical) {
          viewDate = addDays(viewDate, direction * 7);
        } else if (ev.ctrlKey || ev.metaKey) {
          viewDate = addYears(viewDate, direction);
        } else {
          viewDate = addDays(viewDate, direction);
        }
        addFn = addDays;
        testFn = (date) => currentView.disabled.includes(date);
        break;
      case 1:
        viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
        addFn = addMonths;
        testFn = (date) => {
          const dt = new Date(date);
          const {year, disabled} = currentView;
          return dt.getFullYear() === year && disabled.includes(dt.getMonth());
        };
        break;
      default:
        viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
        addFn = addYears;
        testFn = date => currentView.disabled.includes(startOfYearPeriod(date, step));
    }
    viewDate = findNextAvailableOne(
      viewDate,
      addFn,
      direction < 0 ? -step : step,
      testFn,
      currentView.minDate,
      currentView.maxDate
    );
    if (viewDate !== undefined) {
      datepicker.picker.changeFocus(viewDate).render();
    }
  }

  function onKeydown(datepicker, ev) {
    if (ev.key === 'Tab') {
      datepicker.refresh('input');
      datepicker.hide();
      return;
    }

    const viewId = datepicker.picker.currentView.id;
    if (!datepicker.picker.active) {
      switch (ev.key) {
        case 'ArrowDown':
        case 'Escape':
          datepicker.picker.show();
          break;
        case 'Enter':
          datepicker.update();
          break;
        default:
          return;
      }
    } else if (datepicker.editMode) {
      switch (ev.key) {
        case 'Escape':
          datepicker.exitEditMode();
          break;
        case 'Enter':
          datepicker.exitEditMode({update: true, autohide: datepicker.config.autohide});
          break;
        default:
          return;
      }
    } else {
      switch (ev.key) {
        case 'Escape':
          if (ev.shiftKey) {
            datepicker.enterEditMode();
          } else {
            datepicker.picker.hide();
          }
          break;
        case 'ArrowLeft':
          if (ev.ctrlKey || ev.metaKey) {
            goToPrevOrNext(datepicker, -1);
          } else {
            moveByArrowKey(datepicker, ev, -1, false);
          }
          break;
        case 'ArrowRight':
          if (ev.ctrlKey || ev.metaKey) {
            goToPrevOrNext(datepicker, 1);
          } else {
            moveByArrowKey(datepicker, ev, 1, false);
          }
          break;
        case 'ArrowUp':
          if (ev.ctrlKey || ev.metaKey) {
            switchView(datepicker);
          } else {
            moveByArrowKey(datepicker, ev, -1, true);
          }
          break;
        case 'ArrowDown':
          moveByArrowKey(datepicker, ev, 1, true);
          break;
        case 'Enter':
          if (viewId === 0) {
            datepicker.setDate(datepicker.picker.viewDate);
          } else {
            datepicker.picker.changeView(viewId - 1).render();
          }
          break;
        case 'Backspace':
        case 'Delete':
          datepicker.enterEditMode();
          return;
        default:
          if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) {
            datepicker.enterEditMode();
          }
          return;
      }
    }
    ev.preventDefault();
    ev.stopPropagation();
  }

  function onFocus(datepicker) {
    if (datepicker.config.showOnFocus) {
      datepicker.show();
    }
  }

  // for the prevention for entering edit mode while getting focus on click
  function onMousedown(datepicker, ev) {
    const el = ev.target;
    if (datepicker.picker.active) {
      el._clicking = setTimeout(() => {
        delete el._clicking;
      }, 2000);
    }
  }

  function onClickInput(datepicker, ev) {
    const el = ev.target;
    if (!el._clicking) {
      return;
    }
    clearTimeout(el._clicking);
    delete el._clicking;

    datepicker.enterEditMode();
  }

  function onPaste(datepicker, ev) {
    if (ev.clipboardData.types.includes('text/plain')) {
      datepicker.enterEditMode();
    }
  }

  // for the `document` to delegate the events from outside the picker/input field
  function onClickOutside(datepicker, ev) {
    const element = datepicker.element;
    const pickerElem = datepicker.picker.element;

    if (findElementInEventPath(ev, el => el === element || el === pickerElem)) {
      return;
    }
    datepicker.refresh('input');
    datepicker.hide();
  }

  function stringifyDates(dates, config) {
    return dates
      .map(dt => formatDate(dt, config.format, config.locale))
      .join(config.dateDelimiter);
  }

  // parse input dates and create an array of time values for selection
  // returns undefined if there are no valid dates in inputDates
  // when origDates (current selection) is passed, the function works to mix
  // the input dates into the current selection
  function processInputDates(inputDates, config, origDates = undefined) {
    if (inputDates.length === 0) {
      // empty input is considered valid unless origiDates is passed
      return origDates ? undefined : [];
    }

    let newDates = inputDates.reduce((dates, dt) => {
      const date = parseDate(dt, config.format, config.locale);
      if (
        date !== undefined
        && isInRange(date, config.minDate, config.maxDate)
        && !dates.includes(date)
        && !config.datesDisabled.includes(date)
        && !config.daysOfWeekDisabled.includes(new Date(date).getDay())
      ) {
        dates.push(date);
      }
      return dates;
    }, []);
    if (newDates.length === 0) {
      return;
    }
    if (origDates && config.multidate) {
      // get the synmetric difference between origDates and newDates
      newDates = newDates.reduce((dates, date) => {
        if (!origDates.includes(date)) {
          dates.push(date);
        }
        return dates;
      }, origDates.filter(date => !newDates.includes(date)));
    }
    // do length check always because user can input multiple dates regardless of the mode
    return config.maxNumberOfDates && newDates.length > config.maxNumberOfDates
      ? newDates.slice(config.maxNumberOfDates * -1)
      : newDates;
  }

  /**
   * Class representing a date picker
   */
  class Datepicker {
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

      // set up config
      const config = this.config = Object.assign({
        buttonClass: (options.buttonClass && String(options.buttonClass)) || 'button',
        container: document.body,
        defaultViewDate: today(),
        maxDate: undefined,
        minDate: undefined,
      }, processOptions(defaultOptions, this));
      this._options = options;
      Object.assign(config, processOptions(options, this));

      // configure by type
      const inline = this.inline = element.tagName !== 'INPUT';
      let inputField;
      let initialDates;

      if (inline) {
        config.container = element;
        initialDates = stringToArray(element.dataset.date, config.dateDelimiter);
        delete element.dataset.date;
      } else {
        const container = options.container ? document.querySelector(options.container) : null;
        if (container) {
          config.container = container;
        }
        inputField = this.inputField = element;
        inputField.classList.add('datepicker-input');
        initialDates = stringToArray(inputField.value, config.dateDelimiter);
      }
      // set initial value
      this.dates = processInputDates(initialDates, config) || [];

      if (rangepicker && rangepicker.constructor.name === 'DateRangePicker') {
        this.rangepicker = rangepicker;
        // add getter for range
        Object.defineProperty(this, 'range', {
          get() {
            return this.rangepicker.dates;
          },
        });
      }

      const picker = this.picker = new Picker(this);

      if (inline) {
        this.show();
      } else {
        // set up event listeners in other modes
        const onMousedownDocument = onClickOutside.bind(null, this);
        const listeners = [
          [inputField, 'keydown', onKeydown.bind(null, this)],
          [inputField, 'focus', onFocus.bind(null, this)],
          [inputField, 'mousedown', onMousedown.bind(null, this)],
          [inputField, 'click', onClickInput.bind(null, this)],
          [inputField, 'paste', onPaste.bind(null, this)],
          [document, 'mousedown', onMousedownDocument],
          [document, 'touchstart', onMousedownDocument],
          [window, 'resize', picker.place.bind(picker)]
        ];
        registerListeners(this, listeners);
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
     * Pasre date string
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
     * Set new values to the config options
     * @param {Object} options - config options to update
     */
    setOptions(options) {
      const picker = this.picker;
      const newOptions = processOptions(options, this);
      Object.assign(this._options, options);
      Object.assign(this.config, newOptions);
      picker.setOptions(newOptions);

      const currentViewId = picker.currentView.id;
      if (newOptions.maxView < currentViewId) {
        picker.changeView(newOptions.maxView);
      } else if (
        newOptions.startView !== undefined
        && !picker.active
        && newOptions.startView !== currentViewId
      ) {
        picker.changeView(newOptions.startView);
      }

      this.refresh();
    }

    /**
     * Show the picker element
     */
    show() {
      if (this.inputField && this.inputField.disabled) {
        return;
      }
      this.picker.show();
    }

    /**
     * Hide the picker element
     * Not avilable on inline picker
     */
    hide() {
      if (this.inline) {
        return;
      }
      this.picker.hide();
      this.picker.update().changeView(this.config.startView).render();
    }

    /**
     * Destroy the Datepicker instance
     * @return {Detepicker} - the instance destroyed
     */
    destroy() {
      this.hide();
      unregisterListeners(this);
      this.picker.detach();
      if (!this.inline) {
        this.inputField.classList.remove('datepicker-input');
      }
      delete this.element.datepicker;
      return this;
    }

    /**
     * Get the selected date(s)
     *
     * The method returns a Date object of selected date by default, and returns
     * an array of selected dates in multidate mode. If format string is passed,
     * it returns date string(s) formatted in given format.
     *
     * @param  {String} [format] - Format string to stringify the date(s)
     * @return {Date|String|Date[]|String[]} - selected date(s), or if none is
     * selected, empty array in multidate mode and untitled in sigledate mode
     */
    getDate(format = undefined) {
      const callback = format
        ? date => formatDate(date, format, this.config.locale)
        : date => new Date(date);

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
     * that all the given dates are invalid, which is distiguished from passing
     * no dates, the method considers it as an error and leaves the selection
     * untouched.
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
     */
    setDate(...args) {
      const dates = [...args];
      const opts = {clear: false, render: true, autohide: this.config.autohide};
      const lastArg = lastItemOf(args);
      if (
        typeof lastArg === 'object'
        && !Array.isArray(lastArg)
        && !(lastArg instanceof Date)
      ) {
        Object.assign(opts, dates.pop());
      }

      const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
      const origDates = opts.clear ? undefined : this.dates;
      const newDates = processInputDates(inputDates, this.config, origDates);
      if (!newDates) {
        return;
      }
      if (newDates.toString() !== this.dates.toString()) {
        this.dates = newDates;
        if (opts.render) {
          this.picker.update();
          this.refresh();
        } else {
          this.refresh('input');
        }
        triggerDatepickerEvent(this, 'changeDate');
      } else {
        this.refresh('input');
      }
      if (opts.render && opts.autohide) {
        this.hide();
      }
    }

    /**
     * Update the selected date(s) with input field's value
     * Not avilable on inline picker
     *
     * The input field will be refreshed with properly formatted date string.
     *
     * @param  {Object} [options] - function options
     * - autohide: {boolean} - whether to hide the picker element after refresh
     *     default: false
     */
    update(options = undefined) {
      if (this.inline) {
        return;
      }

      const opts = Object.assign({autohide: false}, options);
      const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
      const newDates = processInputDates(inputDates, this.config);
      if (!newDates) {
        return;
      }
      if (newDates.toString() !== this.dates.toString()) {
        this.dates = newDates;
        this.picker.update();
        this.refresh();
        triggerDatepickerEvent(this, 'changeDate');
      } else {
        this.refresh('input');
      }
      if (opts.autohide) {
        this.hide();
      }
    }

    /**
     * Refresh the picker element and the associated input field
     * @param {String} [target] - target item when refreshing one item only
     * 'picker' or 'input'
     */
    refresh(target = undefined) {
      if (target !== 'input') {
        this.picker.render();
      }
      if (!this.inline && target !== 'picker') {
        this.inputField.value = stringifyDates(this.dates, this.config);
      }
    }

    /**
     * Enter edit mode
     * Not avilable on inline picker or when the picker element is hidden
     */
    enterEditMode() {
      if (this.inline || !this.picker.active || this.editMode) {
        return;
      }
      this.editMode = true;
      this.inputField.classList.add('in-edit');
    }

    /**
     * Exit from edit mode
     * Not avilable on inline picker
     * @param  {Object} [options] - function options
     * - update: {boolean} - whether to call update() after exiting
     *     If false, input field is revert to the existing selection
     *     default: false
     */
    exitEditMode(options = undefined) {
      if (this.inline || !this.editMode) {
        return;
      }
      const opts = Object.assign({update: false}, options);
      delete this.editMode;
      this.inputField.classList.remove('in-edit');
      if (opts.update) {
        this.update(opts);
      } else {
        this.inputField.value = stringifyDates(this.dates, this.config);
      }
    }
  }

  // filter out the config options inapproprite to pass to Datepicker
  function filterOptions(options) {
    const newOpts = Object.assign({}, options);

    delete newOpts.inputs;
    delete newOpts.allowOneSidedRange;
    delete newOpts.maxNumberOfDates; // to ensure each datepicker handles a single date

    return newOpts;
  }

  function setupDatepicker(rangepicker, changeDateListener, el, options) {
    registerListeners(rangepicker, [
      [el, 'changeDate', changeDateListener],
    ]);
    return new Datepicker(el, options, rangepicker);
  }

  function onChangeDate(rangepicker, ev) {
    // to prevent both datepickers trigger the other side's update each other
    if (rangepicker.updating) {
      return;
    }
    rangepicker.updating = true;

    const target = ev.target;
    if (target.datepicker === undefined) {
      return;
    }

    const datepickers = rangepicker.datepickers;
    const setDateOptions = {render: false};
    const changedSide = rangepicker.inputs.indexOf(target);
    const otherSide = changedSide === 0 ? 1 : 0;
    const changedDate = datepickers[changedSide].dates[0];
    const otherDate = datepickers[otherSide].dates[0];

    if (changedDate !== undefined && otherDate !== undefined) {
      // if the start of the range > the end, swap them
      if (changedSide === 0 && changedDate > otherDate) {
        datepickers[0].setDate(otherDate, setDateOptions);
        datepickers[1].setDate(changedDate, setDateOptions);
      } else if (changedSide === 1 && changedDate < otherDate) {
        datepickers[0].setDate(changedDate, setDateOptions);
        datepickers[1].setDate(otherDate, setDateOptions);
      }
    } else if (!rangepicker.allowOneSidedRange) {
      // to prevent the range from becoming one-sided, copy changed side's
      // selection (no matter if it's empty) to the other side
      if (changedDate !== undefined || otherDate !== undefined) {
        setDateOptions.clear = true;
        datepickers[otherSide].setDate(datepickers[changedSide].dates, setDateOptions);
      }
    }
    datepickers[0].picker.update().render();
    datepickers[1].picker.update().render();
    delete rangepicker.updating;
  }

  /**
   * Class representing a date range picker
   */
  class DateRangePicker  {
    /**
     * Create a date range picker
     * @param  {Element} element - element to bind a date range picker
     * @param  {Object} [options] - config options
     */
    constructor(element, options = {}) {
      const inputs = Array.isArray(options.inputs)
        ? options.inputs
        : Array.from(element.querySelectorAll('input'));
      if (inputs.length < 2) {
        return;
      }

      element.rangepicker = this;
      this.element = element;
      this.inputs = inputs.slice(0, 2);
      this.allowOneSidedRange = !!options.allowOneSidedRange;

      const changeDateListener = onChangeDate.bind(null, this);
      const cleanOptions = filterOptions(options);
      this.datepickers = [
        setupDatepicker(this, changeDateListener, this.inputs[0], cleanOptions),
        setupDatepicker(this, changeDateListener, this.inputs[1], cleanOptions),
      ];
      // normalize the range if inital dates are given
      if (this.dates[0] !== undefined) {
        onChangeDate(this, {target: this.inputs[0]});
      } else if (this.dates[1] !== undefined) {
        onChangeDate(this, {target: this.inputs[1]});
      }
    }

    /**
     * @type {Array} - selected date of the linked date pickers
     */
    get dates() {
      if (this.datepickers) {
        return [
          this.datepickers[0].dates[0],
          this.datepickers[1].dates[0],
        ];
      }
    }

    /**
     * Set new values to the config options
     * @param {Object} options - config options to update
     */
    setOptions(options) {
      this.allowOneSidedRange = !!options.allowOneSidedRange;

      const cleanOptions = filterOptions(options);
      this.datepickers[0].setOptions(cleanOptions);
      this.datepickers[1].setOptions(cleanOptions);
    }

    /**
     * Destroy the DateRangePicker instance
     * @return {DateRangePicker} - the instance destroyed
     */
    destroy() {
      this.datepickers[0].destroy();
      this.datepickers[1].destroy();
      unregisterListeners(this);
      delete this.element.rangepicker;
    }

    /**
     * Get the start and end dates of the date range
     *
     * The method returns Date objects by default. If format string is passed,
     * it returns date strings formatted in given format.
     * The result array always contains 2 items (start date/end date) and
     * undifined is used for unselected side. (e.g. If none is selected,
     * the result will be [undifined, undifined]. If only the end date is set
     * when allowOneSidedRange config option is true, [undifined, endDate] will
     * be returned.)
     *
     * @param  {String} [format] - Format string to stringify the dates
     * @return {Array} - Start and end dates
     */
    getDates(format = undefined) {
      const callback = format
        ? date => formatDate(date, format, this.datepickers[0].config.locale)
        : date => new Date(date);

      return this.dates.map(date => date === undefined ? date : callback(date));
    }
  }

  window.Datepicker = Datepicker;
  window.DateRangePicker = DateRangePicker;

}());
