import {hasProperty, pushUnique, createTagRepeat} from '../../lib/utils.js';
import {dateValue, startOfYearPeriod} from '../../lib/date.js';
import {parseHTML} from '../../lib/dom.js';
import View from './View.js';

function toTitleCase(word) {
  return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), '');
}

// Class representing the years and decades view elements
export default class YearsView extends View {
  constructor(picker, config) {
    super(picker, config);
  }

  init(options, onConstruction = true) {
    if (onConstruction) {
      this.navStep = this.step * 10;
      this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
      this.grid = this.element;
      this.element.classList.add(this.name, 'datepicker-grid');
      this.grid.appendChild(parseHTML(createTagRepeat('span', 12)));
    }
    super.init(options);
  }

  setOptions(options) {
    if (hasProperty(options, 'minDate')) {
      if (options.minDate === undefined) {
        this.minYear = this.minDate = undefined;
      } else {
        this.minYear = startOfYearPeriod(options.minDate, this.step);
        this.minDate = dateValue(this.minYear, 0, 1);
      }
    }
    if (hasProperty(options, 'maxDate')) {
      if (options.maxDate === undefined) {
        this.maxYear = this.maxDate = undefined;
      } else {
        this.maxYear = startOfYearPeriod(options.maxDate, this.step);
        this.maxDate = dateValue(this.maxYear, 11, 31);
      }
    }
    if (options[this.beforeShowOption] !== undefined) {
      const beforeShow = options[this.beforeShowOption];
      this.beforeShow = typeof beforeShow === 'function' ? beforeShow : undefined;
    }
  }

  // Update view's settings to reflect the viewDate set on the picker
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    const first = startOfYearPeriod(viewDate, this.navStep);
    const last = first + 9 * this.step;

    this.first = first;
    this.last = last;
    this.start = first - this.step;
    this.switchLabel = `${first}-${last}`;
    this.focused = startOfYearPeriod(viewDate, this.step);
  }

  // Update view's settings to reflect the selected dates
  updateSelection() {
    this.selected = this.picker.datepicker.dates.reduce((years, timeValue) => {
      return pushUnique(years, startOfYearPeriod(timeValue, this.step));
    }, []);
  }

  // Update the entire view UI
  render() {
    // refresh disabled years on every render in order to clear the ones added
    // by beforeShow hook at previous render
    this.disabled = [];

    this.picker.setViewSwitchLabel(this.switchLabel);
    this.picker.setPrevBtnDisabled(this.first <= this.minYear);
    this.picker.setNextBtnDisabled(this.last >= this.maxYear);

    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      const current = this.start + (index * this.step);

      el.className = `datepicker-cell ${this.cellClass}`;
      el.textContent = el.dataset.year = current;

      if (index === 0) {
        classList.add('prev');
      } else if (index === 11) {
        classList.add('next');
      }
      if (current < this.minYear || current > this.maxYear) {
        classList.add('disabled');
      }
      if (this.selected.includes(current)) {
        classList.add('selected');
      }
      if (current === this.focused) {
        classList.add('focused');
      }

      if (this.beforeShow) {
        this.performBeforeHook(el, current, dateValue(current, 0, 1));
      }
    });
  }

  // Update the view UI by applying the changes of selected and focused items
  refresh() {
    this.grid.querySelectorAll('.selected, .focused').forEach((el) => {
      el.classList.remove('selected', 'focused');
    });
    Array.from(this.grid.children).forEach((el) => {
      const current = Number(el.textContent);
      const classList = el.classList;
      if (this.selected.includes(current)) {
        classList.add('selected');
      }
      if (current === this.focused) {
        classList.add('focused');
      }
    });
  }

  // Update the view UI by applying the change of focused item
  refreshFocus() {
    const index = Math.round((this.focused - this.start) / this.step);
    this.grid.querySelectorAll('.focused').forEach((el) => {
      el.classList.remove('focused');
    });
    this.grid.children[index].classList.add('focused');
  }
}
