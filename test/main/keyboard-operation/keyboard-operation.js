describe('keyboard operation', function () {
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    if (input.datepicker) {
      input.datepicker.destroy();
    }
    testContainer.removeChild(input);
  });

  describe('tab', function () {
    it('hides the picker on the input blurs', function () {
      const {dp, picker} = createDP(input);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Tab'});
      input.blur();
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('updates the selected date with the input\'s value', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});

      const dp = new Datepicker(input);
      // when picker is shown
      input.focus();
      input.value = 'foo';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      input.blur();
      expect(input.value, 'to be', '02/14/2020');
      expect(dp.getDate().getTime(), 'to be', dateValue(2020, 1, 14));

      // when picker is hidden
      input.focus();
      input.value = '04/22/2020';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      input.blur();
      expect(input.value, 'to be', '04/22/2020');
      expect(dp.getDate().getTime(), 'to be', dateValue(2020, 3, 22));

      input.focus();
      input.value = '';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      input.blur();
      expect(input.value, 'to be', '');
      expect(dp.getDate(), 'to be undefined');

      // picker hides reverting the input when invalid date is in the input (bugfix)
      input.focus();
      input.value = '0/0/0';

      simulant.fire(input, 'keydown', {key: 'Tab'});
      input.blur();
      expect(isVisible(dp.picker.element), 'to be false');
      expect(input.value, 'to be', '');
      expect(dp.getDate(), 'to be undefined');

      dp.destroy();
      clock.restore();
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

    it('keydown event is canceled and does not bubble', function () {
      const outer = document.createElement('div');
      testContainer.replaceChild(outer, input);
      outer.appendChild(input);

      const dp = new Datepicker(input);
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      // show the picker
      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      // hide the picker
      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(spyInputKeydown.args[1][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
      dp.destroy();
      outer.removeChild(input);
      testContainer.replaceChild(input, outer);
    });
  });

  describe('enter', function () {
    it('sets the view date to the selection if the current view is days', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
      const {dp, picker} = createDP(input);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/14/2020');

      let cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.destroy();
      clock.restore();
    });

    it('changes the view to the next minor one if the current view is not days', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 3, 22), shouldAdvanceTime: true});
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', '2020-2029');

      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', '2020');

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', '2020');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [24]);
      expect(cells[24].textContent, 'to be', '22');

      // does nothig if the view has reached to the min view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
      clock.restore();
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
      expect(getCellIndices(cells, '.selected'), 'to equal', [6]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);
      expect(cells[6].textContent, 'to be', '4');

      dp.destroy();
    });
  });
});
