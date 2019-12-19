describe('keyboard operation', function () {
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
  });

  describe('tab', function () {
    it('hides the picker', function () {
      const {dp, picker} = createDP(input);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('discards unparsed input', function () {
      input.value = '04/22/2020';

      const dp = new Datepicker(input);
      input.focus();
      input.value = 'foo';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(input.value, 'to be', '04/22/2020');

      dp.setDate({clear: true});
      input.focus();
      input.value = 'foo';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(input.value, 'to be', '');

      dp.destroy();
    });
  });

  describe('escape', function () {
    it('shows or hides the picker', function () {
      const {dp, picker} = createDP(input);

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });
  });

  describe('enter', function () {
    it('sets the view date to the selection if the current view is days', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
      const {dp, picker} = createDP(input);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/14/2020');

      let cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[19]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');

      dp.destroy();
      clock.reset();
    });

    it('changes the view to the next minor one if the current view is not days', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 3, 22)});
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', '2020-2029');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2020');

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', '2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);
      expect(cells[24].textContent, 'to be', '22');

      // does nothig if the view has reached to the min view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
      clock.reset();
    });

    it('updates the selection with the input text if the picker is hidden', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);

      input.value = '7/4/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 6, 4)]);
      expect(input.value, 'to be', '07/04/2020');

      dp.show();
      expect(viewSwitch.textContent, 'to be', 'July 2020');

      let cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[6]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);
      expect(cells[6].textContent, 'to be', '4');

      dp.destroy();
    });
  });
});
