import {addMonths, addYears} from '../lib/date.js';
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

export function onClickViewSwitch(datepicker) {
  switchView(datepicker);
}

export function onClickPrevButton(datepicker) {
  goToPrevOrNext(datepicker, -1);
}

export function onClickNextButton(datepicker) {
  goToPrevOrNext(datepicker, 1);
}

// For the picker's main block to delegete the events from `datepicker-cell`s
export function onClickView(datepicker, ev) {
  const target = findElementInEventPath(ev, '.datepicker-cell');
  if (!target || target.classList.contains('disabled')) {
    return;
  }

  const {id, isMinView} = datepicker.picker.currentView;
  const data = target.dataset;
  if (isMinView) {
    datepicker.setDate(Number(data.date));
  } else if (id === 1) {
    goToSelectedMonthOrYear(datepicker, Number(data.month));
  } else {
    goToSelectedMonthOrYear(datepicker, Number(data.year));
  }
}

export function onMousedownPicker(ev) {
  ev.preventDefault();
}
