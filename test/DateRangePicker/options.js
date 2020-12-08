describe('DateRangePicker - options', function () {
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

  describe('allowOneSidedRange', function () {
    it('disables the requirement for both sides of range to be set/unset', function () {
      let {drp, picker0, picker1} = createDRP(elem, {allowOneSidedRange: true});
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

      // by setDates()
      ({drp, picker0, picker1} = createDRP(elem, {allowOneSidedRange: true}));
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      drp.setDates('02/11/2020');

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), undefined]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
      expect(input1.value, 'to be', '');
      expect(filterCells(cells1, '.selected'), 'to equal', []);

      drp.setDates(undefined, '02/20/2020');

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 1, 20)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
      expect(input1.value, 'to be', '02/20/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[25]]);

      drp.setDates({clear: true});

      expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 20)]);
      expect(input0.value, 'to be', '');
      expect(filterCells(cells0, '.selected'), 'to equal', []);
      expect(input1.value, 'to be', '02/20/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[25]]);

      drp.setDates('02/11/2020', {clear: true});

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), undefined]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(filterCells(cells0, '.selected'), 'to equal', [cells0[16]]);
      expect(input1.value, 'to be', '');
      expect(filterCells(cells1, '.selected'), 'to equal', []);

      drp.setDates({clear: true}, '02/20/2020');

      expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 20)]);
      expect(input0.value, 'to be', '');
      expect(filterCells(cells0, '.selected'), 'to equal', []);
      expect(input1.value, 'to be', '02/20/2020');
      expect(filterCells(cells1, '.selected'), 'to equal', [cells1[25]]);

      drp.setDates(undefined, {clear: true});

      expect(drp.dates, 'to equal', [undefined, undefined]);
      expect(input0.value, 'to be', '');
      expect(filterCells(cells0, '.selected'), 'to equal', []);
      expect(input1.value, 'to be', '');
      expect(filterCells(cells1, '.selected'), 'to equal', []);

      drp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const drp = new DateRangePicker(elem);
      drp.setOptions({allowOneSidedRange: true});

      input0.value = '02/11/2020';
      simulant.fire(input0, 'keydown', {key: 'Enter'});
      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), undefined]);

      drp.setDates({clear: true}, '02/11/2020');
      expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 11)]);

      drp.setOptions({allowOneSidedRange: false});

      input1.value = '02/20/2020';
      simulant.fire(input1, 'keydown', {key: 'Enter'});
      expect(drp.dates, 'to equal', [dateValue(2020, 1, 20), dateValue(2020, 1, 20)]);

      drp.setDates({clear: true});
      expect(drp.dates, 'to equal', [undefined, undefined]);

      drp.destroy();
    });
  });
});
