import {pushUnique, createTagRepeat} from '../../lib/utils.js';
import {dateValue, regularizeDate, startOfYearPeriod} from '../../lib/date.js';
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
    if ('minDate' in options) {
      if (options.minDate === undefined) {
        this.minYear = this.minDate = undefined;
      } else {
        this.minYear = startOfYearPeriod(options.minDate, this.step);
        this.minDate = dateValue(this.minYear, 0, 1);
      }
    }
    if ('maxDate' in options) {
      if (options.maxDate === undefined) {
        this.maxYear = this.maxDate = undefined;
      } else {
        this.maxYear = startOfYearPeriod(options.maxDate, this.step);
        this.maxDate = dateValue(this.maxYear, 11, 31);
      }
    }
    if (options.checkDisabled) {
      this.checkDisabled = this.isMinView || options.datesDisabled === null
        ? options.checkDisabled
        : () => false;
    }
    if (this.beforeShowOption in options) {
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
    this.focused = startOfYearPeriod(viewDate, this.step);
  }

  // Update view's settings to reflect the selected dates
  updateSelection() {
    const {dates, rangepicker} = this.picker.datepicker;
    this.selected = dates.reduce((years, timeValue) => {
      return pushUnique(years, startOfYearPeriod(timeValue, this.step));
    }, []);
    if (rangepicker && rangepicker.dates) {
      this.range = rangepicker.dates.map(timeValue => {
        if (timeValue !== undefined) {
          return startOfYearPeriod(timeValue, this.step);
        }
      });
    }
  }

  // Update the entire view UI
  render() {
    this.prepareForRender(
      `${this.first}-${this.last}`,
      this.first <= this.minYear,
      this.last >= this.maxYear
    );

    Array.from(this.grid.children).forEach((el, index) => {
      const current = this.start + (index * this.step);
      const date = regularizeDate(new Date(current, 0, 1), 2, this.isRangeEnd);

      el.dataset.year = current;
      this.renderCell(
        el,
        current,
        current,
        date,
        this,
        current < this.minYear || current > this.maxYear
      );
    });
  }

  // Update the view UI by applying the changes of selected and focused items
  refresh() {
    const range = this.range || [];
    Array.from(this.grid.children).forEach((el) => {
      this.refreshCell(el, Number(el.textContent), this.selected, range);
    });
  }

  // Update the view UI by applying the change of focused item
  refreshFocus() {
    this.changeFocusedCell(Math.round((this.focused - this.start) / this.step));
  }
}
