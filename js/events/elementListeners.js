import {isInRange} from '../lib/utils.js';
import {isActiveElement} from '../lib/dom.js';
import {addDays, addMonths, addYears} from '../lib/date.js';
import {
  goToPrevOrNext,
  switchView,
  clearSelection,
  goToOrSelectToday,
  unfocus,
} from './functions.js';

// Find the closest date that doesn't meet the condition for unavailable date
// Returns undefined if no available date is found
// addFn: function to calculate the next date
//   - args: time value, amount
// increase: amount to pass to addFn
// testFn: function to test the unavailability of the date
//   - args: time value; return: true if unavailable
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
  switch (currentView.id) {
    case 0:
      viewDate = addDays(viewDate, vertical ? direction * 7 : direction);
      addFn = addDays;
      break;
    case 1:
      viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
      addFn = addMonths;
      break;
    default:
      viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
      addFn = addYears;
  }
  viewDate = findNextAvailableOne(
    viewDate,
    addFn,
    direction < 0 ? -step : step,
    (date) => currentView.disabled.includes(date),
    currentView.minDate,
    currentView.maxDate
  );
  if (viewDate !== undefined) {
    picker.changeFocus(viewDate).render();
  }
}

export function onKeydown(datepicker, ev) {
  const {config, picker, editMode} = datepicker;
  const active = picker.active;
  const {key, altKey, shiftKey} = ev;
  const ctrlOrMetaKey = ev.ctrlKey || ev.metaKey;
  const cancelEvent = () => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  // tab/enter keys should not be taken by shortcut keys
  if (key === 'Tab') {
    unfocus(datepicker);
    return;
  }
  if (key === 'Enter') {
    if (!active) {
      datepicker.update();
    } else if (editMode) {
      datepicker.exitEditMode({update: true, autohide: config.autohide});
    } else {
      const currentView = picker.currentView;
      if (currentView.isMinView) {
        datepicker.setDate(picker.viewDate);
      } else {
        picker.changeView(currentView.id - 1).render();
        cancelEvent();
      }
    }
    return;
  }

  const shortcutKeys = config.shortcutKeys;
  const keyInfo = {key, ctrlOrMetaKey, altKey, shiftKey};
  const shortcut = Object.keys(shortcutKeys).find((item) => {
    const keyDef = shortcutKeys[item];
    return !Object.keys(keyDef).find(prop => keyDef[prop] !== keyInfo[prop]);
  });
  if (shortcut) {
    let action;
    if (shortcut === 'toggle') {
      action = shortcut;
    } else if (editMode) {
      if (shortcut === 'exitEditMode') {
        action = shortcut;
      }
    } else if (active) {
      if (shortcut === 'hide') {
        action = shortcut;
      } else if (shortcut === 'prevButton') {
        action = [goToPrevOrNext, [datepicker, -1]];
      } else if (shortcut === 'nextButton') {
        action = [goToPrevOrNext, [datepicker, 1]];
      } else if (shortcut === 'viewSwitch') {
        action = [switchView, [datepicker]];
      } else if (config.clearButton && shortcut === 'clearButton') {
        action = [clearSelection, [datepicker]];
      } else if (config.todayButton && shortcut === 'todayButton') {
        action = [goToOrSelectToday, [datepicker]];
      }
    } else if (shortcut === 'show') {
      action = shortcut;
    }
    if (action) {
      if (Array.isArray(action)) {
        action[0].apply(null, action[1]);
      } else {
        datepicker[action]();
      }
      cancelEvent();
      return;
    }
  }

  // perform as a regular <input> when picker in hidden or in edit mode
  if (!active || editMode) {
    return;
  }

  const handleArrowKeyPress = (direction, vertical) => {
    if (shiftKey || ctrlOrMetaKey || altKey) {
      datepicker.enterEditMode();
    } else {
      moveByArrowKey(datepicker, direction, vertical);
      ev.preventDefault();
    }
  };

  if (key === 'ArrowLeft') {
    handleArrowKeyPress(-1, false);
  } else if (key === 'ArrowRight') {
    handleArrowKeyPress(1, false);
  } else if (key === 'ArrowUp') {
    handleArrowKeyPress(-1, true);
  } else if (key === 'ArrowDown') {
    handleArrowKeyPress(1, true);
  } else if (
    key === 'Backspace'
    || key === 'Delete'
      // When autofill is performed, Chromium-based browsers trigger fake
      // keydown/keyup events that don't have the `key` property (on Edge,
      // keyup only) in addition to the input event. Therefore, we need to
      // check the existence of `key`'s value before checking the length.
      // (issue #144)
    || (key && key.length === 1 && !ctrlOrMetaKey)
  ) {
    datepicker.enterEditMode();
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
