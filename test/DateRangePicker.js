describe('DateRangePicker', function () {
  let clock;
  let elem;
  let input0;
  let input1;

  before(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
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
    testContainer.removeChild(elem);
  });

  it('input elements\' values are used for the initial dates', function () {
    input0.value = '04/20/2020';
    input1.value = '04/22/2020';

    const drp = new DateRangePicker(elem);
    expect(drp.dates, 'to equal', [dateValue(2020, 3, 20), dateValue(2020, 3, 22)]);

    drp.destroy();
    input0.value = '';
    input1.value = '';
  });

  it('the pickers are hidden at start', function () {
    const {drp, picker0, picker1} = createDRP(elem);

    expect(isVisible(picker0), 'to be false');
    expect(isVisible(picker1), 'to be false');

    drp.destroy();
  });

  it('the pickers becomes visible when the input element get focus and invisivle when losing focus', function () {
    const {drp, picker0, picker1} = createDRP(elem);

    input0.focus();
    expect(isVisible(picker0), 'to be true');

    simulant.fire(input0, 'keydown', {key: 'Tab'});
    expect(isVisible(picker0), 'to be false');

    input1.focus();
    expect(isVisible(picker1), 'to be true');

    simulant.fire(input1, 'keydown', {key: 'Tab'});
    expect(isVisible(picker1), 'to be false');

    drp.destroy();
  });

  describe('getDates()', function () {
    it('returns an array of the Date objects of selected dates', function () {
      input0.value = '04/20/2020';
      input1.value = '04/22/2020';

      const drp = new DateRangePicker(elem);
      expect(drp.getDates(), 'to equal', [
        new Date(dateValue(2020, 3, 20)),
        new Date(dateValue(2020, 3, 22)),
      ]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('returns a formatted date stirngs of selected dates if the format is specified', function () {
      input0.value = '04/20/2020';
      input1.value = '04/22/2020';

      const drp = new DateRangePicker(elem);
      expect(drp.getDates('yyyy-mm-dd'), 'to equal', ['2020-04-20', '2020-04-22']);
      expect(drp.getDates('d M, yy'), 'to equal', ['20 Apr, 20', '22 Apr, 20']);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('uses undefined instead of Date object if date is not selected', function () {
      const drp = new DateRangePicker(elem);
      expect(drp.getDates(), 'to equal', [undefined, undefined]);
      expect(drp.getDates('yyyy-mm-dd'), 'to equal', [undefined, undefined]);

      drp.destroy();
    });
  });

  describe('date selection', function () {
    let drp;
    let picker0;
    let picker1;
    let viewSwitch0;
    let viewSwitch1;
    let nextBtn0;
    let nextBtn1;
    let cells0;
    let cells1;

    it('same date is set to both sides if a date is selected on one side when selections are none', function () {
      let selectDate = dateValue(2020, 1, 11);

      ({drp, picker0, picker1} = createDRP(elem));
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.datepickers[0].show();
      cells0[16].click();

      expect(drp.dates, 'to equal', [selectDate, selectDate]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range'), 'to equal', []);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

      expect(input1.value, 'to be', '02/11/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range'), 'to equal', []);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[16]]);

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
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range'), 'to equal', []);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

      expect(input1.value, 'to be', '02/11/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range'), 'to equal', []);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[16]]);

      drp.destroy();
      input0.value = '';
      input1.value = '';

      // other month than default view date's
      // (issue #17, #19)
      let partsClasses = ['.view-switch', '.next-btn'];
      selectDate = dateValue(2020, 2, 10);

      ({drp, picker0, picker1} = createDRP(elem));
      [viewSwitch0, nextBtn0] = getParts(picker0, partsClasses);
      [viewSwitch1, nextBtn1] = getParts(picker1, partsClasses);

      drp.datepickers[0].show();
      nextBtn0.click();
      getCells(picker0)[9].click();

      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      expect(drp.dates, 'to equal', [selectDate, selectDate]);
      expect(input0.value, 'to be', '03/10/2020');
      expect(viewSwitch0.textContent, 'to equal', 'March 2020');
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[9]]);
      expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[9]]);
      expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[9]]);
      expect(filterCells(cells0, '.range'), 'to equal', []);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[9]]);

      expect(input1.value, 'to be', '03/10/2020');
      expect(viewSwitch1.textContent, 'to equal', 'March 2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[9]]);
      expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[9]]);
      expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[9]]);
      expect(filterCells(cells1, '.range'), 'to equal', []);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[9]]);

      drp.datepickers[1].show();
      nextBtn1.click();
      expect(viewSwitch1.textContent, 'to equal', 'April 2020');

      drp.destroy();
      input0.value = '';
      input1.value = '';

      ({drp, picker0, picker1} = createDRP(elem));
      [viewSwitch0, nextBtn0] = getParts(picker0, partsClasses);
      [viewSwitch1, nextBtn1] = getParts(picker1, partsClasses);

      drp.datepickers[1].show();
      nextBtn1.click();
      getCells(picker1)[9].click();

      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      expect(drp.dates, 'to equal', [selectDate, selectDate]);
      expect(input0.value, 'to be', '03/10/2020');
      expect(viewSwitch0.textContent, 'to equal', 'March 2020');
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[9]]);
      expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[9]]);
      expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[9]]);
      expect(filterCells(cells0, '.range'), 'to equal', []);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[9]]);

      expect(input1.value, 'to be', '03/10/2020');
      expect(viewSwitch1.textContent, 'to equal', 'March 2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[9]]);
      expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[9]]);
      expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[9]]);
      expect(filterCells(cells1, '.range'), 'to equal', []);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[9]]);

      drp.datepickers[0].show();
      nextBtn0.click();
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
      expect(filterCells(cells0, '.selected'), 'to equal', []);
      expect(filterCells(cells0, '.range-start'), 'to equal', []);
      expect(filterCells(cells0, '.range-end'), 'to equal', []);
      expect(filterCells(cells0, '.range'), 'to equal', []);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[19]]);

      expect(input1.value, 'to be', '');
      expect(filterCells(cells1, '.selected'), 'to equal', []);
      expect(filterCells(cells1, '.range-start'), 'to equal', []);
      expect(filterCells(cells1, '.range-end'), 'to equal', []);
      expect(filterCells(cells1, '.range'), 'to equal', []);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[19]]);

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
      expect(filterCells(cells0, '.selected'), 'to equal', []);
      expect(filterCells(cells0, '.range-start'), 'to equal', []);
      expect(filterCells(cells0, '.range-end'), 'to equal', []);
      expect(filterCells(cells0, '.range'), 'to equal', []);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[19]]);

      expect(input1.value, 'to be', '');
      expect(filterCells(cells1, '.selected'), 'to equal', []);
      expect(filterCells(cells1, '.range-start'), 'to equal', []);
      expect(filterCells(cells1, '.range-end'), 'to equal', []);
      expect(filterCells(cells1, '.range'), 'to equal', []);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[19]]);

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
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[20]]);
      expect(filterCells(cells0, '.range'), 'to equal', [cells0[17], cells0[18], cells0[19]]);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

      expect(input1.value, 'to be', '02/15/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[20]]);
      expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[20]]);
      expect(filterCells(cells1, '.range'), 'to equal', [cells1[17], cells1[18], cells1[19]]);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[20]]);

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
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[12]]);
      expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[12]]);
      expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[16]]);
      expect(filterCells(cells0, '.range'), 'to equal', [cells0[13], cells0[14], cells0[15]]);
      expect(filterCells(cells0, '.focused'), 'to equal', [cells0[12]]);

      expect(input1.value, 'to be', '02/11/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[12]]);
      expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[16]]);
      expect(filterCells(cells1, '.range'), 'to equal', [cells1[13], cells1[14], cells1[15]]);
      expect(filterCells(cells1, '.focused'), 'to equal', [cells1[16]]);

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
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[30]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[30]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[39]]);
        expect(filterCells(cells0, '.range'), 'to equal', cells0.slice(31, 39));

        expect(viewSwitch1.textContent, 'to be', 'March 2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[4]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', []);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[4]]);
        expect(filterCells(cells1, '.range'), 'to equal', cells1.slice(0, 4));

        drp.datepickers[1].show();
        picker1.querySelector('.next-btn').click();
        cells1 = getCells(picker1);
        cells1[24].click();

        expect(drp.dates, 'to equal', [dateValue(2020, 1, 25), dateValue(2020, 3, 22)]);
        expect(input0.value, 'to be', '02/25/2020');
        expect(input1.value, 'to be', '04/22/2020');

        expect(viewSwitch0.textContent, 'to be', 'February 2020');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[30]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[30]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', []);
        expect(filterCells(cells0, '.range'), 'to equal', cells0.slice(31));

        expect(viewSwitch1.textContent, 'to be', 'April 2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[24]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', []);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[24]]);
        expect(filterCells(cells1, '.range'), 'to equal', cells1.slice(0, 24));

        input0.value = '02/14/1998';
        simulant.fire(input0, 'keydown', {key: 'Enter'});
        cells0 = getCells(picker0);

        expect(drp.dates, 'to equal', [dateValue(1998, 1, 14), dateValue(2020, 3, 22)]);
        expect(input0.value, 'to be', '02/14/1998');
        expect(input1.value, 'to be', '04/22/2020');

        expect(viewSwitch0.textContent, 'to be', 'February 1998');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[13]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[13]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', []);
        expect(filterCells(cells0, '.range'), 'to equal', cells0.slice(14));

        expect(viewSwitch1.textContent, 'to be', 'April 2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[24]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', []);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[24]]);
        expect(filterCells(cells1, '.range'), 'to equal', cells1.slice(0, 24));

        drp.datepickers[0].show();

        // months view
        viewSwitch0.click();
        cells0 = getCells(picker0);
        expect(viewSwitch0.textContent, 'to be', '1998');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[1]]);

        viewSwitch1.click();
        cells1 = getCells(picker1);
        expect(viewSwitch1.textContent, 'to be', '2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[3]]);

        // years view
        viewSwitch0.click();
        cells0 = getCells(picker0);
        expect(viewSwitch0.textContent, 'to be', '1990-1999');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[9]]);

        viewSwitch1.click();
        cells1 = getCells(picker1);
        expect(viewSwitch1.textContent, 'to be', '2020-2029');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[1]]);

        // decades view
        viewSwitch0.click();
        cells0 = getCells(picker0);
        expect(viewSwitch0.textContent, 'to be', '1900-1990');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[10]]);

        viewSwitch1.click();
        cells1 = getCells(picker1);
        expect(viewSwitch1.textContent, 'to be', '2000-2090');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[3]]);

        drp.destroy();
        input0.value = '';
        input1.value = '';
      });

      it('dates are swapped if a date later than the 2nd picker\'s selection is seleted on the 1st picker', function () {
        ({drp, picker0, picker1} = createDRP(elem));
        [viewSwitch0, nextBtn0] = getParts(picker0, ['.view-switch', '.next-btn']);
        viewSwitch1 = picker1.querySelector('.view-switch');

        drp.datepickers[1].show();
        getCells(picker1)[16].click();
        drp.datepickers[1].hide();
        drp.datepickers[0].show();
        expect(viewSwitch0.textContent, 'to equal', 'February 2020');

        nextBtn0.click();
        expect(viewSwitch0.textContent, 'to equal', 'March 2020');

        getCells(picker0)[9].click();
        cells0 = getCells(picker0);
        cells1 = getCells(picker1);

        expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 2, 10)]);
        expect(input0.value, 'to be', '02/11/2020');
        expect(viewSwitch0.textContent, 'to equal', 'February 2020');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', []);
        expect(filterCells(cells0, '.range'), 'to equal', cells0.slice(17));
        expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

        expect(input1.value, 'to be', '03/10/2020');
        expect(viewSwitch1.textContent, 'to equal', 'March 2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[9]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', []);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[9]]);
        expect(filterCells(cells1, '.range'), 'to equal', cells1.slice(0, 9));
        expect(filterCells(cells1, '.focused'), 'to equal', [cells1[9]]);

        drp.destroy();
        input0.value = '';
        input1.value = '';
      });

      it('dates are swapped if a date earlier than the 1st picker\'s selection is seleted on the 2nd picker', function () {
        let prevBtn1;

        ({drp, picker0, picker1} = createDRP(elem));
        [viewSwitch0, nextBtn0] = getParts(picker0, ['.view-switch', '.next-btn']);
        [viewSwitch1, prevBtn1] = getParts(picker1, ['.view-switch', '.prev-btn']);

        drp.datepickers[0].show();
        nextBtn0.click();
        getCells(picker0)[9].click();
        drp.datepickers[0].hide();
        drp.datepickers[1].show();
        expect(viewSwitch1.textContent, 'to equal', 'March 2020');

        prevBtn1.click();
        expect(viewSwitch1.textContent, 'to equal', 'February 2020');

        getCells(picker1)[16].click();
        cells0 = getCells(picker0);
        cells1 = getCells(picker1);

        expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 2, 10)]);
        expect(input0.value, 'to be', '02/11/2020');
        expect(viewSwitch0.textContent, 'to equal', 'February 2020');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', []);
        expect(filterCells(cells0, '.range'), 'to equal', cells0.slice(17));
        expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

        expect(input1.value, 'to be', '03/10/2020');
        expect(viewSwitch1.textContent, 'to equal', 'March 2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[9]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', []);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[9]]);
        expect(filterCells(cells1, '.range'), 'to equal', cells1.slice(0, 9));
        expect(filterCells(cells1, '.focused'), 'to equal', [cells1[9]]);

        drp.destroy();
        input0.value = '';
        input1.value = '';
      });
    });
  });

  describe('options', function () {
    describe('allowOneSidedRange', function () {
      it('disables the requirement for both sides of range to be set/unset', function () {
        const {drp, picker0, picker1} = createDRP(elem, {allowOneSidedRange: true});
        let cells0 = getCells(picker0);
        let cells1 = getCells(picker1);

        drp.datepickers[0].show();
        cells0[16].click();

        expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), undefined]);
        expect(drp.getDates(), 'to equal', [new Date(drp.dates[0]), undefined]);
        expect(input0.value, 'to be', '02/11/2020');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', []);
        expect(filterCells(cells0, '.range'), 'to equal', []);
        expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

        expect(input1.value, 'to be', '');
        expect(filterCells(cells1, '.selected'), 'to equal', []);
        expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[16]]);
        expect(filterCells(cells1, '.range-end'), 'to equal', []);
        expect(filterCells(cells1, '.range'), 'to equal', []);
        expect(filterCells(cells1, '.focused'), 'to equal', [cells1[19]]);

        drp.datepickers[1].show();
        cells1[25].click();

        expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 1, 20)]);
        expect(drp.getDates(), 'to equal', drp.dates.map(date => new Date(date)));
        expect(input0.value, 'to be', '02/11/2020');
        expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-start'), 'to equal', [cells0[16]]);
        expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[25]]);
        expect(filterCells(cells0, '.range'), 'to equal', cells0.slice(17, 25));
        expect(filterCells(cells0, '.focused'), 'to equal', [cells0[16]]);

        expect(input1.value, 'to be', '02/20/2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[25]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', [cells1[16]]);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[25]]);
        expect(filterCells(cells1, '.range'), 'to equal', cells1.slice(17, 25));
        expect(filterCells(cells1, '.focused'), 'to equal', [cells1[25]]);

        simulant.fire(input0, 'keydown', {key: 'Escape'});
        input0.value = '';
        simulant.fire(input0, 'keydown', {key: 'Enter'});

        expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 20)]);
        expect(drp.getDates(), 'to equal', [undefined, new Date(drp.dates[1])]);
        expect(input0.value, 'to be', '');
        expect(filterCells(cells0, '.selected'), 'to equal', []);
        expect(filterCells(cells0, '.range-start'), 'to equal', []);
        expect(filterCells(cells0, '.range-end'), 'to equal', [cells0[25]]);
        expect(filterCells(cells0, '.range'), 'to equal', []);
        expect(filterCells(cells0, '.focused'), 'to equal', [cells0[19]]);

        expect(input1.value, 'to be', '02/20/2020');
        expect(filterCells(cells1, '.selected'), 'to equal', [cells1[25]]);
        expect(filterCells(cells1, '.range-start'), 'to equal', []);
        expect(filterCells(cells1, '.range-end'), 'to equal', [cells1[25]]);
        expect(filterCells(cells1, '.range'), 'to equal', []);
        expect(filterCells(cells1, '.focused'), 'to equal', [cells1[25]]);

        drp.destroy();
        input0.value = '';
        input1.value = '';
      });

      it('can be updated with setOptions()', function () {
        const drp = new DateRangePicker(elem);
        drp.setOptions({allowOneSidedRange: true});

        input0.value = '02/11/2020';
        simulant.fire(input0, 'keydown', {key: 'Enter'});
        expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), undefined]);

        input1.value = '02/20/2020';
        simulant.fire(input1, 'keydown', {key: 'Enter'});
        drp.setOptions({allowOneSidedRange: false});

        input0.value = '';
        simulant.fire(input0, 'keydown', {key: 'Enter'});
        expect(drp.dates, 'to equal', [undefined, undefined]);

        drp.destroy();
      });
    });
  });
});
