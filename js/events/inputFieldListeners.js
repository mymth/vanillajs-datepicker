import {isInRange} from '../lib/utils.js';
import {addDays, addMonths, addYears, startOfYearPeriod} from '../lib/date.js';
import {goToPrevOrNext, switchView} from './functions.js';

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

export function onKeydown(datepicker, ev) {
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

export function onFocus(datepicker) {
  if (datepicker.config.showOnFocus) {
    datepicker.show();
  }
}

// for the prevention for entering edit mode while getting focus on click
export function onMousedown(datepicker, ev) {
  const el = ev.target;
  if (datepicker.picker.active) {
    el._clicking = setTimeout(() => {
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

  datepicker.enterEditMode();
}

export function onPaste(datepicker, ev) {
  if (ev.clipboardData.types.includes('text/plain')) {
    datepicker.enterEditMode();
  }
}
