import {pushUnique} from '../../lib/utils.js';
import {parseHTML, replaceChildNodes} from '../../lib/dom.js';

// Base class of the view classes
export default class View {
  constructor(picker, config) {
    Object.assign(this, config, {
      picker,
      element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
      selected: [],
      isRangeEnd: !!picker.datepicker.rangeSideIndex,
    });
    this.init(this.picker.datepicker.config);
  }

  init(options) {
    if ('pickLevel' in options) {
      this.isMinView = this.id === options.pickLevel;
    }
    this.setOptions(options);
    this.updateFocus();
    this.updateSelection();
  }

  prepareForRender(switchLabel, prevButtonDisabled, nextButtonDisabled) {
    // refresh disabled years on every render in order to clear the ones added
    // by beforeShow hook at previous render
    this.disabled = [];

    const picker = this.picker;
    picker.setViewSwitchLabel(switchLabel);
    picker.setPrevButtonDisabled(prevButtonDisabled);
    picker.setNextButtonDisabled(nextButtonDisabled);
  }

  setDisabled(date, classList) {
    classList.add('disabled');
    pushUnique(this.disabled, date);
  }

  // Execute beforeShow() callback and apply the result to the element
  // args:
  performBeforeHook(el, timeValue) {
    let result = this.beforeShow(new Date(timeValue));
    switch (typeof result) {
      case 'boolean':
        result = {enabled: result};
        break;
      case 'string':
        result = {classes: result};
    }

    if (result) {
      const classList = el.classList;
      if (result.enabled === false) {
        this.setDisabled(timeValue, classList);
      }
      if (result.classes) {
        const extraClasses = result.classes.split(/\s+/);
        classList.add(...extraClasses);
        if (extraClasses.includes('disabled')) {
          this.setDisabled(timeValue, classList);
        }
      }
      if (result.content) {
        replaceChildNodes(el, result.content);
      }
    }
  }

  renderCell(el, content, cellVal, date, {selected, range}, outOfScope, extraClasses = []) {
    el.textContent = content;
    if (this.isMinView) {
      el.dataset.date = date;
    }

    const classList = el.classList;
    el.className = `datepicker-cell ${this.cellClass}`;
    if (cellVal < this.first) {
      classList.add('prev');
    } else if (cellVal > this.last) {
      classList.add('next');
    }
    classList.add(...extraClasses);
    if (outOfScope || this.checkDisabled(date, this.id)) {
      this.setDisabled(date, classList);
    }
    if (range) {
      const [rangeStart, rangeEnd] = range;
      if (cellVal > rangeStart && cellVal < rangeEnd) {
        classList.add('range');
      }
      if (cellVal === rangeStart) {
        classList.add('range-start');
      }
      if (cellVal === rangeEnd) {
        classList.add('range-end');
      }
    }
    if (selected.includes(cellVal)) {
      classList.add('selected');
    }
    if (cellVal === this.focused) {
      classList.add('focused');
    }

    if (this.beforeShow) {
      this.performBeforeHook(el, date);
    }
  }

  refreshCell(el, cellVal, selected, [rangeStart, rangeEnd]) {
    const classList = el.classList;
    classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
    if (cellVal > rangeStart && cellVal < rangeEnd) {
      classList.add('range');
    }
    if (cellVal === rangeStart) {
      classList.add('range-start');
    }
    if (cellVal === rangeEnd) {
      classList.add('range-end');
    }
    if (selected.includes(cellVal)) {
      classList.add('selected');
    }
    if (cellVal === this.focused) {
      classList.add('focused');
    }
  }

  changeFocusedCell(cellIndex) {
    this.grid.querySelectorAll('.focused').forEach((el) => {
      el.classList.remove('focused');
    });
    this.grid.children[cellIndex].classList.add('focused');
  }
}
