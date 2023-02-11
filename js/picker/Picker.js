import {lastItemOf, isInRange, limitToRange} from '../lib/utils.js';
import {today, regularizeDate} from '../lib/date.js';
import {
  parseHTML,
  getParent,
  showElement,
  hideElement,
  emptyChildNodes,
} from '../lib/dom.js';
import {registerListeners} from '../lib/event.js';
import pickerTemplate from './templates/pickerTemplate.js';
import DaysView from './views/DaysView.js';
import MonthsView from './views/MonthsView.js';
import YearsView from './views/YearsView.js';
import {
  triggerDatepickerEvent,
  clearSelection,
  goToOrSelectToday,
} from '../events/functions.js';
import {
  onClickViewSwitch,
  onClickPrevButton,
  onClickNextButton,
  onClickView,
  onMousedownPicker,
} from '../events/pickerListeners.js';

const orientClasses = ['left', 'top', 'right', 'bottom'].reduce((obj, key) => {
  obj[key] = `datepicker-orient-${key}`;
  return obj;
}, {});
const toPx = num => num ? `${num}px` : num;

function processPickerOptions(picker, options) {
  if ('title' in options) {
    if (options.title) {
      picker.controls.title.textContent = options.title;
      showElement(picker.controls.title);
    } else {
      picker.controls.title.textContent = '';
      hideElement(picker.controls.title);
    }
  }
  if (options.prevArrow) {
    const prevButton = picker.controls.prevButton;
    emptyChildNodes(prevButton);
    options.prevArrow.forEach((node) => {
      prevButton.appendChild(node.cloneNode(true));
    });
  }
  if (options.nextArrow) {
    const nextButton = picker.controls.nextButton;
    emptyChildNodes(nextButton);
    options.nextArrow.forEach((node) => {
      nextButton.appendChild(node.cloneNode(true));
    });
  }
  if (options.locale) {
    picker.controls.todayButton.textContent = options.locale.today;
    picker.controls.clearButton.textContent = options.locale.clear;
  }
  if ('todayButton' in options) {
    if (options.todayButton) {
      showElement(picker.controls.todayButton);
    } else {
      hideElement(picker.controls.todayButton);
    }
  }
  if ('minDate' in options || 'maxDate' in options) {
    const {minDate, maxDate} = picker.datepicker.config;
    picker.controls.todayButton.disabled = !isInRange(today(), minDate, maxDate);
  }
  if ('clearButton' in options) {
    if (options.clearButton) {
      showElement(picker.controls.clearButton);
    } else {
      hideElement(picker.controls.clearButton);
    }
  }
}

// Compute view date to reset, which will be...
// - the last item of the selected dates or defaultViewDate if no selection
// - limitted to minDate or maxDate if it exceeds the range
function computeResetViewDate(datepicker) {
  const {dates, config, rangeSideIndex} = datepicker;
  const viewDate = dates.length > 0
    ? lastItemOf(dates)
    : regularizeDate(config.defaultViewDate, config.pickLevel, rangeSideIndex);
  return limitToRange(viewDate, config.minDate, config.maxDate);
}

// Change current view's view date
function setViewDate(picker, newDate) {
  if (!('_oldViewDate' in picker) && newDate !== picker.viewDate) {
    picker._oldViewDate = picker.viewDate;
  }
  picker.viewDate = newDate;

  // return whether the new date is in different period on time from the one
  // displayed in the current view
  // when true, the view needs to be re-rendered on the next UI refresh.
  const {id, year, first, last} = picker.currentView;
  const viewYear = new Date(newDate).getFullYear();
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

// find the closet scrollable ancestor elemnt under the body
function findScrollParents(el) {
  const parent = getParent(el);
  if (parent === document.body || !parent) {
    return;
  }

  // checking overflow only is enough because computed overflow cannot be
  // visible or a combination of visible and other when either axis is set
  // to other than visible.
  // (Setting one axis to other than 'visible' while the other is 'visible'
  // results in the other axis turning to 'auto')
  return window.getComputedStyle(parent).overflow !== 'visible'
    ? parent
    : findScrollParents(parent);
}

// Class representing the picker UI
export default class Picker {
  constructor(datepicker) {
    const {config, inputField} = this.datepicker = datepicker;

    const template = pickerTemplate.replace(/%buttonClass%/g, config.buttonClass);
    const element = this.element = parseHTML(template).firstChild;
    const [header, main, footer] = element.firstChild.children;
    const title = header.firstElementChild;
    const [prevButton, viewSwitch, nextButton] = header.lastElementChild.children;
    const [todayButton, clearButton] = footer.firstChild.children;
    const controls = {
      title,
      prevButton,
      viewSwitch,
      nextButton,
      todayButton,
      clearButton,
    };
    this.main = main;
    this.controls = controls;

    const elementClass = inputField ? 'dropdown' : 'inline';
    element.classList.add(`datepicker-${elementClass}`);

    processPickerOptions(this, config);
    this.viewDate = computeResetViewDate(datepicker);

    // set up event listeners
    registerListeners(datepicker, [
      [element, 'mousedown', onMousedownPicker],
      [main, 'click', onClickView.bind(null, datepicker)],
      [controls.viewSwitch, 'click', onClickViewSwitch.bind(null, datepicker)],
      [controls.prevButton, 'click', onClickPrevButton.bind(null, datepicker)],
      [controls.nextButton, 'click', onClickNextButton.bind(null, datepicker)],
      [controls.todayButton, 'click', goToOrSelectToday.bind(null, datepicker)],
      [controls.clearButton, 'click', clearSelection.bind(null, datepicker)],
    ]);

    // set up views
    this.views = [
      new DaysView(this),
      new MonthsView(this),
      new YearsView(this, {id: 2, name: 'years', cellClass: 'year', step: 1}),
      new YearsView(this, {id: 3, name: 'decades', cellClass: 'decade', step: 10}),
    ];
    this.currentView = this.views[config.startView];

    this.currentView.render();
    this.main.appendChild(this.currentView.element);
    if (config.container) {
      config.container.appendChild(this.element);
    } else {
      inputField.after(this.element);
    }
  }

  setOptions(options) {
    processPickerOptions(this, options);
    this.views.forEach((view) => {
      view.init(options, false);
    });
    this.currentView.render();
  }

  detach() {
    this.element.remove();
  }

  show() {
    if (this.active) {
      return;
    }

    const {datepicker, element} = this;
    const inputField = datepicker.inputField;
    if (inputField) {
      // ensure picker's direction matches input's
      const inputDirection = getTextDirection(inputField);
      if (inputDirection !== getTextDirection(getParent(element))) {
        element.dir = inputDirection;
      } else if (element.dir) {
        element.removeAttribute('dir');
      }

      element.style.visibility = 'hidden';
      element.classList.add('active');
      this.place();
      element.style.visibility = '';

      if (datepicker.config.disableTouchKeyboard) {
        inputField.blur();
      }
    } else {
      element.classList.add('active');
    }
    this.active = true;
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
    const {classList, offsetParent, style} = this.element;
    const {config, inputField} = this.datepicker;
    const {
      width: calendarWidth,
      height: calendarHeight,
    } = this.element.getBoundingClientRect();
    const {
      left: inputLeft,
      top: inputTop,
      right: inputRight,
      bottom: inputBottom,
      width: inputWidth,
      height: inputHeight
    } = inputField.getBoundingClientRect();
    let {x: orientX, y: orientY} = config.orientation;
    let left = inputLeft;
    let top = inputTop;

    // caliculate offsetLeft/Top of inputField
    if (offsetParent === document.body || !offsetParent) {
      left += window.scrollX;
      top += window.scrollY;
    } else {
      const offsetParentRect = offsetParent.getBoundingClientRect();
      left -= offsetParentRect.left - offsetParent.scrollLeft;
      top -= offsetParentRect.top - offsetParent.scrollTop;
    }

    // caliculate the boundaries of the visible area that contains inputField
    const scrollParent = findScrollParents(inputField);
    let scrollAreaLeft = 0;
    let scrollAreaTop = 0;
    let {
      clientWidth: scrollAreaRight,
      clientHeight: scrollAreaBottom,
    } = document.documentElement;

    if (scrollParent) {
      const scrollParentRect = scrollParent.getBoundingClientRect();
      if (scrollParentRect.top > 0) {
        scrollAreaTop = scrollParentRect.top;
      }
      if (scrollParentRect.left > 0) {
        scrollAreaLeft = scrollParentRect.left;
      }
      if (scrollParentRect.right < scrollAreaRight) {
        scrollAreaRight = scrollParentRect.right;
      }
      if (scrollParentRect.bottom < scrollAreaBottom) {
        scrollAreaBottom = scrollParentRect.bottom;
      }
    }

    // determine the horizontal orientation and left position
    let adjustment = 0;
    if (orientX === 'auto') {
      if (inputLeft < scrollAreaLeft) {
        orientX = 'left';
        adjustment = scrollAreaLeft - inputLeft;
      } else if (inputLeft + calendarWidth > scrollAreaRight) {
        orientX = 'right';
        if (scrollAreaRight < inputRight) {
          adjustment = scrollAreaRight - inputRight;
        }
      } else if (getTextDirection(inputField) === 'rtl') {
        orientX = inputRight - calendarWidth < scrollAreaLeft ? 'left' : 'right';
      } else {
        orientX = 'left';
      }
    }
    if (orientX === 'right') {
      left += inputWidth - calendarWidth;
    }
    left += adjustment;

    // determine the vertical orientation and top position
    if (orientY === 'auto') {
      if (inputTop - calendarHeight > scrollAreaTop) {
        orientY = inputBottom + calendarHeight > scrollAreaBottom ? 'top' : 'bottom';
      } else {
        orientY = 'bottom';
      }
    }
    if (orientY === 'top') {
      top -= calendarHeight;
    } else {
      top += inputHeight;
    }

    classList.remove(...Object.values(orientClasses));
    classList.add(orientClasses[orientX], orientClasses[orientY]);

    style.left = toPx(left);
    style.top = toPx(top);
  }

  setViewSwitchLabel(labelText) {
    this.controls.viewSwitch.textContent = labelText;
  }

  setPrevButtonDisabled(disabled) {
    this.controls.prevButton.disabled = disabled;
  }

  setNextButtonDisabled(disabled) {
    this.controls.nextButton.disabled = disabled;
  }

  changeView(viewId) {
    const currentView = this.currentView;
    if (viewId !== currentView.id) {
      if (!this._oldView) {
        this._oldView = currentView;
      }
      this.currentView = this.views[viewId];
      this._renderMethod = 'render';
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
  update(viewDate = undefined) {
    const newViewDate = viewDate === undefined
      ? computeResetViewDate(this.datepicker)
      : viewDate;
    this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refresh';
    this.views.forEach((view) => {
      view.updateFocus();
      view.updateSelection();
    });
    return this;
  }

  // Refresh the picker UI
  render(quickRender = true) {
    const {currentView, datepicker, _oldView: oldView} = this;
    const oldViewDate = new Date(this._oldViewDate);
    const renderMethod = (quickRender && this._renderMethod) || 'render';
    delete this._oldView;
    delete this._oldViewDate;
    delete this._renderMethod;

    currentView[renderMethod]();
    if (oldView) {
      this.main.replaceChild(currentView.element, oldView.element);
      triggerDatepickerEvent(datepicker, 'changeView');
    }
    if (!isNaN(oldViewDate)) {
      const newViewDate = new Date(this.viewDate);
      if (newViewDate.getFullYear() !== oldViewDate.getFullYear()) {
        triggerDatepickerEvent(datepicker, 'changeYear');
      }
      if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
        triggerDatepickerEvent(datepicker, 'changeMonth');
      }
    }
  }
}
