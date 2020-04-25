import {today, addMonths, addYears} from '../lib/date.js';
import {findElementInEventPath} from '../lib/event.js';
import {goToPrevOrNext, switchView} from './functions.js';

function goToSelectedMonthOrYear(datepicker, selection) {
  const picker = datepicker.picker;
  const viewDate = new Date(picker.viewDate);
  const viewId = picker.currentView.id;
  const newDate = viewId === 1
    ? addMonths(viewDate, selection - viewDate.getMonth())
    : addYears(viewDate, selection - viewDate.getFullYear());

  picker.changeFocus(newDate).changeView(viewId - 1).render();
}

export function onClickTodayBtn(datepicker) {
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

export function onClickClearBtn(datepicker) {
  datepicker.setDate({clear: true});
}

export function onClickViewSwitch(datepicker) {
  switchView(datepicker);
}

export function onClickPrevBtn(datepicker) {
  goToPrevOrNext(datepicker, -1);
}

export function onClickNextBtn(datepicker) {
  goToPrevOrNext(datepicker, 1);
}

// For the picker's main block to delegete the events from `datepicker-cell`s
export function onClickView(datepicker, ev) {
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

export function onClickPicker(datepicker, ev) {
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
