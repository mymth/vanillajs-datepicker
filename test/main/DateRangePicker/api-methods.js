describe('DateRangePicker - API methods', function () {
  let clock;
  let elem;
  let input0;
  let input1;

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

  describe('setDates()', function () {
    let drp;
    let picker0;
    let picker1;
    let viewSwitch0;
    let viewSwitch1;
    let cells0;
    let cells1;

    it('changes the selected dates to given dates', function () {
      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates('2/11/2020', '2/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [19]);
      expect(getCellIndices(cells0, '.range'), 'to equal', [17, 18]);
      expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input1.value, 'to be', '02/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [19]);
      expect(getCellIndices(cells1, '.range'), 'to equal', [17, 18]);
      expect(getCellIndices(cells1, '.focused'), 'to equal', [19]);

      drp.setDates(new Date(2020, 4, 31), new Date(2020, 6, 5).getTime());

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 4, 31)]);
      expect(input0.value, 'to be', '05/31/2020');
      expect(viewSwitch0.textContent, 'to be', 'May 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [35]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [35]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells0, '.range'), 'to equal', [36, 37, 38, 39, 40, 41]);
      expect(getCellIndices(cells0, '.focused'), 'to equal', [35]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 6, 5)]);
      expect(input1.value, 'to be', '07/05/2020');
      expect(viewSwitch1.textContent, 'to be', 'July 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [7]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [7]);
      expect(getCellIndices(cells1, '.range'), 'to equal', [0, 1, 2, 3, 4, 5, 6]);
      expect(getCellIndices(cells1, '.focused'), 'to equal', [7]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('swapps star↔︎end dates if given start date > end date', function () {
      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates(new Date(2020, 6, 5).getTime(), new Date(2020, 4, 31));

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 4, 31)]);
      expect(input0.value, 'to be', '05/31/2020');
      expect(viewSwitch0.textContent, 'to be', 'May 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [35]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 6, 5)]);
      expect(input1.value, 'to be', '07/05/2020');
      expect(viewSwitch1.textContent, 'to be', 'July 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [7]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('ignores invalid dates and the same date as the current one and leaves that side untouched', function () {
      input0.value = '02/11/2020';
      input1.value = '02/14/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates('', '3/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input1.value, 'to be', '03/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [13]);

      let date0Str;
      let date0YM;
      let date0Indices;
      if (new Date(0).getDate() === 1) {
        date0Str = '01/01/1970';
        date0YM = 'January 1970';
        date0Indices = [4];
      } else {
        date0Str = '12/31/1969';
        date0YM = 'December 1969';
        date0Indices = [31];
      }

      drp.setDates(0, new Date(-1, 11, 31));

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(0)]);
      expect(input0.value, 'to be', date0Str);
      expect(viewSwitch0.textContent, 'to be', date0YM);
      expect(getCellIndices(cells0, '.selected'), 'to equal', date0Indices);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input1.value, 'to be', '03/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [13]);

      input1.value = 'foo';
      drp.setDates('2/11/2020', '3/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input1.value, 'to be', '03/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [13]);

      input0.value = 'foo';
      drp.setDates('2/11/2020', '2/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input1.value, 'to be', '02/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [19]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('sets the same date to both sides if called with one side only when range is not selected', function () {
      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates('2/11/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 1, 11)]);
      expect(input1.value, 'to be', '02/11/2020');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [16]);

      drp.destroy();
      input0.value = '';
      input1.value = '';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates(undefined, '3/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input0.value, 'to be', '03/14/2020');
      expect(viewSwitch0.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [13]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input1.value, 'to be', '03/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [13]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });

    it('clears both sides if {clear: true} is passed as the last effective argument instrad of a date', function () {
      input0.value = '02/11/2020';
      input1.value = '02/14/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      // start: clear + end: ineffective (unspecified)
      drp.setDates({clear: true});

      expect(drp.datepickers[0].dates, 'to equal', []);
      expect(input0.value, 'to be', '');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);

      expect(drp.datepickers[1].dates, 'to equal', []);
      expect(input1.value, 'to be', '');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

      drp.destroy();
      input0.value = '02/11/2020';
      input1.value = '02/14/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      // start: clear + end: ineffective (same date)
      drp.setDates({clear: true}, '2/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', []);
      expect(input0.value, 'to be', '');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);

      expect(drp.datepickers[1].dates, 'to equal', []);
      expect(input1.value, 'to be', '');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

      drp.destroy();
      input0.value = '02/11/2020';
      input1.value = '02/14/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      // start: valid date + end: clear
      drp.setDates('4/20/2020', {clear: true});

      expect(drp.datepickers[0].dates, 'to equal', []);
      expect(input0.value, 'to be', '');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);

      expect(drp.datepickers[1].dates, 'to equal', []);
      expect(input1.value, 'to be', '');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

      drp.destroy();
      input0.value = '02/11/2020';
      input1.value = '02/14/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      // start: ineffective (same date) + end: clear
      drp.setDates('2/11/2020', {clear: true});

      expect(drp.datepickers[0].dates, 'to equal', []);
      expect(input0.value, 'to be', '');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);

      expect(drp.datepickers[1].dates, 'to equal', []);
      expect(input1.value, 'to be', '');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

      drp.destroy();
    });

    it('sets the end date to both sides if {clear: true} is passed to start and an eefective date to end', function () {
      input0.value = '02/11/2020';
      input1.value = '02/11/2020';

      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates({clear: true}, '2/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input0.value, 'to be', '02/14/2020');
      expect(viewSwitch0.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [19]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input1.value, 'to be', '02/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'February 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [19]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
      ({drp, picker0, picker1} = createDRP(elem));
      viewSwitch0 = picker0.querySelector('.view-switch');
      viewSwitch1 = picker1.querySelector('.view-switch');
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates({clear: true}, '3/14/2020');

      expect(drp.datepickers[0].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input0.value, 'to be', '03/14/2020');
      expect(viewSwitch0.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [13]);

      expect(drp.datepickers[1].dates, 'to equal', [dateValue(2020, 2, 14)]);
      expect(input1.value, 'to be', '03/14/2020');
      expect(viewSwitch1.textContent, 'to be', 'March 2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [13]);

      drp.destroy();
      input0.value = '';
      input1.value = '';
    });
  });
});
