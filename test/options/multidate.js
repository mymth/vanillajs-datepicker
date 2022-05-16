describe('options - multi date', function () {
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

  describe('maxNumberOfDates', function () {
    it('specifies the muximum number of dates the datepicker accepts for the selection', function () {
      let {dp, picker} = createDP(input, {maxNumberOfDates: 2});

      dp.setDate('2/14/2020', '4/22/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14), dateValue(2020, 3, 22)]);
      expect(input.value, 'to be', '02/14/2020,04/22/2020');

      // the dates come later win
      dp.setDate('1/4/2020', '2/22/2020', '3/21/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 22), dateValue(2020, 2, 21)]);
      expect(input.value, 'to be', '02/22/2020,03/21/2020');

      // repeated dates are eliminated
      dp.setDate('4/22/2020', '7/14/2020', '5/5/2020', '7/14/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 6, 14), dateValue(2020, 4, 5)]);
      expect(input.value, 'to be', '07/14/2020,05/05/2020');

      dp.destroy();
      input.value = '';
      ({dp, picker} = createDP(input, {maxNumberOfDates: 3}));
      dp.show();

      let cells = getCells(picker);
      cells[19].click();
      cells[9].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14), dateValue(2020, 1, 4)]);
      expect(input.value, 'to be', '02/14/2020,02/04/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [9, 19]);
      // view date is changed co the last selected item
      expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

      input.value = '2/3/2020,2/22/2020';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 3), dateValue(2020, 1, 22)]);
      expect(input.value, 'to be', '02/03/2020,02/22/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [8, 27]);
      // view date is changed co the last item of the selection
      expect(getCellIndices(cells, '.focused'), 'to equal', [27]);

      dp.destroy();
      input.value = '';
      ({dp, picker} = createDP(input, {maxNumberOfDates: 3}));

      dp.setDate('2/14/2020', '4/22/2020', '3/21/2020');
      expect(dp.dates, 'to equal', [
        dateValue(2020, 1, 14),
        dateValue(2020, 3, 22),
        dateValue(2020, 2, 21),
      ]);
      expect(input.value, 'to be', '02/14/2020,04/22/2020,03/21/2020');

      dp.destroy();
      input.value = '';
      ({dp, picker} = createDP(input, {maxNumberOfDates: 3}));
      dp.show();

      getCells(picker)[1].click();
      getCells(picker)[40].click();
      cells = getCells(picker);
      cells[19].click();
      expect(dp.dates, 'to equal', [
        dateValue(2020, 0, 27),
        dateValue(2020, 1, 7),
        dateValue(2020, 1, 14),
      ]);
      expect(input.value, 'to be', '01/27/2020,02/07/2020,02/14/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [1, 12, 19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      input.value = '2/3/2020,2/22/2020';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 3), dateValue(2020, 1, 22)]);
      expect(input.value, 'to be', '02/03/2020,02/22/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [8, 27]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [27]);

      // setting initial dates does not cuase error
      // (issue #51)
      dp.destroy();
      input.value = '02/14/2020,04/22/2020,03/21/2020';
      ({dp, picker} = createDP(input, {maxNumberOfDates: 2}));

      expect(dp.dates, 'to equal', [
        dateValue(2020, 3, 22),
        dateValue(2020, 2, 21),
      ]);
      expect(input.value, 'to be', '04/22/2020,03/21/2020');

      dp.destroy();
      input.value = '';
    });

    it('makes the picker deselect the date when a selected date is clicked if value != 1', function () {
      const {dp, picker} = createDP(input, {maxNumberOfDates: 3});
      dp.show();

      let cells = getCells(picker);
      cells[19].click();
      cells[12].click();

      cells[19].click();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 7)]);
      expect(input.value, 'to be', '02/07/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [12]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [12]);

      cells[12].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getCellIndices(cells, '.selected'), 'to equal', []);
      // view date is changed to the default view date
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      dp.destroy();
      input.value = '';
    });

    it('makes the picker deselect the date when a selected date is clicked if value != 1', function () {
      const {dp, picker} = createDP(input, {maxNumberOfDates: 3});
      const cells = getCells(picker);
      dp.setDate('2/14/2020', '2/7/2020');
      dp.show();

      dp.setDate('2/14/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 7)]);
      expect(input.value, 'to be', '02/07/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [12]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [12]);

      dp.setDate('2/11/2020', '2/7/2020', '2/14/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/11/2020,02/14/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [16, 19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      dp.destroy();
      input.value = '';
    });

    it('setDate() replaces the selection instead of deselect/merg-ing if clear: true option is passed', function () {
      const {dp, picker} = createDP(input, {maxNumberOfDates: 3});
      const cells = getCells(picker);
      dp.setDate('2/14/2020', '2/7/2020');
      dp.show();

      dp.setDate('2/14/2020', {clear: true});
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/14/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      dp.setDate('2/11/2020', '2/7/2020', '2/14/2020', {clear: true});
      expect(dp.dates, 'to equal', [
        dateValue(2020, 1, 11),
        dateValue(2020, 1, 7),
        dateValue(2020, 1, 14),
      ]);
      expect(input.value, 'to be', '02/11/2020,02/07/2020,02/14/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [12, 16, 19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      dp.destroy();
      input.value = '';
    });

    it('setDate() does nothing if no dates or all-invalid dates are passed', function () {
      const dp = new Datepicker(input, {maxNumberOfDates: 3});
      dp.setDate('2/14/2020', '2/7/2020');
      dp.show();

      const origDates = [...dp.dates];
      dp.setDate([]);
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '02/14/2020,02/07/2020');

      dp.setDate();
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '02/14/2020,02/07/2020');

      dp.setDate([false, NaN], {clear: true});
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '02/14/2020,02/07/2020');

      dp.setDate('', null);
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '02/14/2020,02/07/2020');

      dp.destroy();
    });

    it('setDate() clears all selected dates if no dates + clear: true option are passed', function () {
      const dp = new Datepicker(input, {maxNumberOfDates: 3});
      dp.setDate('2/14/2020', '2/7/2020');
      dp.show();

      dp.setDate([], {clear: true});
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');

      dp.setDate('2/14/2020', '2/7/2020');

      dp.setDate({clear: true});
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');

      dp.destroy();
    });

    it('setDate() does nothing if all-invalid dates + clear: true option are passed', function () {
      const dp = new Datepicker(input, {maxNumberOfDates: 3});
      dp.setDate('2/14/2020', '2/7/2020');
      dp.show();

      const origDates = [...dp.dates];
      dp.setDate([false, NaN], {clear: true});
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '02/14/2020,02/07/2020');

      dp.setDate('', null, {clear: true});
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '02/14/2020,02/07/2020');

      dp.destroy();
    });

    it('does not apply deselecting behavior to update()', function () {
      const {dp, picker} = createDP(input, {maxNumberOfDates: 3});
      const cells = getCells(picker);
      dp.setDate('2/14/2020', '2/7/2020');
      dp.show();

      input.value = '2/14/2020';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/14/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      input.value = '2/11/2020,2/7/2020,2/14/2020';
      dp.update();
      expect(dp.dates, 'to equal', [
        dateValue(2020, 1, 11),
        dateValue(2020, 1, 7),
        dateValue(2020, 1, 14),
      ]);
      expect(input.value, 'to be', '02/11/2020,02/07/2020,02/14/2020');
      expect(getCellIndices(cells, '.selected'), 'to equal', [12, 16, 19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);

      dp.destroy();
      input.value = '';
    });

    it('makes getDate() return array of dates if value != 1', function () {
      const dp = new Datepicker(input, {maxNumberOfDates: 3});

      expect(dp.getDate(), 'to equal', []);
      expect(dp.getDate('yyyy-mm-dd'), 'to equal', []);

      dp.setDate('2/11/2020', '2/7/2020', '2/14/2020');
      expect(dp.getDate(), 'to equal', [new Date(2020, 1, 11), new Date(2020, 1, 7), new Date(2020, 1, 14)]);
      expect(dp.getDate('yyyy-mm-dd'), 'to equal', ['2020-02-11', '2020-02-07', '2020-02-14']);

      dp.setDate('2/7/2020', {clear: true});
      expect(dp.getDate(), 'to equal', [new Date(2020, 1, 7)]);
      expect(dp.getDate('d M, yyyy'), 'to equal', ['7 Feb, 2020']);

      const changeDateListener = (e) => {
        evt = e;
      };
      let evt;
      input.addEventListener('changeDate', changeDateListener);

      dp.setDate('7/4/2020', '7/14/2020');
      expect(evt.detail.date, 'to equal', dp.getDate());

      input.removeEventListener('changeDate', changeDateListener);
      dp.destroy();
      input.value = '';
    });

    it('value 0 is considered unlimited', function () {
      if (window.navigator.userAgent.indexOf('Edge') > -1) {
        this.timeout(5000);
      }

      const max = new Date(2100, 0, 1).getTime();
      const generateDates = (dates, length, index = 0) => {
        const date = dateUtils.stripTime(Math.floor(Math.random() * max));
        if (dates.includes(date)) {
          return generateDates(dates, length, index);
        } else {
          dates.push(date);
          return index <= length
            ? generateDates(dates, length, index + 1)
            : dates;
        }
      };
      const dates = generateDates([], 3000);

      const dp = new Datepicker(input, {maxNumberOfDates: 0});
      dp.setDate(dates);
      expect(dp.dates, 'to equal', dates);

      dp.destroy();
      input.value = '';
    });

    it('can be updated with setOptions()', function () {
      const dp = new Datepicker(input);
      dp.setOptions({maxNumberOfDates: 3});

      dp.setDate('2/11/2020', '2/7/2020', '2/14/2020');
      expect(dp.dates, 'to equal', [
        dateValue(2020, 1, 11),
        dateValue(2020, 1, 7),
        dateValue(2020, 1, 14),
      ]);

      dp.setOptions({maxNumberOfDates: 1});
      dp.setDate('7/4/2020', '4/22/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
      expect(dp.getDate(), 'to be a date');

      dp.destroy();
      input.value = '';
    });
  });

  describe('dateDelimiter', function () {
    it('specifies the date delemiter for the input string', function () {
      const dp = new Datepicker(input, {maxNumberOfDates: 3, dateDelimiter: '|'});

      dp.setDate('2/14/2020', '4/22/2020');
      expect(input.value, 'to be', '02/14/2020|04/22/2020');

      input.value = '2/11/2020|2/7/2020|2/14/2020';
      dp.update();
      expect(dp.dates, 'to equal', [
        dateValue(2020, 1, 11),
        dateValue(2020, 1, 7),
        dateValue(2020, 1, 14),
      ]);

      dp.destroy();
      input.value = '';
    });

    it('can be updated with setOptions()', function () {
      const dp = new Datepicker(input, {maxNumberOfDates: 3});
      dp.setOptions({dateDelimiter: '_'});
      dp.setDate('2/11/2020', '2/7/2020', '2/14/2020');

      dp.setOptions({dateDelimiter: ' - '});
      expect(input.value, 'to be', '02/11/2020 - 02/07/2020 - 02/14/2020');

      dp.setOptions({dateDelimiter: ','});
      expect(input.value, 'to be', '02/11/2020,02/07/2020,02/14/2020');

      dp.destroy();
      input.value = '';
    });
  });
});
