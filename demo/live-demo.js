/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "initialize|on[A-Z]*" }]*/
var templates = {
  input: `<div class="field">
  <div class="control">
    <input type="text" class="input date">
  </div>
</div>`,
  inline: `<div class="date"></div>`,
  range: `<div class="field has-addons date">
  <div class="control">
    <input type="text" name="range-start" class="input">
  </div>
  <div class="control">
    <a class="button is-static">to</a>
  </div>
  <div class="control">
    <input type="text" name="range-end" class="input">
  </div>
</div>`,
};
var beforeShowFns = {
beforeShowDay(date) {
  if (date.getMonth() == new Date().getMonth()) {
    switch (date.getDate()) {
      case 4:
        return {
          content: '<span class="tooltip" data-tooltip="Example tooltip">4</span>',
          classes: 'has-background-info'
        };
      case 8:
        return false;
      case 12:
        return "has-text-success";
    }
  }
},
beforeShowMonth(date) {
  switch (date.getMonth()) {
    case 6:
      if (date.getFullYear() === new Date().getFullYear()) {
        return {content: '🎉'};
      }
      break;
    case 8:
      return false;
  }
},
beforeShowYear(date){
  switch (date.getFullYear()) {
    case 2017:
      return false;
    case 2020:
      return {content: '<span class="tooltip is-tooltip-bottom" data-tooltip="Tooltip text">2020</span>'};
  }
},
beforeShowDecade(date){
  switch (date.getFullYear()) {
    case 2000:
      return false;
    case 2100:
      return {
        content: '💯',
        classes: 'is-background-success',
      };
  }
},
};
var buttonClass;

const defaultOptions = {
  allowOneSidedRange: false,
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
  defaultViewDate: new Date().setHours(0, 0, 0, 0),
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
  todayHighlight: false,
  weekStart: 0,
};
const languages = {
  'ar-tn': 'Arabic-Tunisia',
  ar: 'Arabic',
  az: 'Azerbaijani',
  bg: 'Bulgarian',
  bm: 'Bamanankan',
  bn: 'Bengali (Bangla)',
  br: 'Breton',
  bs: 'Bosnian',
  ca: 'Catalan',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  'en-AU': 'Australian English',
  'en-CA': 'Canadian English',
  'en-GB': 'British English',
  'en-IE': 'Irish English',
  'en-NZ': 'New Zealand English',
  'en-ZA': 'South African English',
  eo: 'Esperanto',
  es: 'Spanish',
  et: 'Estonian',
  eu: 'Basque',
  fa: 'Persian',
  fi: 'Finnish',
  fo: 'Faroese',
  'fr-CH': 'French (Switzerland)',
  fr: 'French',
  gl: 'Galician',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  hu: 'Hungarian',
  hy: 'Armenian',
  id: 'Bahasa',
  is: 'Icelandic',
  'it-CH': 'Italian (Switzerland)',
  it: 'Italian',
  ja: 'Japanese',
  ka: 'Georgian',
  kk: 'Kazakh',
  km: 'Khmer',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  me: 'Montenegrin',
  mk: 'Macedonian',
  mn: 'Mongolian',
  mr: 'Marathi',
  ms: 'Malay',
  'nl-BE': 'Belgium-Dutch',
  nl: 'Dutch',
  no: 'Norwegian',
  oc: 'Occitan',
  pl: 'Polish',
  'pt-BR': 'Brazilian',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovene',
  sq: 'Albanian',
  'sr-latn': 'Serbian latin',
  sr: 'Serbian cyrillic',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  tg: 'Tajik',
  th: 'Thai',
  tk: 'Turkmen',
  tr: 'Turkish',
  uk: 'Ukrainian',
  'uz-cyrl': 'Uzbek cyrillic',
  'uz-latn': 'Uzbek latin',
  vi: 'Vietnamese',
  'zh-CN': 'Simplified Chinese',
  'zh-TW': 'Traditional Chinese',
};
const range = document.createRange();
const sandbox = document.getElementById('sandbox');
const options = document.getElementById('options');
const jsonFields = ['datesDisabled'];

function parseHTML(html) {
  return range.createContextualFragment(html);
}

function getBeforeShowFnSrc(name) {
  return beforeShowFns[name].toString();
}

function switchPicker(type) {
  const options = buttonClass ? {buttonClass} : {};
  if (window.demoPicker) {
    const currentOpts = window.demoPicker instanceof DateRangePicker
      ? window.demoPicker.datepickers[0]._options
      : window.demoPicker._options;
    Object.keys(defaultOptions).reduce((opts, key) => {
      if (key in currentOpts && String(currentOpts[key] !== String(defaultOptions[key]))) {
        opts[key] = currentOpts[key];
      }
      return opts;
    }, options);

    window.demoPicker.destroy();
    sandbox.removeChild(sandbox.firstChild);
  }
  sandbox.appendChild(parseHTML(templates[type]));

  const el = sandbox.querySelector('.date');
  window.demoPicker = type === 'range'
    ? new DateRangePicker(el, options)
    : new Datepicker(el, options);
}

const setOptions = function setOptions(name, value) {
  window.demoPicker.setOptions({[name]: value});
};
const handleArrayOption = function handleArrayOption(name) {
  const checkedInputs = options.querySelectorAll(`input[name=${name}]:checked`);
  setOptions(name, Array.from(checkedInputs).map(el => Number(el.value)));
};

function updateOption(name, value) {
  switch (name) {
    case 'beforeShowDay':
    case 'beforeShowMonth':
    case 'beforeShowYear':
    case 'beforeShowDecade':
      setOptions(name, value ? beforeShowFns[name] : null);
      return;
    case 'daysOfWeekDisabled':
    case 'daysOfWeekHighlighted':
      handleArrayOption(name, value);
      return;
  }

  let newValue;
  if (typeof value === 'string') {
    switch (value) {
      case '':
        newValue = defaultOptions[name];
        break;
      case 'null':
        newValue = null;
        break;
      case 'false':
        newValue = false;
        break;
      case 'true':
        newValue = true;
        break;
      default:
        newValue = Number(value);
        if (isNaN(newValue)) {
          newValue = value;
        }
    }
  } else {
    newValue = value;
  }
  setOptions(name, newValue);
}

function addError(el, message) {
  const field = el.parentElement.parentElement;
  field.appendChild(parseHTML(`<p class="help is-danger">${message}</p>`));
  el.classList.add('is-danger');
}

function removeErrors(el) {
  const field = el.parentElement.parentElement;
  field.querySelectorAll('.help.is-danger').forEach((errMsg) => {
    field.removeChild(errMsg);
  });
  el.classList.remove('is-danger');
}

function onChangeType(ev) {
  switchPicker(ev.target.value);
}

function onChnageDirection(ev) {
  const defaultDir = window.getComputedStyle(document.body).direction;
  const dir = ev.target.value;
  const mainElem = document.querySelector('main');

  if (dir !== defaultDir) {
    mainElem.dir = dir;
  } else {
    mainElem.removeAttribute('dir');
  }
}

function onChangeInputOption(ev) {
  updateOption(ev.target.name, ev.target.value);
}

function onChangeTextareaOption(ev) {
  let {value, name} = ev.target;
  if (jsonFields.includes(name)) {
    removeErrors(ev.target);
    if (value.length > 0) {
      try {
        value = JSON.parse(value);
      } catch (err) {
        addError(ev.target, 'Invalid JSON string');
        return;
      }
    }
  }
  updateOption(name, value);
}

function onClickCheckboxOptions(ev) {
  ev.stopPropagation();

  let checkbox;
  let checked;
  if (ev.target.tagName === 'INPUT') {
    checkbox = ev.target;
    checked = checkbox.checked;
  } else {
    ev.preventDefault();
    checkbox = ev.currentTarget.querySelector('input');
    checked = checkbox.checked = !checkbox.checked;
  }

  const value = checkbox.value === 'true' ? checked : checkbox.value;
  updateOption(checkbox.name, value);
}

function initialize() {
  // load languages
  const selectElem = options.querySelector('select[name=language]');
  Object.keys(languages).forEach((lang) => {
    document.body.appendChild(parseHTML(`<script src="../dist/js/locales/${lang}.js"></script>`));
    selectElem.appendChild(parseHTML(`<option value="${lang}">${lang} – ${languages[lang]}</option>`));
  });

  document.querySelector('.toggle-btn').addEventListener('click', () => {
    document.body.classList.toggle('open');
  });

  document.querySelectorAll('.code-wrap pre').forEach((el) => {
    el.textContent = getBeforeShowFnSrc(el.id.replace('code-', ''));
  });

  // collapsibles
  document.querySelectorAll('.collapse-button').forEach((el) => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.dataset.target);
      el.classList.toggle('is-active');
      target.classList.toggle('is-active');
    });
  });
}
