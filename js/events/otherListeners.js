import {findElementInEventPath} from '../lib/event.js';
import {unfocus} from './functions.js';

// for the `document` to delegate the events from outside the picker/input field
export function onClickOutside(datepicker, ev) {
  const element = datepicker.element;
  const pickerElem = datepicker.picker.element;

  if (findElementInEventPath(ev, el => el === element || el === pickerElem)) {
    return;
  }
  unfocus(datepicker);
}
