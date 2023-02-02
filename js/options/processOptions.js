import {pushUnique} from '../lib/utils.js';
import {
  dateValue,
  regularizeDate,
  getIsoWeek,
  getWesternTradWeek,
  getMidEasternWeek,
} from '../lib/date.js';
import {reFormatTokens, parseDate} from '../lib/date-format.js';
import {parseHTML} from '../lib/dom.js';
import defaultOptions from './defaultOptions.js';

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

function determineGetWeekMethod(numberingMode, weekStart) {
  const methodId = numberingMode === 4
    ? (weekStart === 6 ? 3 : !weekStart + 1)
    : numberingMode;
  switch (methodId) {
    case 1:
      return getIsoWeek;
    case 2:
      return getWesternTradWeek;
    case 3:
      return getMidEasternWeek;
  }
}

function updateWeekStart(newValue, config, weekNumbers) {
  config.weekStart = newValue;
  config.weekEnd = (newValue + 6) % 7;
  if (weekNumbers === 4) {
    config.getWeekNumber = determineGetWeekMethod(4, newValue);
  }
  return newValue;
}

// validate input date. if invalid, fallback to the original value
function validateDate(value, format, locale, origValue) {
  const date = parseDate(value, format, locale);
  return date !== undefined ? date : origValue;
}

// Validate viewId. if invalid, fallback to the original value
function validateViewId(value, origValue, max = 3) {
  const viewId = parseInt(value, 10);
  return viewId >= 0 && viewId <= max ? viewId : origValue;
}

function replaceOptions(options, from, to, convert = undefined) {
  if (from in options) {
    if (!(to in options)) {
      options[to] = convert ? convert(options[from]) : options[from];
    }
    delete options[from];
  }
}

// Create Datepicker configuration to set
export default function processOptions(options, datepicker) {
  const inOpts = Object.assign({}, options);
  const config = {};
  const locales = datepicker.constructor.locales;
  const rangeEnd = !!datepicker.rangeSideIndex;
  let {
    datesDisabled,
    format,
    language,
    locale,
    maxDate,
    maxView,
    minDate,
    pickLevel,
    startView,
    weekNumbers,
    weekStart,
  } = datepicker.config || {};

  // for backword compatibility
  replaceOptions(inOpts, 'calendarWeeks', 'weekNumbers', val => val ? 1 : 0);
  replaceOptions(inOpts, 'clearBtn', 'clearButton');
  replaceOptions(inOpts, 'todayBtn', 'todayButton');
  replaceOptions(inOpts, 'todayBtnMode', 'todayButtonMode');

  if (inOpts.language) {
    let lang;
    if (inOpts.language !== language) {
      if (locales[inOpts.language]) {
        lang = inOpts.language;
      } else {
        // Check if langauge + region tag can fallback to the one without
        // region (e.g. fr-CA → fr)
        lang = inOpts.language.split('-')[0];
        if (!locales[lang]) {
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
        weekStart = updateWeekStart(locale.weekStart, config, weekNumbers);
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

  //*** pick level ***//
  let newPickLevel = pickLevel;
  if ('pickLevel' in inOpts) {
    newPickLevel = validateViewId(inOpts.pickLevel, pickLevel, 2);
    delete inOpts.pickLevel;
  }
  if (newPickLevel !== pickLevel) {
    if (newPickLevel > pickLevel) {
      // complement current minDate/madDate so that the existing range will be
      // expanded to fit the new level later
      if (!('minDate' in inOpts)) {
        inOpts.minDate = minDate;
      }
      if (!('maxDate' in inOpts)) {
        inOpts.maxDate = maxDate;
      }
    }
    // complement datesDisabled so that it will be reset later
    if (datesDisabled && !inOpts.datesDisabled) {
      inOpts.datesDisabled = [];
    }
    pickLevel = config.pickLevel = newPickLevel;
  }

  //*** dates ***//
  // while min and maxDate for "no limit" in the options are better to be null
  // (especially when updating), the ones in the config have to be undefined
  // because null is treated as 0 (= unix epoch) when comparing with time value
  let minDt = minDate;
  let maxDt = maxDate;
  if ('minDate' in inOpts) {
    const defaultMinDt = dateValue(0, 0, 1);
    minDt = inOpts.minDate === null
      ? defaultMinDt  // set 0000-01-01 to prevent negative values for year
      : validateDate(inOpts.minDate, format, locale, minDt);
    if (minDt !== defaultMinDt) {
      minDt = regularizeDate(minDt, pickLevel, false);
    }
    delete inOpts.minDate;
  }
  if ('maxDate' in inOpts) {
    maxDt = inOpts.maxDate === null
      ? undefined
      : validateDate(inOpts.maxDate, format, locale, maxDt);
    if (maxDt !== undefined) {
      maxDt = regularizeDate(maxDt, pickLevel, true);
    }
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
    const dtsDisabled = inOpts.datesDisabled;
    if (typeof dtsDisabled === 'function') {
      config.datesDisabled = null;
      config.checkDisabled = (timeValue, viewId) => dtsDisabled(
        new Date(timeValue),
        viewId,
        rangeEnd
      );
    } else {
      const disabled = config.datesDisabled = dtsDisabled.reduce((dates, dt) => {
        const date = parseDate(dt, format, locale);
        return date !== undefined
          ? pushUnique(dates, regularizeDate(date, pickLevel, rangeEnd))
          : dates;
      }, []);
      config.checkDisabled = timeValue => disabled.includes(timeValue);
    }
    delete inOpts.datesDisabled;
  }
  if ('defaultViewDate' in inOpts) {
    const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
    if (viewDate !== undefined) {
      config.defaultViewDate = viewDate;
    }
    delete inOpts.defaultViewDate;
  }

  //*** days of week ***//
  if ('weekStart' in inOpts) {
    const wkStart = Number(inOpts.weekStart) % 7;
    if (!isNaN(wkStart)) {
      weekStart = updateWeekStart(wkStart, config, weekNumbers);
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

  //*** week numbers ***//
  if ('weekNumbers' in inOpts) {
    let method = inOpts.weekNumbers;
    if (method) {
      const getWeekNumber = typeof method === 'function'
        ? (timeValue, startOfWeek) => method(new Date(timeValue), startOfWeek)
        : determineGetWeekMethod((method = parseInt(method, 10)), weekStart);
      if (getWeekNumber) {
        weekNumbers = config.weekNumbers = method;
        config.getWeekNumber = getWeekNumber;
      }
    } else {
      weekNumbers = config.weekNumbers = 0;
      config.getWeekNumber = null;
    }
    delete inOpts.weekNumbers;
  }

  //*** multi date ***//
  if ('maxNumberOfDates' in inOpts) {
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

  //*** view ***//
  let newMaxView = maxView;
  if ('maxView' in inOpts) {
    newMaxView = validateViewId(inOpts.maxView, maxView);
    delete inOpts.maxView;
  }
  // ensure max view >= pick level
  newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
  if (newMaxView !== maxView) {
    maxView = config.maxView = newMaxView;
  }

  let newStartView = startView;
  if ('startView' in inOpts) {
    newStartView = validateViewId(inOpts.startView, newStartView);
    delete inOpts.startView;
  }
  // ensure pick level <= start view <= max view
  if (newStartView < pickLevel) {
    newStartView = pickLevel;
  } else if (newStartView > maxView) {
    newStartView = maxView;
  }
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
  if ('disableTouchKeyboard' in inOpts) {
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
  if ('todayButtonMode' in inOpts) {
    switch(inOpts.todayButtonMode) {
      case 0:
      case 1:
        config.todayButtonMode = inOpts.todayButtonMode;
    }
    delete inOpts.todayButtonMode;
  }

  //*** copy the rest ***//
  Object.entries(inOpts).forEach(([key, value]) => {
    if (value !== undefined && key in defaultOptions) {
      config[key] = value;
    }
  });

  return config;
}
