describe('options', function () {
  let clock;
  let input;

  beforeEach(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
    clock.restore();
  });

  describe('autohide', function () {
    it('makes the picker hide automatically on selection when true', function () {
      const {dp, picker} = createDP(input, {autohide: true});
      dp.show();

      // by satDate()
      dp.setDate('2/4/2020');
      expect(isVisible(picker), 'to be false');

      dp.show();

      // by click on day cell
      getCells(picker)[25].click();
      expect(isVisible(picker), 'to be false');

      dp.show();

      // by typing enter key in edit mode
      dp.enterEditMode();
      input.value = '2/14/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(isVisible(picker), 'to be false');

      // focus is kept on input field after auto-hidng by clicking day cell
      // (issue #21)
      const spyFocus = sinon.spy(input, 'focus');
      dp.show();

      getCells(picker)[25].click();
      expect(spyFocus.called, 'to be true');

      spyFocus.restore();

      dp.destroy();
      input.value = '';
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({autohide: true});
      dp.show();

      dp.setDate('2/4/2020');
      expect(isVisible(picker), 'to be false');

      dp.setOptions({autohide: false});
      dp.show();

      dp.setDate('2/14/2020');
      expect(isVisible(picker), 'to be true');

      dp.destroy();
      input.value = '';
    });
  });

  describe('buttonClass', function () {
    it('specifies the main class used for the button elements', function () {
      const {dp, picker} = createDP(input, {buttonClass: 'btn'});
      const [viewSwitch, prevBtn, nextBtn, todayBtn, clearBtn] = getParts(picker, [
        '.view-switch',
        '.prev-btn',
        '.next-btn',
        '.today-btn',
        '.clear-btn',
      ]);

      expect(viewSwitch.className, 'to be', 'btn view-switch');
      expect(prevBtn.className, 'to be', 'btn prev-btn');
      expect(nextBtn.className, 'to be', 'btn next-btn');
      expect(todayBtn.className, 'to be', 'btn today-btn');
      expect(clearBtn.className, 'to be', 'btn clear-btn');

      dp.destroy();
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({buttonClass: 'btn'});

      const [viewSwitch, prevBtn, nextBtn, todayBtn, clearBtn] = getParts(picker, [
        '.view-switch',
        '.prev-btn',
        '.next-btn',
        '.today-btn',
        '.clear-btn',
      ]);
      expect(viewSwitch.className, 'to be', 'button view-switch');
      expect(prevBtn.className, 'to be', 'button prev-btn');
      expect(nextBtn.className, 'to be', 'button next-btn');
      expect(todayBtn.className, 'to be', 'button today-btn');
      expect(clearBtn.className, 'to be', 'button clear-btn');

      dp.destroy();
    });
  });

  describe('calendarWeeks', function () {
    const getDisplayedWeeks = (picker) => {
      const calendarWeeks = picker.querySelector('.calendar-weeks');
      return Array.from(calendarWeeks.querySelectorAll('.week')).map(el => el.textContent);
    };

    it('enables display ISO weeks in days view when true', function () {
      const {dp, picker} = createDP(input, {calendarWeeks: true});
      const [viewSwitch, prevBtn] = getParts(picker, ['.view-switch', '.prev-btn']);
      dp.show();

      let calendarWeeks = picker.querySelector('.calendar-weeks');
      expect(isVisible(calendarWeeks), 'to be true');
      expect(getDisplayedWeeks(picker), 'to equal', ['5', '6', '7', '8', '9', '10']);

      prevBtn.click();
      expect(getDisplayedWeeks(picker), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevBtn.click();
      expect(getDisplayedWeeks(picker), 'to equal', ['48', '49', '50', '51', '52', '1']);

      prevBtn.click();
      expect(getDisplayedWeeks(picker), 'to equal', ['44', '45', '46', '47', '48', '49']);

      dp.setDate('01/01/2021');
      expect(getDisplayedWeeks(picker), 'to equal', ['53', '1', '2', '3', '4', '5']);

      prevBtn.click();
      expect(getDisplayedWeeks(picker), 'to equal', ['49', '50', '51', '52', '53', '1']);

      // months view
      viewSwitch.click();
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      // years view
      viewSwitch.click();
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      // decades view
      viewSwitch.click();
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({calendarWeeks: true});
      dp.show();

      expect(isVisible(picker.querySelector('.calendar-weeks')), 'to be true');

      dp.setOptions({calendarWeeks: false});
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      dp.destroy();
    });
  });

  describe('container', function () {
    let foo;

    beforeEach(function () {
      foo = parseHTML('<div id="foo"><div>').firstChild;
      testContainer.appendChild(foo);
    });

    afterEach(function () {
      testContainer.removeChild(foo);
    });

    it('specifies the element to attach the picker', function () {
      const dp = new Datepicker(input, {container: '#foo'});
      expect(document.querySelector('.datepicker').parentElement, 'to be', foo);

      dp.destroy();
    });

    it('cannot be update with setOptions()', function () {
      const dp = new Datepicker(input);
      dp.setOptions({container: '#foo'});

      expect(document.querySelector('.datepicker').parentElement, 'to be', document.body);

      dp.destroy();
    });
  });

  describe('daysOfWeekHighlighted', function () {
    const highlightedCellIndices = (picker) => {
      const cells = getCells(picker);
      return filterCells(cells, '.highlighted').map(el => cells.indexOf(el));
    };
    const highlighted1stWeekIndices = picker => highlightedCellIndices(picker).filter(val => val < 7);

    it('specifies the days of week to highlight by dey numbers', function () {
      const {dp, picker} = createDP(input, {daysOfWeekHighlighted: [1, 5]});
      dp.show();

      expect(highlightedCellIndices(picker), 'to equal', [1, 5, 8, 12, 15, 19, 22, 26, 29, 33, 36, 40]);

      const viewSwitch = getViewSwitch(picker);
      // months view
      viewSwitch.click();
      expect(highlightedCellIndices(picker), 'to equal', []);

      // years view
      viewSwitch.click();
      expect(highlightedCellIndices(picker), 'to equal', []);

      // decades view
      viewSwitch.click();
      expect(highlightedCellIndices(picker), 'to equal', []);

      dp.destroy();
    });

    it('can contain values of 0 - 6 and max 6 items', function () {
      const {dp, picker} = createDP(input, {daysOfWeekHighlighted: [0, -1, 1, 2, 3, 2, 4, 5, 6, 7]});
      dp.show();

      expect(highlighted1stWeekIndices(picker), 'to equal', [0, 1, 2, 3, 4, 5]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({daysOfWeekHighlighted: [6, 0, 3]});
      dp.show();

      expect(highlighted1stWeekIndices(picker), 'to equal', [0, 3, 6]);

      dp.setOptions({daysOfWeekHighlighted: []});
      expect(highlightedCellIndices(picker), 'to equal', []);

      dp.destroy();
    });
  });

  describe('defaultViewDate', function () {
    it('specifies the start view date in the case no selection is made', function () {
      const date = new Date(1984, 0, 24);
      const {dp, picker} = createDP(input, {defaultViewDate: date});
      dp.show();

      expect(getViewSwitch(picker).textContent, 'to be', 'January 1984');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[23]]);
      expect(cells[23].textContent, 'to be', '24');

      dp.setDate('7/4/2020');
      dp.setDate({clear: true});

      expect(getViewSwitch(picker).textContent, 'to be', 'January 1984');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[23]]);
      expect(cells[23].textContent, 'to be', '24');

      picker.querySelector('.prev-btn').click();
      dp.hide();
      dp.show();

      expect(getViewSwitch(picker).textContent, 'to be', 'January 1984');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[23]]);
      expect(cells[23].textContent, 'to be', '24');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.show();

      dp.setOptions({defaultViewDate: new Date(1984, 0, 24)});
      dp.hide();
      dp.show();

      expect(getViewSwitch(picker).textContent, 'to be', 'January 1984');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[23]]);
      expect(cells[23].textContent, 'to be', '24');

      dp.setOptions({defaultViewDate: new Date(2007, 5, 29)});
      dp.setDate('7/4/2020');
      dp.setDate({clear: true});

      expect(getViewSwitch(picker).textContent, 'to be', 'June 2007');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[33]]);
      expect(cells[33].textContent, 'to be', '29');

      dp.destroy();
    });
  });

  describe('disableTouchKeyboard', function () {
    const ontouchstartSupported = 'ontouchstart' in document;

    before(function () {
      if (!ontouchstartSupported) {
        document.ontouchstart = null;
      }
    });

    after(function () {
      if (!ontouchstartSupported) {
        delete document.ontouchstart;
      }
    });

    it('unfocuses the input after showing the picker', function () {
      const dp = new Datepicker(input, {disableTouchKeyboard: true});
      input.focus();

      expect(document.activeElement, 'not to be', input);

      dp.destroy();
    });

    it('prevents the input from getting focus after an eleent in the picker is clicked', function () {
      const {dp, picker} = createDP(input, {disableTouchKeyboard: true});
      const [viewSwitch, prevBtn] = getParts(picker, ['.view-switch', '.prev-btn']);
      dp.show();

      prevBtn.focus();
      simulant.fire(prevBtn, 'click');
      expect(document.activeElement, 'not to be', input);

      simulant.fire(getCells(picker)[15], 'click');
      expect(document.activeElement, 'not to be', input);

      viewSwitch.focus();
      simulant.fire(viewSwitch, 'click');
      expect(document.activeElement, 'not to be', input);

      simulant.fire(getCells(picker)[6], 'click');
      expect(document.activeElement, 'not to be', input);

      dp.destroy();
    });

    it('is ignored if the browser does not support document.ontouchstart', function () {
      if (ontouchstartSupported) {
        return;
      }
      delete document.ontouchstart;

      const {dp, picker} = createDP(input, {disableTouchKeyboard: true});
      const [viewSwitch, prevBtn] = getParts(picker, ['.view-switch', '.prev-btn']);
      input.focus();

      expect(document.activeElement, 'to be', input);

      prevBtn.focus();
      simulant.fire(prevBtn, 'click');
      expect(document.activeElement, 'to be', input);

      prevBtn.focus();
      simulant.fire(getCells(picker)[15], 'click');
      expect(document.activeElement, 'to be', input);

      viewSwitch.focus();
      simulant.fire(viewSwitch, 'click');
      expect(document.activeElement, 'to be', input);

      viewSwitch.focus();
      simulant.fire(getCells(picker)[6], 'click');
      expect(document.activeElement, 'to be', input);

      dp.destroy();
      document.ontouchstart = null;
    });

    it('can be updated with setOptions()', function () {
      const dp = new Datepicker(input);
      dp.setOptions({disableTouchKeyboard: true});
      input.focus();

      expect(document.activeElement, 'not to be', input);

      dp.hide();
      dp.setOptions({disableTouchKeyboard: false});
      input.focus();

      expect(document.activeElement, 'to be', input);

      dp.destroy();
    });
  });

  describe('nextArrow', function () {
    it('specifies the label of the next button in HTML (or plain text)', function () {
      const html = '<i class="icn icn-arrow-right"></i>';
      const {dp, picker} = createDP(input, {nextArrow: html});
      const nextBtn = picker.querySelector('.next-btn');
      dp.show();

      expect(nextBtn.innerHTML, 'to be', html);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const nextBtn = picker.querySelector('.next-btn');
      dp.setOptions({nextArrow: 'N'});
      dp.show();

      expect(nextBtn.textContent, 'to be', 'N');

      dp.setOptions({nextArrow: '>'});
      expect(nextBtn.textContent, 'to be', '>');

      dp.destroy();
    });
  });

  describe('prevArrow', function () {
    it('specifies the label of the next button in HTML (or plain text)', function () {
      const html = '<i class="icn icn-arrow-left"></i>';
      const {dp, picker} = createDP(input, {prevArrow: html});
      const prevBtn = picker.querySelector('.prev-btn');
      dp.show();

      expect(prevBtn.innerHTML, 'to be', html);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const prevBtn = picker.querySelector('.prev-btn');
      dp.setOptions({prevArrow: 'P'});
      dp.show();

      expect(prevBtn.textContent, 'to be', 'P');

      dp.setOptions({prevArrow: '<'});
      expect(prevBtn.textContent, 'to be', '<');

      dp.destroy();
    });
  });

  describe('showDaysOfWeek', function () {
    it('hides day names of week when false', function () {
      const {dp, picker} = createDP(input, {showDaysOfWeek: false});
      dp.show();

      expect(isVisible(picker.querySelector('.days-of-week')), 'to be false');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({showDaysOfWeek: false});
      dp.show();

      expect(isVisible(picker.querySelector('.days-of-week')), 'to be false');

      dp.setOptions({showDaysOfWeek: true});
      expect(isVisible(picker.querySelector('.days-of-week')), 'to be true');

      dp.destroy();
    });
  });

  describe('showOnClick', function () {
    it('disables the picker to auto-open on clicking input when false', function () {
      const {dp, picker} = createDP(input, {showOnClick: false});
      input.focus();
      dp.hide();

      simulant.fire(input, 'mousedown');
      input.click();
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({showOnClick: false});
      input.focus();
      dp.hide();
      simulant.fire(input, 'mousedown');
      input.click();

      expect(isVisible(picker), 'to be false');

      dp.setOptions({showOnClick: true});
      simulant.fire(input, 'mousedown');
      input.click();

      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });
  });

  describe('showOnFocus', function () {
    it('disables the picker to auto-open on focus when false', function () {
      const {dp, picker} = createDP(input, {showOnFocus: false});
      input.focus();

      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({showOnFocus: false});
      input.focus();

      expect(isVisible(picker), 'to be false');

      input.blur();
      dp.setOptions({showOnFocus: true});
      input.focus();

      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });
  });

  describe('title', function () {
    it('specifies the title of the picker and shows it when not empty', function () {
      const {dp, picker} = createDP(input, {title: 'Foo Bar'});
      const title = picker.querySelector('.datepicker-title');
      dp.show();

      expect(title.textContent, 'to be', 'Foo Bar');
      expect(isVisible(title), 'to be true');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const title = picker.querySelector('.datepicker-title');
      dp.setOptions({title: 'My Datepicker'});
      dp.show();

      expect(title.textContent, 'to be', 'My Datepicker');
      expect(isVisible(title), 'to be true');

      dp.setOptions({title: ''});
      expect(title.textContent, 'to be', '');
      expect(isVisible(title), 'to be false');

      dp.destroy();
    });
  });

  describe('todayHighlight', function () {
    it('highlights the current date in days view when true', function () {
      const {dp, picker} = createDP(input, {todayHighlight: true});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      let cells = getCells(picker);
      expect(filterCells(cells, '.today'), 'to equal', [cells[19]]);

      picker.querySelector('.prev-btn').click();
      expect(filterCells(getCells(picker), '.today'), 'to equal', []);

      picker.querySelector('.next-btn').click();
      viewSwitch.click();
      expect(filterCells(getCells(picker), '.today'), 'to equal', []);

      viewSwitch.click();
      expect(filterCells(getCells(picker), '.today'), 'to equal', []);

      viewSwitch.click();
      expect(filterCells(getCells(picker), '.today'), 'to equal', []);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({todayHighlight: true});
      dp.show();

      let cells = getCells(picker);
      expect(filterCells(cells, '.today'), 'to equal', [cells[19]]);

      dp.setOptions({todayHighlight: false});

      cells = getCells(picker);
      expect(filterCells(cells, '.today'), 'to equal', []);

      dp.destroy();
    });
  });

  describe('updateOnBlur', function () {
    it('discards unparsed input on losing focus when false', function () {
      const outsider = document.createElement('p');
      testContainer.appendChild(outsider);

      const {dp, picker} = createDP(input, {updateOnBlur: false});
      input.focus();
      input.value = 'foo';

      // on tab key press
      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(input.value, 'to be', '');

      dp.setDate('04/22/2020');
      dp.show();
      dp.enterEditMode();
      input.value = 'foo';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(input.value, 'to be', '04/22/2020');

      // on click outside
      dp.show();
      input.value = 'foo';

      simulant.fire(picker.querySelector('.dow'), 'mousedown');
      expect(input.value, 'to be', 'foo');

      simulant.fire(input, 'mousedown');
      expect(input.value, 'to be', 'foo');

      simulant.fire(outsider, 'mousedown');
      expect(input.value, 'to be', '04/22/2020');

      dp.setDate({clear: true});
      input.value = 'foo';

      simulant.fire(outsider, 'mousedown');
      expect(input.value, 'to be', '');

      dp.destroy();
      testContainer.removeChild(outsider);
    });

    it('can be updated with setOptions()', function () {
      const dp = new Datepicker(input);
      dp.setOptions({updateOnBlur: false});
      input.focus();
      input.value = '04/22/2020';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(input.value, 'to be', '');

      dp.setOptions({updateOnBlur: true});
      input.focus();
      input.value = '04/22/2020';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(input.value, 'to be', '04/22/2020');

      dp.destroy();
    });
  });

  describe('weekStart', function () {
    const getDayNames = (picker) => {
      const daysOfWeek = picker.querySelector('.days-of-week');
      return Array.from(daysOfWeek.children).map(el => el.textContent);
    };
    const getDatesInColumn = (picker, colIndex) => {
      const cells = getCells(picker);
      return cells.reduce((dates, el, ix) => {
        if (ix % 7 === colIndex) {
          dates.push(el.textContent);
        }
        return dates;
      }, []);
    };

    it('specifies the day of week to display in the first column', function () {
      const {dp, picker} = createDP(input, {weekStart: 1});
      dp.show();

      expect(getDayNames(picker), 'to equal', ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
      expect(getDatesInColumn(picker, 0), 'to equal', ['27', '3', '10', '17', '24', '2']);
      expect(getDatesInColumn(picker, 6), 'to equal', ['2', '9', '16', '23', '1', '8']);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({weekStart: 4});
      dp.show();

      expect(getDayNames(picker), 'to equal', ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We']);
      expect(getDatesInColumn(picker, 0), 'to equal', ['30', '6', '13', '20', '27', '5']);
      expect(getDatesInColumn(picker, 6), 'to equal', ['5', '12', '19', '26', '4', '11']);

      dp.setOptions({weekStart: 0});

      expect(getDayNames(picker), 'to equal', ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
      expect(getDatesInColumn(picker, 0), 'to equal', ['26', '2', '9', '16', '23', '1']);
      expect(getDatesInColumn(picker, 6), 'to equal', ['1', '8', '15', '22', '29', '7']);

      dp.destroy();
    });
  });
});
