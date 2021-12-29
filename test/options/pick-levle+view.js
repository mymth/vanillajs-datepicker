describe('options - pick level & view', function () {
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

  describe('pickLevel', function () {
    it('limits the minimum of available views', function () {
      const {dp, picker} = createDP(input, {pickLevel: 2});
      const viewSwitch = getViewSwitch(picker);
      const cells1 = getCells(picker)[1];
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(cells1.textContent, 'to be', '2020');

      cells1.click();

      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(getCells(picker)[1].textContent, 'to be', '2020');

      dp.destroy();
    });

    it('changes the selection level to month when 1', function () {
      input.value = '2/14/2020';

      const {dp, picker} = createDP(input, {pickLevel: 1});
      const [viewSwitch, nextBtn] = getParts(picker, ['.view-switch', '.next-btn']);
      let cells = getCells(picker);
      dp.show();

      expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);
      expect(input.value, 'to be', '02/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[1]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      // mouse operation
      cells[0].click();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);
      expect(input.value, 'to be', '01/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[0]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[0]]);

      nextBtn.click();
      getCells(picker)[7].click();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2021, 7, 1)]);
      expect(input.value, 'to be', '08/01/2021');
      expect(viewSwitch.textContent, 'to be', '2021');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[7]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[7]]);

      // keyboard operation
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'Enter'});

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2020, 6, 1)]);
      expect(input.value, 'to be', '07/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[6]]);

      dp.enterEditMode();
      input.value = '4/20/2021';
      simulant.fire(input, 'keydown', {key: 'Enter'});

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2021, 3, 1)]);
      expect(input.value, 'to be', '04/01/2021');
      expect(viewSwitch.textContent, 'to be', '2021');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);

      // api call
      viewSwitch.click();

      dp.setDate('2/14/2022');

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2022, 1, 1)]);
      expect(input.value, 'to be', '02/01/2022');
      expect(viewSwitch.textContent, 'to be', '2022');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[1]]);

      viewSwitch.click();
      dp.hide();

      input.value = '3/14/2020';
      dp.update();
      dp.show();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2020, 2, 1)]);
      expect(input.value, 'to be', '03/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[2]]);

      dp.destroy();
    });

    it('changes the selection level to year when 2', function () {
      input.value = '2/14/2020';

      const {dp, picker} = createDP(input, {pickLevel: 2});
      const [viewSwitch, nextBtn] = getParts(picker, ['.view-switch', '.next-btn']);
      let cells = getCells(picker);
      dp.show();

      expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);
      expect(input.value, 'to be', '01/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[1]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      // mouse operation
      cells[2].click();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2021, 0, 1)]);
      expect(input.value, 'to be', '01/01/2021');
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[2]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);

      nextBtn.click();
      getCells(picker)[7].click();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2036, 0, 1)]);
      expect(input.value, 'to be', '01/01/2036');
      expect(viewSwitch.textContent, 'to be', '2030-2039');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[7]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[7]]);

      // keyboard operation
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'Enter'});

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2025, 0, 1)]);
      expect(input.value, 'to be', '01/01/2025');
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[6]]);

      dp.enterEditMode();
      input.value = '4/20/2021';
      simulant.fire(input, 'keydown', {key: 'Enter'});

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2021, 0, 1)]);
      expect(input.value, 'to be', '01/01/2021');
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[2]]);

      // api call
      viewSwitch.click();

      dp.setDate('2/14/2032');

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2032, 0, 1)]);
      expect(input.value, 'to be', '01/01/2032');
      expect(viewSwitch.textContent, 'to be', '2030-2039');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);

      viewSwitch.click();
      dp.hide();

      input.value = '3/14/2020';
      dp.update();
      dp.show();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2020, 0, 1)]);
      expect(input.value, 'to be', '01/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[1]]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.setOptions({pickLevel: 1});
      dp.show();

      let cells = getCells(picker);
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(cells[1].textContent, 'to be', 'Feb');

      cells[1].click();

      cells = getCells(picker);
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);
      expect(input.value, 'to be', '02/01/2020');
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[0]]);

      dp.setOptions({pickLevel: 0});

      cells = getCells(picker);
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[6]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

      viewSwitch.click();
      getCells(picker)[3].click();

      cells = getCells(picker);
      expect(viewSwitch.textContent, 'to be', 'April 2020');
      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      dp.destroy();
    });

    it('makes datesDisabled be cleared if updated separately from it', function () {
      const getDisabled = cells => cellInfo(cells, '.disabled');
      const {dp, picker} = createDP(input, {datesDisabled: ['2/11/2020', '2/20/2020']});
      dp.setOptions({pickLevel: 1});
      dp.show();

      expect(getDisabled(getCells(picker)), 'to equal', []);

      dp.setOptions({datesDisabled: ['2/11/2020']});
      dp.setOptions({pickLevel: 2});

      expect(getDisabled(getCells(picker)), 'to equal', []);

      dp.setOptions({datesDisabled: ['2/11/2020']});
      dp.setOptions({pickLevel: 1});

      expect(getDisabled(getCells(picker)), 'to equal', []);

      dp.setOptions({datesDisabled: ['2/11/2020']});
      dp.setOptions({pickLevel: 0});

      expect(getDisabled(getCells(picker)), 'to equal', []);

      dp.setOptions({datesDisabled: ['2/11/2020'], pickLevel: 1});
      expect(getDisabled(getCells(picker)), 'to equal', [[1, 'Feb']]);

      dp.setOptions({datesDisabled: ['2/11/2020'], pickLevel: 2});
      expect(getDisabled(getCells(picker)), 'to equal', [[1, '2020']]);

      dp.setOptions({datesDisabled: ['2/11/2020'], pickLevel: 1});
      expect(getDisabled(getCells(picker)), 'to equal', [[1, 'Feb']]);

      dp.setOptions({datesDisabled: ['2/11/2020', '2/20/2020'], pickLevel: 0});
      expect(getDisabled(getCells(picker)), 'to equal', [[16, '11'], [25, '20']]);

      dp.destroy();
    });

    it('makes maxDate be changed to the end of the mont/year if updated to larger span separately from them', function () {
      const getDisabled = cells => cellInfo(cells, '.disabled');
      const {dp, picker} = createDP(input, {maxDate: '9/28/2018', defaultViewDate: '9/15/2018'});
      const [nextBtn] = getParts(picker, ['.next-btn']);
      dp.setOptions({pickLevel: 1});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [9, 'Oct'],
        [10, 'Nov'],
        [11, 'Dec'],
      ]);
      expect(nextBtn.disabled, 'to be true');

      cells[8].click();
      expect(input.value, 'to be', '09/01/2018');

      dp.setDate({clear: true});
      dp.setOptions({pickLevel: 0});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [36, '1'],
        [37, '2'],
        [38, '3'],
        [39, '4'],
        [40, '5'],
        [41, '6'],
      ]);
      expect(nextBtn.disabled, 'to be true');

      dp.setOptions({pickLevel: 2});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [10, '2019'],
        [11, '2020'],
      ]);
      expect(nextBtn.disabled, 'to be true');

      cells[9].click();
      expect(input.value, 'to be', '01/01/2018');

      dp.setDate({clear: true});
      dp.setOptions({pickLevel: 1});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);
      expect(nextBtn.disabled, 'to be true');

      dp.setOptions({pickLevel: 0});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);
      expect(nextBtn.disabled, 'to be false');

      nextBtn.click();
      nextBtn.click();
      nextBtn.click();

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [37, '1'],
        [38, '2'],
        [39, '3'],
        [40, '4'],
        [41, '5'],
      ]);
      expect(nextBtn.disabled, 'to be true');

      dp.destroy();
    });

    it('makes minDate be changed to the start of the mont/year if updated to larger span separately from them', function () {
      const getDisabled = cells => cellInfo(cells, '.disabled');
      const {dp, picker} = createDP(input, {minDate: '4/4/2021', defaultViewDate: '4/15/2021'});
      const [prevBtn] = getParts(picker, ['.prev-btn']);
      dp.setOptions({pickLevel: 1});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, 'Jan'],
        [1, 'Feb'],
        [2, 'Mar'],
      ]);
      expect(prevBtn.disabled, 'to be true');

      cells[3].click();
      expect(input.value, 'to be', '04/01/2021');

      dp.setDate({clear: true});
      dp.setOptions({pickLevel: 0});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '28'],
        [1, '29'],
        [2, '30'],
        [3, '31'],
      ]);
      expect(prevBtn.disabled, 'to be true');

      dp.setOptions({pickLevel: 2});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '2019'],
        [1, '2020'],
      ]);
      expect(prevBtn.disabled, 'to be true');

      cells[2].click();
      expect(input.value, 'to be', '01/01/2021');

      dp.setDate({clear: true});
      dp.setOptions({pickLevel: 1});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);
      expect(prevBtn.disabled, 'to be true');

      dp.setOptions({pickLevel: 0});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);
      expect(prevBtn.disabled, 'to be false');

      prevBtn.click();
      prevBtn.click();
      prevBtn.click();

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '27'],
        [1, '28'],
        [2, '29'],
        [3, '30'],
        [4, '31'],
      ]);
      expect(prevBtn.disabled, 'to be true');

      dp.destroy();
    });
  });

  describe('maxView', function () {
    it('limits the maximum of available views', function () {
      const {dp, picker} = createDP(input, {maxView: 1});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      viewSwitch.click();
      viewSwitch.click();

      expect(viewSwitch.textContent, 'to be', '2020');
      expect(getCells(picker)[0].textContent, 'to be', 'Jan');

      dp.destroy();
    });

    it('cannot be smaller than pickLevel', function () {
      const {dp, picker} = createDP(input, {maxView: 1, pickLevel: 2});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(getCells(picker)[1].textContent, 'to be', '2020');

      viewSwitch.click();

      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(getCells(picker)[1].textContent, 'to be', '2020');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.setOptions({maxView: 2});
      dp.show();

      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(getCells(picker)[1].textContent, 'to be', '2020');

      dp.setOptions({maxView: 0});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });
  });

  describe('startView', function () {
    it('specifies the view desplayed on open', function () {
      const {dp, picker} = createDP(input, {startView: 3});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2000-2090');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
      expect(cells[3].textContent, 'to be', '2020');

      dp.destroy();
    });

    it('cannot be smaller than pickLevel', function () {
      const {dp, picker} = createDP(input, {startView: 1, pickLevel: 2});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020-2029');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2020');

      dp.destroy();
    });

    it('cannot be larger than maxView', function () {
      const {dp, picker} = createDP(input, {startView: 3, maxView: 2});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020-2029');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2020');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.setOptions({startView: 2});
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020-2029');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2020');

      dp.hide();
      dp.setOptions({startView: 0});
      dp.show();

      expect(viewSwitch.textContent, 'to be', 'February 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');

      dp.destroy();
    });
  });
});
