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
  const {config, picker} = datepicker;
  const currentDate = today();
  if (config.todayBtnMode === 1) {
    datepicker.setDate(currentDate, {forceRefresh: true, viewDate: currentDate});
  } else {
    if (picker.viewDate !== currentDate) {
      picker.changeFocus(currentDate);
    }
    picker.changeView(config.pickLevel).render();
  }
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

  const {id, isMinView} = datepicker.picker.currentView;
  const {date, month, year} = target.dataset;
  if (isMinView) {
    datepicker.setDate(Number(date));
  } else if (id === 1) {
    goToSelectedMonthOrYear(datepicker, Number(month));
  } else {
    goToSelectedMonthOrYear(datepicker, Number(year));
  }
}

export function onMousedownPicker(ev) {
  ev.preventDefault();
}
