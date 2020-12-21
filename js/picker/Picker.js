import {hasProperty, lastItemOf, isInRange, limitToRange} from '../lib/utils.js';
import {today} from '../lib/date.js';
import {parseHTML, showElement, hideElement, emptyChildNodes} from '../lib/dom.js';
import {registerListeners} from '../lib/event.js';
import pickerTemplate from './templates/pickerTemplate.js';
import DaysView from './views/DaysView.js';
import MonthsView from './views/MonthsView.js';
import YearsView from './views/YearsView.js';
import {triggerDatepickerEvent} from '../events/functions.js';
import {
  onClickTodayBtn,
  onClickClearBtn,
  onClickViewSwitch,
  onClickPrevBtn,
  onClickNextBtn,
  onClickView,
  onClickPicker,
} from '../events/pickerListeners.js';

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
export default class Picker {
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
      [element, 'click', onClickPicker.bind(null, datepicker), {capture: true}],
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

  detach() {
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
  render(quickRender = true) {
    const renderMethod = (quickRender && this._renderMethod) || 'render';
    delete this._renderMethod;

    this.currentView[renderMethod]();
  }
}
