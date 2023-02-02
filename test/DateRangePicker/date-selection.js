describe('DateRangePicker - date selection', function () {
  let clock;
  let elem;
  let input0;
  let input1;
  //
  let drp;
  let picker0;
  let picker1;
  let viewSwitch0;
  let viewSwitch1;
  let nextButton0;
  let nextButton1;
  let cells0;
  let cells1;

  before(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
  });

  after(function () {
    clock.restore();
  });

  beforeEach(function () {
    elem = domUtils.parseHTML('<div><input><input></div>').firstChild;
    [input0, input1] = elem.children;
    testContainer.appendChild(elem);
  });

  afterEach(function () {
    if (elem.rangepicker) {
      elem.rangepicker.destroy();
    }
    testContainer.removeChild(elem);
  });

  it('same date is set to both sides if a date is selected on one side when selections are none', function () {
    let selectDate = dateValue(2020, 1, 11);

    ({drp, picker0, picker1} = createDRP(elem));
    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    drp.datepickers[0].show();
    cells0[16].click();

    expect(drp.dates, 'to equal', [selectDate, selectDate]);
    expect(input0.value, 'to be', '02/11/2020');
    expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range'), 'to equal', []);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

    expect(input1.value, 'to be', '02/11/2020');
    expect(getCellIndices(cells1, '.selected'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range'), 'to equal', []);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [16]);

    drp.destroy();
    input0.value = '';
    input1.value = '';

    ({drp, picker0, picker1} = createDRP(elem));
    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    drp.datepickers[1].show();
    cells1[16].click();

    expect(drp.dates, 'to equal', [selectDate, selectDate]);
    expect(input0.value, 'to be', '02/11/2020');
    expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range'), 'to equal', []);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

    expect(input1.value, 'to be', '02/11/2020');
    expect(getCellIndices(cells1, '.selected'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range'), 'to equal', []);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [16]);

    drp.destroy();
    input0.value = '';
    input1.value = '';

    // other month than default view date's
    // (issue #17, #19)
    let partsClasses = ['.view-switch', '.next-button'];
    selectDate = dateValue(2020, 2, 10);

    ({drp, picker0, picker1} = createDRP(elem));
    [viewSwitch0, nextButton0] = getParts(picker0, partsClasses);
    [viewSwitch1, nextButton1] = getParts(picker1, partsClasses);

    drp.datepickers[0].show();
    nextButton0.click();
    getCells(picker0)[9].click();

    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    expect(drp.dates, 'to equal', [selectDate, selectDate]);
    expect(input0.value, 'to be', '03/10/2020');
    expect(viewSwitch0.textContent, 'to equal', 'March 2020');
    expect(getCellIndices(cells0, '.selected'), 'to equal', [9]);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', [9]);
    expect(getCellIndices(cells0, '.range'), 'to equal', []);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [9]);

    expect(input1.value, 'to be', '03/10/2020');
    expect(viewSwitch1.textContent, 'to equal', 'March 2020');
    expect(getCellIndices(cells1, '.selected'), 'to equal', [9]);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', [9]);
    expect(getCellIndices(cells1, '.range'), 'to equal', []);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [9]);

    drp.datepickers[1].show();
    nextButton1.click();
    expect(viewSwitch1.textContent, 'to equal', 'April 2020');

    drp.destroy();
    input0.value = '';
    input1.value = '';

    ({drp, picker0, picker1} = createDRP(elem));
    [viewSwitch0, nextButton0] = getParts(picker0, partsClasses);
    [viewSwitch1, nextButton1] = getParts(picker1, partsClasses);

    drp.datepickers[1].show();
    nextButton1.click();
    getCells(picker1)[9].click();

    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    expect(drp.dates, 'to equal', [selectDate, selectDate]);
    expect(input0.value, 'to be', '03/10/2020');
    expect(viewSwitch0.textContent, 'to equal', 'March 2020');
    expect(getCellIndices(cells0, '.selected'), 'to equal', [9]);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', [9]);
    expect(getCellIndices(cells0, '.range'), 'to equal', []);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [9]);

    expect(input1.value, 'to be', '03/10/2020');
    expect(viewSwitch1.textContent, 'to equal', 'March 2020');
    expect(getCellIndices(cells1, '.selected'), 'to equal', [9]);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', [9]);
    expect(getCellIndices(cells1, '.range'), 'to equal', []);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [9]);

    drp.datepickers[0].show();
    nextButton0.click();
    expect(viewSwitch0.textContent, 'to equal', 'April 2020');

    drp.destroy();
    input0.value = '';
    input1.value = '';
  });

  it('selections are cleared from both sides if selected date on one side is cleared', function () {
    input0.value = '02/11/2020';
    input1.value = '02/11/2020';

    ({drp, picker0, picker1} = createDRP(elem));
    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    input0.value = '';
    simulant.fire(input0, 'keydown', {key: 'Enter'});

    expect(drp.dates, 'to equal', [undefined, undefined]);
    expect(input0.value, 'to be', '');
    expect(getCellIndices(cells0, '.selected'), 'to equal', []);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells0, '.range'), 'to equal', []);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [19]);

    expect(input1.value, 'to be', '');
    expect(getCellIndices(cells1, '.selected'), 'to equal', []);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells1, '.range'), 'to equal', []);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [19]);

    drp.destroy();

    input0.value = '02/11/2020';
    input1.value = '02/11/2020';
    ({drp, picker0, picker1} = createDRP(elem));
    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    input1.value = '';
    simulant.fire(input1, 'keydown', {key: 'Enter'});

    expect(drp.dates, 'to equal', [undefined, undefined]);
    expect(input0.value, 'to be', '');
    expect(getCellIndices(cells0, '.selected'), 'to equal', []);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells0, '.range'), 'to equal', []);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [19]);

    expect(input1.value, 'to be', '');
    expect(getCellIndices(cells1, '.selected'), 'to equal', []);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells1, '.range'), 'to equal', []);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [19]);

    drp.destroy();
  });

  it('dates are swapped if a date later than the 2nd picker\'s selection is seleted on the 1st picker', function () {
    input0.value = '02/11/2020';
    input1.value = '02/11/2020';

    ({drp, picker0, picker1} = createDRP(elem));
    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    drp.datepickers[0].show();
    cells0[20].click();

    expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 1, 15)]);
    expect(input0.value, 'to be', '02/11/2020');
    expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', [20]);
    expect(getCellIndices(cells0, '.range'), 'to equal', [17, 18, 19]);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

    expect(input1.value, 'to be', '02/15/2020');
    expect(getCellIndices(cells1, '.selected'), 'to equal', [20]);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', [20]);
    expect(getCellIndices(cells1, '.range'), 'to equal', [17, 18, 19]);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [20]);

    drp.destroy();
    input0.value = '';
    input1.value = '';
  });

  it('dates are swapped if a date earlier than the 1st picker\'s selection is seleted on the 2nd picker', function () {
    input0.value = '02/11/2020';
    input1.value = '02/11/2020';

    ({drp, picker0, picker1} = createDRP(elem));
    cells0 = getCells(picker0);
    cells1 = getCells(picker1);

    drp.datepickers[1].show();
    cells1[12].click();

    expect(drp.dates, 'to equal', [dateValue(2020, 1, 7), dateValue(2020, 1, 11)]);
    expect(input0.value, 'to be', '02/07/2020');
    expect(getCellIndices(cells0, '.selected'), 'to equal', [12]);
    expect(getCellIndices(cells0, '.range-start'), 'to equal', [12]);
    expect(getCellIndices(cells0, '.range-end'), 'to equal', [16]);
    expect(getCellIndices(cells0, '.range'), 'to equal', [13, 14, 15]);
    expect(getCellIndices(cells0, '.focused'), 'to equal', [12]);

    expect(input1.value, 'to be', '02/11/2020');
    expect(getCellIndices(cells1, '.selected'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range-start'), 'to equal', [12]);
    expect(getCellIndices(cells1, '.range-end'), 'to equal', [16]);
    expect(getCellIndices(cells1, '.range'), 'to equal', [13, 14, 15]);
    expect(getCellIndices(cells1, '.focused'), 'to equal', [16]);

    drp.destroy();
    input0.value = '';
    input1.value = '';
  });

  describe('range between different months', function () {
    it('each picker displays the month of corresponding end of the range', function () {
      input0.value = '02/25/2020';
      input1.value = '03/05/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [30]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [30]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [39]);
      expect(getCellIndices(cells0, '.range'), 'to equal', mapIndices(cells0).slice(31, 39));

      expect(viewSwitch1.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [4]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [4]);
      expect(getCellIndices(cells1, '.range'), 'to equal', mapIndices(cells1).slice(0, 4));

      drp.datepickers[1].show();
      picker1.querySelector('.next-button').click();
      cells1 = getCells(picker1);
      cells1[24].click();

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 25), dateValue(2020, 3, 22)]);
      expect(input0.value, 'to be', '02/25/2020');
      expect(input1.value, 'to be', '04/22/2020');

      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [30]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [30]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells0, '.range'), 'to equal', mapIndices(cells0).slice(31));

      expect(viewSwitch1.textContent, 'to be', 'April 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [24]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [24]);
      expect(getCellIndices(cells1, '.range'), 'to equal', mapIndices(cells1).slice(0, 24));

      input0.value = '02/14/1998';
      simulant.fire(input0, 'keydown', {key: 'Enter'});
      cells0 = getCells(picker0);

      expect(drp.dates, 'to equal', [dateValue(1998, 1, 14), dateValue(2020, 3, 22)]);
      expect(input0.value, 'to be', '02/14/1998');
      expect(input1.value, 'to be', '04/22/2020');

      expect(viewSwitch0.textContent, 'to be', 'February 1998');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [13]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [13]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells0, '.range'), 'to equal', mapIndices(cells0).slice(14));

      expect(viewSwitch1.textContent, 'to be', 'April 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [24]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [24]);
      expect(getCellIndices(cells1, '.range'), 'to equal', mapIndices(cells1).slice(0, 24));

      drp.datepickers[0].show();

      // months view
      viewSwitch0.click();
      cells0 = getCells(picker0);
      expect(viewSwitch0.textContent, 'to be', '1998');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [1]);

      viewSwitch1.click();
      cells1 = getCells(picker1);
      expect(viewSwitch1.textContent, 'to be', '2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [3]);

      // years view
      viewSwitch0.click();
      cells0 = getCells(picker0);
      expect(viewSwitch0.textContent, 'to be', '1990-1999');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [9]);

      viewSwitch1.click();
      cells1 = getCells(picker1);
      expect(viewSwitch1.textContent, 'to be', '2020-2029');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [1]);

      // decades view
      viewSwitch0.click();
      cells0 = getCells(picker0);
      expect(viewSwitch0.textContent, 'to be', '1900-1990');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [10]);

      viewSwitch1.click();
      cells1 = getCells(picker1);
      expect(viewSwitch1.textContent, 'to be', '2000-2090');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [3]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('dates are swapped if a date later than the 2nd picker\'s selection is seleted on the 1st picker', function () {
      ({drp, picker0, picker1} = createDRP(elem));
      [viewSwitch0, nextButton0] = getParts(picker0, ['.view-switch', '.next-button']);
      viewSwitch1 = picker1.querySelector('.view-switch');

      drp.datepickers[1].show();
      getCells(picker1)[16].click();
      drp.datepickers[1].hide();
      drp.datepickers[0].show();
      expect(viewSwitch0.textContent, 'to equal', 'February 2020');

      nextButton0.click();
      expect(viewSwitch0.textContent, 'to equal', 'March 2020');

      getCells(picker0)[9].click();
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 2, 10)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to equal', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells0, '.range'), 'to equal', mapIndices(cells0).slice(17));
      expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

      expect(input1.value, 'to be', '03/10/2020');
      expect(viewSwitch1.textContent, 'to equal', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [9]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [9]);
      expect(getCellIndices(cells1, '.range'), 'to equal', mapIndices(cells1).slice(0, 9));
      expect(getCellIndices(cells1, '.focused'), 'to equal', [9]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('dates are swapped if a date earlier than the 1st picker\'s selection is seleted on the 2nd picker', function () {
      let prevButton1;

      ({drp, picker0, picker1} = createDRP(elem));
      [viewSwitch0, nextButton0] = getParts(picker0, ['.view-switch', '.next-button']);
      [viewSwitch1, prevButton1] = getParts(picker1, ['.view-switch', '.prev-button']);

      drp.datepickers[0].show();
      nextButton0.click();
      getCells(picker0)[9].click();
      drp.datepickers[0].hide();
      drp.datepickers[1].show();
      expect(viewSwitch1.textContent, 'to equal', 'March 2020');

      prevButton1.click();
      expect(viewSwitch1.textContent, 'to equal', 'February 2020');

      getCells(picker1)[16].click();
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 2, 10)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to equal', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells0, '.range'), 'to equal', mapIndices(cells0).slice(17));
      expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

      expect(input1.value, 'to be', '03/10/2020');
      expect(viewSwitch1.textContent, 'to equal', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [9]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [9]);
      expect(getCellIndices(cells1, '.range'), 'to equal', mapIndices(cells1).slice(0, 9));
      expect(getCellIndices(cells1, '.focused'), 'to equal', [9]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });
  });
});
