describe('options - buttons', function () {
  let clock;
  let input;

  beforeEach(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    if (input.datepicker) {
      input.datepicker.destroy();
    }
    testContainer.removeChild(input);
    clock.restore();
  });

  describe('clearButton', function () {
    it('displays a button to clear the selection when true', function () {
      const {dp, picker} = createDP(input, {clearButton: true});
      const [viewSwitch, clearButton] = getParts(picker, ['.view-switch', '.clear-button']);
      dp.show();

      expect(isVisible(clearButton), 'to be true');
      expect(clearButton.textContent, 'to be', 'Clear');

      // months view
      viewSwitch.click();
      expect(isVisible(clearButton), 'to be true');

      // years view
      viewSwitch.click();
      expect(isVisible(clearButton), 'to be true');

      // decades view
      viewSwitch.click();
      expect(isVisible(clearButton), 'to be true');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({clearButton: true});
      dp.show();

      const clearButton = picker.querySelector('.clear-button');
      expect(isVisible(clearButton), 'to be true');

      dp.setOptions({clearButton: false});
      expect(isVisible(clearButton), 'to be false');

      dp.destroy();
    });

    describe('clear button', function () {
      let dp;
      let picker;
      let clearButton;

      beforeEach(function () {
        ({dp, picker} = createDP(input, {clearButton: true}));
        clearButton = picker.querySelector('.clear-button');
        dp.show();
      });

      afterEach(function () {
        dp.destroy();
      });

      it('clears the selection', function () {
        dp.setDate('2/14/2020');
        clearButton.click();

        expect(dp.dates, 'to equal', []);
        expect(input.value, 'to be', '');

        const viewSwitch = getViewSwitch(picker);
        // months view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        clearButton.click();
        expect(dp.dates, 'to equal', []);
        // goes back to the days view
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // years view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        viewSwitch.click();
        clearButton.click();
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // decades view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        viewSwitch.click();
        viewSwitch.click();
        clearButton.click();
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
      });

      it('hides the picker as well when autohide = true', function () {
        dp.setDate('2/14/2020');
        dp.setOptions({autohide: true});
        clearButton.click();

        expect(isVisible(picker), 'to be false');
      });

      it('has shortcut key: ctrl/meta + backspace', function () {
        dp.setDate('2/14/2020');
        simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});

        expect(dp.dates, 'to equal', []);
        expect(input.value, 'to be', '');

        dp.setDate('2/14/2020');
        simulant.fire(input, 'keydown', {key: 'Backspace', metaKey: true});

        expect(dp.dates, 'to equal', []);

        const viewSwitch = getViewSwitch(picker);
        // months view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        dp.setDate('2/14/2020');
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: 'Backspace', metaKey: true});
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // years view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        dp.setDate('2/14/2020');
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: 'Backspace', metaKey: true});
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // decades view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        dp.setDate('2/14/2020');
        viewSwitch.click();
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: 'Backspace', metaKey: true});
        expect(dp.dates, 'to equal', []);
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // shortcut key doesn't work when clear button is disabled
        dp.setOptions({clearButton: false});
        dp.setDate('2/14/2020');
        simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
        expect(input.value, 'to be', '02/14/2020');

        simulant.fire(input, 'keydown', {key: 'Backspace', metaKey: true});
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
        expect(input.value, 'to be', '02/14/2020');
      });
    });
  });

  describe('clearBtn', function () {
    it('is a synonym of clearButton', function () {
      const {dp, picker} = createDP(input, {clearBtn: true});
      const [viewSwitch, clearButton] = getParts(picker, ['.view-switch', '.clear-button']);
      dp.show();

      expect(isVisible(clearButton), 'to be true');
      expect(clearButton.textContent, 'to be', 'Clear');

      // months view
      viewSwitch.click();
      expect(isVisible(clearButton), 'to be true');

      // years view
      viewSwitch.click();
      expect(isVisible(clearButton), 'to be true');

      // decades view
      viewSwitch.click();
      expect(isVisible(clearButton), 'to be true');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({clearBtn: true});
      dp.show();

      const clearButton = picker.querySelector('.clear-button');
      expect(isVisible(clearButton), 'to be true');

      dp.setOptions({clearBtn: false});
      expect(isVisible(clearButton), 'to be false');

      dp.destroy();
    });
  });

  describe('todayButton', function () {
    it('displays a button to change the view date to current date when true', function () {
      const {dp, picker} = createDP(input, {todayButton: true});
      const [viewSwitch, todayButton] = getParts(picker, ['.view-switch', '.today-button']);
      dp.show();

      expect(isVisible(todayButton), 'to be true');
      expect(todayButton.textContent, 'to be', 'Today');

      // months view
      viewSwitch.click();
      expect(isVisible(todayButton), 'to be true');

      // years view
      viewSwitch.click();
      expect(isVisible(todayButton), 'to be true');

      // decades view
      viewSwitch.click();
      expect(isVisible(todayButton), 'to be true');

      dp.destroy();
    });

    it('is disabled if the current date is out of the range of minDate/maxDate', function () {
      const {dp, picker} = createDP(input, {todayButton: true});
      const todayButton = picker.querySelector('.today-button');
      dp.show();

      expect(todayButton.disabled, 'to be false');

      dp.setOptions({minDate: '2/20/2020'});
      expect(todayButton.disabled, 'to be true');

      dp.setOptions({minDate: null, maxDate: '2/10/2020'});
      expect(todayButton.disabled, 'to be true');

      dp.setOptions({minDate: '2/1/2020', maxDate: '2/29/2020'});
      expect(todayButton.disabled, 'to be false');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({todayButton: true});
      dp.show();

      const todayButton = picker.querySelector('.today-button');
      expect(isVisible(todayButton), 'to be true');

      dp.setOptions({todayButton: false});
      expect(isVisible(todayButton), 'to be false');

      dp.setOptions({todayButton: 'true'});
      expect(isVisible(todayButton), 'to be true');

      dp.destroy();
    });
  });

  describe('todayBtn', function () {
    it('is a synonym of todayButton', function () {
      const {dp, picker} = createDP(input, {todayBtn: true});
      const [viewSwitch, todayButton] = getParts(picker, ['.view-switch', '.today-button']);
      dp.show();

      expect(isVisible(todayButton), 'to be true');
      expect(todayButton.textContent, 'to be', 'Today');

      // months view
      viewSwitch.click();
      expect(isVisible(todayButton), 'to be true');

      // years view
      viewSwitch.click();
      expect(isVisible(todayButton), 'to be true');

      // decades view
      viewSwitch.click();
      expect(isVisible(todayButton), 'to be true');

      // disabled if the current date is out of the range of minDate/maxDate', function () {
      expect(todayButton.disabled, 'to be false');

      dp.setOptions({minDate: '2/20/2020'});
      expect(todayButton.disabled, 'to be true');

      dp.setOptions({minDate: null, maxDate: '2/10/2020'});
      expect(todayButton.disabled, 'to be true');

      dp.setOptions({minDate: '2/1/2020', maxDate: '2/29/2020'});
      expect(todayButton.disabled, 'to be false');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({todayBtn: true});
      dp.show();

      const todayButton = picker.querySelector('.today-button');
      expect(isVisible(todayButton), 'to be true');

      dp.setOptions({todayBtn: false});
      expect(isVisible(todayButton), 'to be false');

      dp.setOptions({todayBtn: 'true'});
      expect(isVisible(todayButton), 'to be true');

      dp.destroy();
    });
  });

  describe('todayButtonMode', function () {
    let dp;
    let picker;
    let viewSwitch;
    let todayButton;
    let cells;

    beforeEach(function () {
      ({dp, picker} = createDP(input, {todayButton: true}));
      [viewSwitch, todayButton] = getParts(picker, ['.view-switch', '.today-button']);
      dp.show();
    });

    afterEach(function () {
      dp.destroy();
    });

    it('specifies the behavior of the today buton', function () {
      const date = dateValue(2020, 1, 11);

      // defualt to 0: focus-on (change view date)
      dp.setDate(date);
      todayButton.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[16].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [date]);

      dp.destroy();

      // 1: select (change the selection)
      ({dp, picker} = createDP(input, {todayButton: true, todayButtonMode: 1}));
      todayButton = picker.querySelector('.today-button');
      dp.setDate(date);
      dp.show();
      todayButton.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[19].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
    });

    it('can be updated with setOptions()', function () {
      const date = dateValue(2020, 1, 11);

      dp.setDate(date);
      dp.setOptions({todayButtonMode: 1});
      todayButton.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[19].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

      dp.setDate(date);
      dp.setOptions({todayButtonMode: 0});
      todayButton.click();

      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[16].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [date]);
    });

    describe('today button', function () {
      it('changes the view date to the current date when todayButtonMode = 0', function () {
        dp.setDate('4/22/2020');
        todayButton.click();

        expect(viewSwitch.textContent, 'to be', 'February 2020');

        cells = getCells(picker);
        expect(cells[19].textContent, 'to be', '14');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells.find(el => el.classList.contains('selected')), 'to be undefined');

        expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
        expect(input.value, 'to be', '04/22/2020');

        dp.setDate({clear: true});

        // pickLevel = 1
        dp.setOptions({pickLevel: 1});
        dp.setDate('4/22/2020');
        todayButton.click();

        expect(viewSwitch.textContent, 'to be', '2020');

        cells = getCells(picker);
        expect(cells[1].textContent, 'to be', 'Feb');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[3].classList.contains('selected'), 'to be true');

        expect(dp.dates, 'to equal', [dateValue(2020, 3, 1)]);
        expect(input.value, 'to be', '04/01/2020');

        dp.setDate({clear: true});

        // pickLevel = 2
        dp.setOptions({pickLevel: 2});
        dp.setDate('4/22/2022');
        todayButton.click();

        expect(viewSwitch.textContent, 'to be', '2020-2029');

        cells = getCells(picker);
        expect(cells[1].textContent, 'to be', '2020');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[3].classList.contains('selected'), 'to be true');

        expect(dp.dates, 'to equal', [dateValue(2022, 0, 1)]);
        expect(input.value, 'to be', '01/01/2022');

        dp.setDate({clear: true});
      });

      it('also changes the view to pickLevel\'s view when todayButtonMode = 0', function () {
        // months view
        dp.setDate('4/22/2020');
        viewSwitch.click();
        todayButton.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // years view
        dp.setDate({clear: true});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        todayButton.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // decades view
        dp.setDate({clear: true});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        viewSwitch.click();
        todayButton.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        dp.setDate({clear: true});

        // pickLevel = 1
        dp.setOptions({pickLevel: 1});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        todayButton.click();
        expect(viewSwitch.textContent, 'to be', '2020');

        dp.setDate({clear: true});

        // pickLevel = 2
        dp.setOptions({pickLevel: 2});
        dp.setDate('4/22/2022');
        viewSwitch.click();
        todayButton.click();
        expect(viewSwitch.textContent, 'to be', '2020-2029');

        dp.setDate({clear: true});
      });

      it('changes the selection to the current date when todayButtonMode = 1', function () {
        dp.setOptions({todayButtonMode: 1});
        dp.setDate('4/22/2020');
        todayButton.click();

        expect(viewSwitch.textContent, 'to be', 'February 2020');

        cells = getCells(picker);
        expect(cells[19].textContent, 'to be', '14');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');

        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        expect(input.value, 'to be', '02/14/2020');
        dp.setDate({clear: true});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        todayButton.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        dp.setDate({clear: true});

        // pickLevel = 1
        dp.setOptions({pickLevel: 1});
        dp.setDate('4/22/2020');
        todayButton.click();

        expect(viewSwitch.textContent, 'to be', '2020');

        cells = getCells(picker);
        expect(cells[1].textContent, 'to be', 'Feb');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[1].classList.contains('selected'), 'to be true');

        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);
        expect(input.value, 'to be', '02/01/2020');

        dp.setDate({clear: true});

        // pickLevel = 2
        dp.setOptions({pickLevel: 2});
        dp.setDate('4/22/2022');
        todayButton.click();

        expect(viewSwitch.textContent, 'to be', '2020-2029');

        cells = getCells(picker);
        expect(cells[1].textContent, 'to be', '2020');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[1].classList.contains('selected'), 'to be true');

        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);
        expect(input.value, 'to be', '01/01/2020');

        dp.setDate({clear: true});
      });

      it('also hides the picker when todayButtonMode = 1 and autohide = true', function () {
        dp.setOptions({todayButtonMode: 1, autohide: true});
        dp.setDate('4/22/2020');
        todayButton.click();

        expect(isVisible(picker), 'to be false');

        dp.setDate({clear: true});
      });

      it('always changes the view to current date\'s view of pickLevel when todayButtonMode = 1', function () {
        const nextButton = picker.querySelector('.next-button');
        dp.setOptions({todayButtonMode: 1});

        // after moving other month or view while the current date is selected already
        // (issue #11)
        todayButton.click();
        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        viewSwitch.click();
        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        viewSwitch.click();
        viewSwitch.click();
        nextButton.click();
        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        // pickLevel = 1
        dp.setOptions({pickLevel: 1});
        dp.setDate('4/1/2020');

        viewSwitch.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', '2020');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[1].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

        viewSwitch.click();
        viewSwitch.click();
        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', '2020');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[1].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

        // pickLevel = 2
        dp.setOptions({pickLevel: 2});
        dp.setDate('1/1/2020');

        viewSwitch.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', '2020-2029');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[1].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);

        viewSwitch.click();
        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', '2020-2029');
        expect(cells[1].classList.contains('focused'), 'to be true');
        expect(cells[1].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);

        dp.setOptions({pickLevel: 0});
        dp.setDate('today');

        // when current date is deslected by toggling in multi-date mode
        dp.setOptions({maxNumberOfDates: 3});
        nextButton.click();
        getCells(picker)[20].click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be false');
        expect(dp.dates, 'to equal', [dateValue(2020, 2, 21)]);

        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 2, 21), dateValue(2020, 1, 14)]);

        viewSwitch.click();
        nextButton.click();
        todayButton.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be false');
        expect(dp.dates, 'to equal', [dateValue(2020, 2, 21)]);

        dp.setDate({clear: true});
      });

      it('has shortcut key: ctrl/meta + "."(period)', function () {
        const [nextButton] = getParts(picker, ['.next-button']);

        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});

        expect(viewSwitch.textContent, 'to be', 'February 2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
        expect(getCellIndices(cells, '.selected'), 'to be empty');
        expect(cells[19].textContent, 'to be', '14');

        expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
        expect(input.value, 'to be', '04/22/2020');

        nextButton.click();
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});

        expect(viewSwitch.textContent, 'to be', 'February 2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
        expect(getCellIndices(cells, '.selected'), 'to be empty');
        expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);

        dp.setDate({clear: true});

        // pickLevel = 1
        dp.setOptions({pickLevel: 1});
        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});

        expect(viewSwitch.textContent, 'to be', '2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
        expect(cells[1].textContent, 'to be', 'Feb');

        expect(dp.dates, 'to equal', [dateValue(2020, 3, 1)]);
        expect(input.value, 'to be', '04/01/2020');

        nextButton.click();
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});

        expect(viewSwitch.textContent, 'to be', '2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
        expect(dp.dates, 'to equal', [dateValue(2020, 3, 1)]);

        dp.setDate({clear: true});

        // pickLevel = 2
        dp.setOptions({pickLevel: 2});
        dp.setDate('4/22/2022');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});

        expect(viewSwitch.textContent, 'to be', '2020-2029');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
        expect(cells[1].textContent, 'to be', '2020');

        expect(dp.dates, 'to equal', [dateValue(2022, 0, 1)]);
        expect(input.value, 'to be', '01/01/2022');

        nextButton.click();
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});

        expect(viewSwitch.textContent, 'to be', '2020-2029');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
        expect(dp.dates, 'to equal', [dateValue(2022, 0, 1)]);

        dp.setDate({clear: true});

        // with todayButtonMode: 1
        dp.setOptions({todayButtonMode: 1, pickLevel: 0, startView: 0});
        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});

        expect(viewSwitch.textContent, 'to be', 'February 2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
        expect(cells[19].textContent, 'to be', '14');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
        expect(input.value, 'to be', '02/14/2020');

        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});

        expect(viewSwitch.textContent, 'to be', 'February 2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        dp.setDate('4/22/2020');
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        dp.setDate({clear: true});

        // pickLevel = 1
        dp.setOptions({pickLevel: 1});
        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});

        expect(viewSwitch.textContent, 'to be', '2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [1]);
        expect(cells[1].textContent, 'to be', 'Feb');

        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);
        expect(input.value, 'to be', '02/01/2020');

        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});

        expect(viewSwitch.textContent, 'to be', '2020');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [1]);
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
        expect(viewSwitch.textContent, 'to be', '2020');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});
        expect(viewSwitch.textContent, 'to be', '2020');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

        dp.setDate({clear: true});

        // pickLevel = 2
        dp.setOptions({pickLevel: 2});
        dp.setDate('4/22/2022');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});

        expect(viewSwitch.textContent, 'to be', '2020-2029');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [1]);
        expect(cells[1].textContent, 'to be', '2020');

        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);
        expect(input.value, 'to be', '01/01/2020');

        dp.setDate('4/22/2022');
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});

        expect(viewSwitch.textContent, 'to be', '2020-2029');
        cells = getCells(picker);
        expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
        expect(getCellIndices(cells, '.selected'), 'to equal', [1]);
        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);

        dp.setDate('4/22/2020');
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
        expect(viewSwitch.textContent, 'to be', '2020-2029');
        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);

        dp.setDate('4/22/2020');
        viewSwitch.click();
        simulant.fire(input, 'keydown', {key: '.', metaKey: true});
        expect(viewSwitch.textContent, 'to be', '2020-2029');
        expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);

        dp.setDate({clear: true});

        // shortcut key doesn't work when today button is disabled
        dp.setOptions({todayButton: false, pickLevel: 0, startView: 0});
        dp.setDate('4/22/2020');
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
        expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
        expect(input.value, 'to be', '04/22/2020');

        simulant.fire(input, 'keydown', {key: '.', metaKey: true});
        expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
        expect(input.value, 'to be', '04/22/2020');

        dp.setOptions({todayButtonMode: 0});
        simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'April 2020');
        expect(getCellIndices(cells, '.focused'), 'to equal', [24]);

        simulant.fire(input, 'keydown', {key: '.', metaKey: true});
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'April 2020');
        expect(getCellIndices(cells, '.focused'), 'to equal', [24]);

        dp.setDate({clear: true});
      });
    });
  });

  describe('todayBtnMode', function () {
    let dp;
    let picker;
    let todayButton;
    let cells;

    beforeEach(function () {
      ({dp, picker} = createDP(input, {todayButton: true}));
      [todayButton] = getParts(picker, ['.today-button']);
      dp.show();
    });

    afterEach(function () {
      dp.destroy();
    });

    it('is a synonym of todayButtonMode', function () {
      const date = dateValue(2020, 1, 11);

      // defualt to 0: focus-on (change view date)
      dp.setDate(date);
      todayButton.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[16].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [date]);

      dp.destroy();

      // 1: select (change the selection)
      ({dp, picker} = createDP(input, {todayButton: true, todayBtnMode: 1}));
      todayButton = picker.querySelector('.today-button');
      dp.setDate(date);
      dp.show();
      todayButton.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[19].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
    });

    it('can be updated with setOptions()', function () {
      const date = dateValue(2020, 1, 11);

      dp.setDate(date);
      dp.setOptions({todayBtnMode: 1});
      todayButton.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[19].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

      dp.setDate(date);
      dp.setOptions({todayBtnMode: 0});
      todayButton.click();

      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[16].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [date]);
    });
  });
});
