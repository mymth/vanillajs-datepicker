import {isInRange} from '../lib/utils.js';
import {isActiveElement} from '../lib/dom.js';
import {addDays, addMonths, addYears, startOfYearPeriod} from '../lib/date.js';
import {goToPrevOrNext, switchView, unfocus} from './functions.js';

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
function moveByArrowKey(datepicker, direction, vertical) {
  const picker = datepicker.picker;
  const currentView = picker.currentView;
  const step = currentView.step || 1;
  let viewDate = picker.viewDate;
  let addFn;
  let testFn;
  switch (currentView.id) {
    case 0:
      viewDate = addDays(viewDate, vertical ? direction * 7 : direction);
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
    picker.changeFocus(viewDate).render();
  }
}

export function onKeydown(datepicker, ev) {
  const key = ev.key;
  if (key === 'Tab') {
    unfocus(datepicker);
    return;
  }

  const picker = datepicker.picker;
  const {id, isMinView} = picker.currentView;
  const cancelEvent = () => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  const handleArrowNav = (direction, vertical) => {
    moveByArrowKey(datepicker, direction, vertical);
    ev.preventDefault();
  };

  if (!picker.active) {
    if (key === 'ArrowDown' || key === 'Escape') {
      datepicker.show();
      cancelEvent();
    } else if (key === 'Enter') {
      datepicker.update();
    }
  } else {
    if (key === 'Escape') {
      picker.hide();
      cancelEvent();
    } else if (datepicker.editMode) {
      if (key === 'Enter') {
        datepicker.exitEditMode({update: true, autohide: datepicker.config.autohide});
      }
    } else {
      if (key === 'ArrowLeft') {
        if (ev.ctrlKey || ev.metaKey) {
          goToPrevOrNext(datepicker, -1);
          cancelEvent();
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
        } else {
          handleArrowNav(-1, false);
        }
      } else if (key === 'ArrowRight') {
        if (ev.ctrlKey || ev.metaKey) {
          goToPrevOrNext(datepicker, 1);
          cancelEvent();
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
        } else {
          handleArrowNav(1, false);
        }
      } else if (key === 'ArrowUp') {
        if (ev.ctrlKey || ev.metaKey) {
          switchView(datepicker);
          cancelEvent();
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
        } else {
          handleArrowNav(-1, true);
        }
      } else if (key === 'ArrowDown') {
        if (ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
          datepicker.enterEditMode();
        } else {
          handleArrowNav(1, true);
        }
      } else if (key === 'Enter') {
        if (isMinView) {
          datepicker.setDate(picker.viewDate);
        } else {
          picker.changeView(id - 1).render();
          cancelEvent();
        }
      } else if (
        key === 'Backspace'
        || key === 'Delete'
        || (key.length === 1 && !ev.ctrlKey && !ev.metaKey)
      ) {
        datepicker.enterEditMode();
      }
    }
  }
}

export function onFocus(datepicker) {
  if (datepicker.config.showOnFocus && !datepicker._showing) {
    datepicker.show();
  }
}

// for the prevention for entering edit mode while getting focus on click
export function onMousedown(datepicker, ev) {
  const el = ev.target;
  if (datepicker.picker.active || datepicker.config.showOnClick) {
    el._active = isActiveElement(el);
    el._clicking = setTimeout(() => {
      delete el._active;
      delete el._clicking;
    }, 2000);
  }
}

export function onClickInput(datepicker, ev) {
  const el = ev.target;
  if (!el._clicking) {
    return;
  }
  clearTimeout(el._clicking);
  delete el._clicking;

  if (el._active) {
    datepicker.enterEditMode();
  }
  delete el._active;

  if (datepicker.config.showOnClick) {
    datepicker.show();
  }
}

export function onPaste(datepicker, ev) {
  if (ev.clipboardData.types.includes('text/plain')) {
    datepicker.enterEditMode();
  }
}
