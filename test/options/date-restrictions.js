describe('options - date restrictions', function () {
  const getDisabled = cells => cellInfo(cells, '.disabled');
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

  describe('datesDisabled', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
    });

    afterEach(function () {
      clock.restore();
    });

    it('specifies unselectable dates', function () {
      const dp = new Datepicker(input, {
        datesDisabled: [new Date(2020, 1, 12), '2/13/2020', new Date(2020, 1, 13), '2/20/2020'],
      });
      const picker = document.querySelector('.datepicker');
      dp.show();

      expect(picker.querySelector('.prev-btn').disabled, 'to be false');
      expect(picker.querySelector('.next-btn').disabled, 'to be false');

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [17, '12'],
        [18, '13'],
        [25, '20'],
      ]);

      cells[17].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      dp.setDate(new Date(2020, 1, 12));
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      input.value = '2/12/2020';
      dp.update();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '2/12/2020');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      cells[16].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input.value, 'to be', '02/11/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [16]);

      dp.enterEditMode();
      input.value = '2/12/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input.value, 'to be', '2/12/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [16]);

      dp.destroy();
    });

    it('makes the picker prevent those dates becoming view date', function () {
      const dp = new Datepicker(input, {
        datesDisabled: ['2/11/2020', '2/12/2020', '2/13/2020', '2/20/2020'],
      });
      const picker = document.querySelector('.datepicker');
      const cells = getCells(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [15]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 5th
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 27th
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [24]);

      // on 19th
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [15]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on 4th
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      dp.destroy();
    });

    it('disables months if pickLevel = 1 (month)', function () {
      const dp = new Datepicker(input, {
        datesDisabled: [new Date(2020, 2, 1), '3/14/2020', new Date(2020, 5, 13), '9/20/2020', '7/1/2021'],
        pickLevel: 1,
      });
      const picker = document.querySelector('.datepicker');
      const [prevBtn, nextBtn] = getParts(picker, ['.prev-btn', '.next-btn']);
      dp.show();

      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [2, 'Mar'],
        [5, 'Jun'],
        [8, 'Sep'],
      ]);

      nextBtn.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [6, 'Jul'],
      ]);

      prevBtn.click();
      cells = getCells(picker);

      cells[8].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      dp.setDate(new Date(2020, 2, 1));
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      input.value = '3/12/2020';
      dp.update();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '3/12/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      cells[6].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 6, 1)]);
      expect(input.value, 'to be', '07/01/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [6]);

      dp.enterEditMode();
      input.value = '4/12/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 3, 1)]);
      expect(input.value, 'to be', '04/01/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [3]);

      dp.setDate({clear: true});

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on October
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [4]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on October
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [7]);

      dp.destroy();
    });

    it('disables years if pickLevel = 2 (year)', function () {
      const dp = new Datepicker(input, {
        datesDisabled: [new Date(2021, 1, 1), '2/14/2021', new Date(2024, 1, 1), '1/20/2027', '1/1/2035'],
        pickLevel: 2,
      });
      const picker = document.querySelector('.datepicker');
      const [prevBtn, nextBtn] = getParts(picker, ['.prev-btn', '.next-btn']);
      dp.show();

      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [2, '2021'],
        [5, '2024'],
        [8, '2027'],
      ]);

      nextBtn.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [6, '2035'],
      ]);

      prevBtn.click();
      cells = getCells(picker);

      cells[5].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      dp.setDate(new Date(2021, 1, 1));
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      input.value = '2/12/2021';
      dp.update();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '2/12/2021');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      cells[3].click();
      expect(dp.dates, 'to equal', [dateValue(2022, 0, 1)]);
      expect(input.value, 'to be', '01/01/2022');
      expect(getCellIndices(cells, '.selected'), 'to equal', [3]);

      dp.enterEditMode();
      input.value = '3/12/2026';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2026, 0, 1)]);
      expect(input.value, 'to be', '01/01/2026');
      expect(getCellIndices(cells, '.selected'), 'to equal', [7]);

      dp.setDate({clear: true});

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 2028
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [4]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 2028
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [7]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({datesDisabled: [new Date(2020, 1, 11), new Date(2020, 1, 26)]});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [16, '11'],
        [31, '26'],
      ]);

      dp.setOptions({datesDisabled: []});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      dp.destroy();
    });
  });

  describe('daysOfWeekDisabled', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
    });

    afterEach(function () {
      clock.restore();
    });

    it('specifies unselectable days of week', function () {
      const {dp, picker} = createDP(input, {daysOfWeekDisabled: [0, 6]});
      dp.show();

      expect(picker.querySelector('.prev-btn').disabled, 'to be false');
      expect(picker.querySelector('.next-btn').disabled, 'to be false');

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '26'],
        [6, '1'],
        [7, '2'],
        [13, '8'],
        [14, '9'],
        [20, '15'],
        [21, '16'],
        [27, '22'],
        [28, '23'],
        [34, '29'],
        [35, '1'],
        [41, '7'],
      ]);

      cells[14].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      dp.setDate(new Date(2020, 1, 9));
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      input.value = '2/9/2020';
      dp.update();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '2/9/2020');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      cells[15].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 10)]);
      expect(input.value, 'to be', '02/10/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [15]);

      dp.enterEditMode();
      input.value = '2/9/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 10)]);
      expect(input.value, 'to be', '2/9/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [15]);

      dp.destroy();
    });

    it('makes the picker prevent those dates becoming view date', function () {
      const {dp, picker} = createDP(input, {daysOfWeekDisabled: [0, 6]});
      const cells = getCells(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [22]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      // on 7th
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [15]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [12]);

      dp.destroy();
    });

    it('is ignored if pickLevel != 0', function () {
      let {dp, picker} = createDP(input, {
        daysOfWeekDisabled: [new Date(2020, 1, 1).getDay()],
        pickLevel: 1,
      });
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      cells[1].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

      dp.destroy();

      ({dp, picker} = createDP(input, {
        daysOfWeekDisabled: [new Date(2021, 0, 1).getDay()],
        pickLevel: 2,
      }));
      dp.show();

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      cells[2].click();
      expect(dp.dates, 'to equal', [dateValue(2021, 0, 1)]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({daysOfWeekDisabled: [4]});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [4, '30'],
        [11, '6'],
        [18, '13'],
        [25, '20'],
        [32, '27'],
        [39, '5'],
      ]);

      dp.setOptions({daysOfWeekDisabled: []});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      // remaining disabled days of week are ignored if pickLevel is  dynamically changed to > 0
      dp.setOptions({daysOfWeekDisabled: [new Date(2020, 1, 1).getDay()]});

      dp.setOptions({pickLevel: 1});
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      cells[1].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 1)]);

      dp.setDate({clean: true});
      dp.setOptions({daysOfWeekDisabled: [new Date(2021, 0, 1).getDay()], pickLevel: 0});

      dp.setOptions({pickLevel: 2});
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      cells[2].click();
      expect(dp.dates, 'to equal', [dateValue(2021, 0, 1)]);

      dp.destroy();
    });
  });

  describe('maxDate', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
    });

    afterEach(function () {
      clock.restore();
    });

    it('specifies the maximum selectable date', function () {
      const {dp, picker} = createDP(input, {maxDate: new Date(2020, 1, 25)});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [31, '26'],
        [32, '27'],
        [33, '28'],
        [34, '29'],
        [35, '1'],
        [36, '2'],
        [37, '3'],
        [38, '4'],
        [39, '5'],
        [40, '6'],
        [41, '7'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [2, 'Mar'],
        [3, 'Apr'],
        [4, 'May'],
        [5, 'Jun'],
        [6, 'Jul'],
        [7, 'Aug'],
        [8, 'Sep'],
        [9, 'Oct'],
        [10, 'Nov'],
        [11, 'Dec'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [2, '2021'],
        [3, '2022'],
        [4, '2023'],
        [5, '2024'],
        [6, '2025'],
        [7, '2026'],
        [8, '2027'],
        [9, '2028'],
        [10, '2029'],
        [11, '2030'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [4, '2030'],
        [5, '2040'],
        [6, '2050'],
        [7, '2060'],
        [8, '2070'],
        [9, '2080'],
        [10, '2090'],
        [11, '2100'],
      ]);

      dp.hide();
      dp.show();
      cells = getCells(picker);

      cells[31].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      dp.setDate(new Date(2020, 1, 26));
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      input.value = '2/26/2020';
      dp.update();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '2/26/2020');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      cells[30].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 25)]);
      expect(input.value, 'to be', '02/25/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [30]);

      dp.enterEditMode();
      input.value = '2/26/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 25)]);
      expect(input.value, 'to be', '2/26/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [30]);

      dp.destroy();
    });

    it('makes the picker disallow to navigate to after the max date', function () {
      const {dp, picker} = createDP(input, {maxDate: '2/14/2020'});
      const [viewSwitch, prevBtn, nextBtn] = getParts(picker, ['.view-switch', '.prev-btn', '.next-btn']);
      dp.show();

      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [13]);

      prevBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Jan 22nd
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      nextBtn.click();

      // view date is limited to the max date
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      // months view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on prev year's Nov
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [10]);

      prevBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Mar
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      nextBtn.click();

      // view date is limited to the Feb
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      // years view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on 2017
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [8]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});

      prevBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to 2011
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      nextBtn.click();

      // view year is limited to 2020
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

      // decades view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on 1990
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [10]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});

      prevBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to 1930
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      nextBtn.click();

      // view decade is limited to 2020
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({maxDate: new Date(2020, 1, 28)});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [34, '29'],
        [35, '1'],
        [36, '2'],
        [37, '3'],
        [38, '4'],
        [39, '5'],
        [40, '6'],
        [41, '7'],
      ]);

      dp.setOptions({maxDate: null});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      dp.destroy();
    });
  });

  describe('minDate', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({now: new Date(2022, 6, 14), shouldAdvanceTime: true});
    });

    afterEach(function () {
      clock.restore();
    });

    it('specifies the minimum selectable date', function () {
      let {dp, picker} = createDP(input, {minDate: new Date(2022, 6, 4)});
      let viewSwitch = getViewSwitch(picker);
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '26'],
        [1, '27'],
        [2, '28'],
        [3, '29'],
        [4, '30'],
        [5, '1'],
        [6, '2'],
        [7, '3'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, 'Jan'],
        [1, 'Feb'],
        [2, 'Mar'],
        [3, 'Apr'],
        [4, 'May'],
        [5, 'Jun'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '2019'],
        [1, '2020'],
        [2, '2021'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '1990'],
        [1, '2000'],
        [2, '2010'],
      ]);

      dp.hide();
      dp.show();
      cells = getCells(picker);

      cells[7].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      dp.setDate(new Date(2022, 6, 3));
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      input.value = '7/3/2022';
      dp.update();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '7/3/2022');
      expect(filterCells(cells, '.selected'), 'to equal', []);

      cells[8].click();
      expect(dp.dates, 'to equal', [dateValue(2022, 6, 4)]);
      expect(input.value, 'to be', '07/04/2022');
      expect(getCellIndices(cells, '.selected'), 'to equal', [8]);

      dp.enterEditMode();
      input.value = '7/3/2022';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2022, 6, 4)]);
      expect(input.value, 'to be', '7/3/2022');
      expect(getCellIndices(cells, '.selected'), 'to equal', [8]);

      dp.destroy();

      // minDate's month/year can be selected even if the given minDate is not
      // the first of the month/Jan 1 of the year when pickLevel > 0
      // (issue #54)
      ({dp, picker} = createDP(input, {pickLevel: 1, minDate: '7/4/2022'}));
      cells = getCells(picker);
      dp.show();

      cells[6].click();
      expect(dp.dates, 'to equal', [dateValue(2022, 6, 1)]);

      dp.destroy();

      ({dp, picker} =  createDP(input, {pickLevel: 2, minDate: '7/4/2022'}));
      cells = getCells(picker);
      dp.show();

      cells[3].click();
      expect(dp.dates, 'to equal', [dateValue(2022, 0, 1)]);

      dp.destroy();
    });

    it('makes the picker disallow to navigate to before the min date', function () {
      const {dp, picker} = createDP(input, {minDate: '7/14/2022'});
      const [viewSwitch, prevBtn, nextBtn] = getParts(picker, ['.view-switch', '.prev-btn', '.next-btn']);
      dp.show();

      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(getCellIndices(cells, '.focused'), 'to equal', [24]);

      nextBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Aug 13th
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      prevBtn.click();

      // view date is limited to min date
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);

      // months view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on Oct
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

      nextBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Jun
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      prevBtn.click();

      // view date is limited to Jul
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      // years view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 2025
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});

      nextBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to 2031
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      prevBtn.click();

      // view year is limited to 2022
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      // decades view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 2050
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [6]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});

      nextBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to 2110
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      prevBtn.click();

      // view decade is limited to 2020
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({minDate: new Date(2022, 6, 2)});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [0, '26'],
        [1, '27'],
        [2, '28'],
        [3, '29'],
        [4, '30'],
        [5, '1'],
      ]);

      dp.setOptions({minDate: null});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      dp.destroy();
    });
  });
});
