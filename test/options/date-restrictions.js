describe('options - date restrictions', function () {
  const getDisabled = cells => filterCells(cells, '.disabled').map(el => [el, el.textContent]);
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
  });

  describe('datesDisabled', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
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
        [cells[17], '12'],
        [cells[18], '13'],
        [cells[25], '20'],
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
      expect(filterCells(cells, '.selected'), 'to equal', [cells[16]]);

      dp.enterEditMode();
      input.value = '2/12/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input.value, 'to be', '2/12/2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[16]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[15]]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 5th
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 27th
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);

      // on 19th
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[15]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on 4th
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({datesDisabled: [new Date(2020, 1, 11), new Date(2020, 1, 26)]});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[16], '11'],
        [cells[31], '26'],
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
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
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
        [cells[0], '26'],
        [cells[6], '1'],
        [cells[7], '2'],
        [cells[13], '8'],
        [cells[14], '9'],
        [cells[20], '15'],
        [cells[21], '16'],
        [cells[27], '22'],
        [cells[28], '23'],
        [cells[34], '29'],
        [cells[35], '1'],
        [cells[41], '7'],
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
      expect(filterCells(cells, '.selected'), 'to equal', [cells[15]]);

      dp.enterEditMode();
      input.value = '2/9/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 10)]);
      expect(input.value, 'to be', '2/9/2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[15]]);

      dp.destroy();
    });

    it('makes the picker prevent those dates becoming view date', function () {
      const {dp, picker} = createDP(input, {daysOfWeekDisabled: [0, 6]});
      const cells = getCells(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[22]]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      // on 7th
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[15]]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[12]]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({daysOfWeekDisabled: [4]});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[4], '30'],
        [cells[11], '6'],
        [cells[18], '13'],
        [cells[25], '20'],
        [cells[32], '27'],
        [cells[39], '5'],
      ]);

      dp.setOptions({daysOfWeekDisabled: []});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      dp.destroy();
    });
  });

  describe('maxDate', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
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
        [cells[31], '26'],
        [cells[32], '27'],
        [cells[33], '28'],
        [cells[34], '29'],
        [cells[35], '1'],
        [cells[36], '2'],
        [cells[37], '3'],
        [cells[38], '4'],
        [cells[39], '5'],
        [cells[40], '6'],
        [cells[41], '7'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[2], 'Mar'],
        [cells[3], 'Apr'],
        [cells[4], 'May'],
        [cells[5], 'Jun'],
        [cells[6], 'Jul'],
        [cells[7], 'Aug'],
        [cells[8], 'Sep'],
        [cells[9], 'Oct'],
        [cells[10], 'Nov'],
        [cells[11], 'Dec'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[2], '2021'],
        [cells[3], '2022'],
        [cells[4], '2023'],
        [cells[5], '2024'],
        [cells[6], '2025'],
        [cells[7], '2026'],
        [cells[8], '2027'],
        [cells[9], '2028'],
        [cells[10], '2029'],
        [cells[11], '2030'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[4], '2030'],
        [cells[5], '2040'],
        [cells[6], '2050'],
        [cells[7], '2060'],
        [cells[8], '2070'],
        [cells[9], '2080'],
        [cells[10], '2090'],
        [cells[11], '2100'],
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
      expect(filterCells(cells, '.selected'), 'to equal', [cells[30]]);

      dp.enterEditMode();
      input.value = '2/26/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 25)]);
      expect(input.value, 'to be', '2/26/2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[30]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[13]]);

      prevBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Jan 22nd
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      nextBtn.click();

      // view date is limited to the max date
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

      // months view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on prev year's Nov
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);

      prevBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Mar
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      nextBtn.click();

      // view date is limited to the Feb
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      // years view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on 2017
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[8]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      // decades view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      // on 1990
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      // the same goes for ctrl + ArrowRight key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({maxDate: new Date(2020, 1, 28)});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[34], '29'],
        [cells[35], '1'],
        [cells[36], '2'],
        [cells[37], '3'],
        [cells[38], '4'],
        [cells[39], '5'],
        [cells[40], '6'],
        [cells[41], '7'],
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
      clock = sinon.useFakeTimers({now: new Date(2022, 6, 14)});
    });

    afterEach(function () {
      clock.restore();
    });

    it('specifies the minimum selectable date', function () {
      const {dp, picker} = createDP(input, {minDate: new Date(2022, 6, 4)});
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[0], '26'],
        [cells[1], '27'],
        [cells[2], '28'],
        [cells[3], '29'],
        [cells[4], '30'],
        [cells[5], '1'],
        [cells[6], '2'],
        [cells[7], '3'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[0], 'Jan'],
        [cells[1], 'Feb'],
        [cells[2], 'Mar'],
        [cells[3], 'Apr'],
        [cells[4], 'May'],
        [cells[5], 'Jun'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[0], '2019'],
        [cells[1], '2020'],
        [cells[2], '2021'],
      ]);

      viewSwitch.click();
      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[0], '1990'],
        [cells[1], '2000'],
        [cells[2], '2010'],
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
      expect(filterCells(cells, '.selected'), 'to equal', [cells[8]]);

      dp.enterEditMode();
      input.value = '7/3/2022';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(dp.dates, 'to equal', [dateValue(2022, 6, 4)]);
      expect(input.value, 'to be', '7/3/2022');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[8]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[18]]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[18]]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);

      nextBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Aug 13th
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      prevBtn.click();

      // view date is limited to min date
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[18]]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[18]]);

      // months view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on Oct
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);

      nextBtn.click();
      expect(prevBtn.disabled, 'to be false');
      expect(nextBtn.disabled, 'to be false');

      // move to Jun
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      prevBtn.click();

      // view date is limited to Jul
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

      // years view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 2025
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      // decades view
      viewSwitch.click();
      expect(prevBtn.disabled, 'to be true');
      expect(nextBtn.disabled, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      // on 2050
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

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
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      // the same goes for ctrl + ArrowLeft key
      prevBtn.click();
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({minDate: new Date(2022, 6, 2)});
      dp.show();

      let cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', [
        [cells[0], '26'],
        [cells[1], '27'],
        [cells[2], '28'],
        [cells[3], '29'],
        [cells[4], '30'],
        [cells[5], '1'],
      ]);

      dp.setOptions({minDate: null});

      cells = getCells(picker);
      expect(getDisabled(cells), 'to equal', []);

      dp.destroy();
    });
  });
});
