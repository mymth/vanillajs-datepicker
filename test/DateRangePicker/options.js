describe('DateRangePicker - options', function () {
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
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells0, '.range'), 'to equal', []);
      expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

      expect(input1.value, 'to be', '');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', []);
      expect(getCellIndices(cells1, '.range'), 'to equal', []);
      expect(getCellIndices(cells1, '.focused'), 'to equal', [19]);

      drp.datepickers[1].show();
      cells1[25].click();

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 1, 20)]);
      expect(drp.getDates(), 'to equal', drp.dates.map(date => new Date(date)));
      expect(input0.value, 'to be', '02/11/2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [25]);
      expect(getCellIndices(cells0, '.range'), 'to equal', mapIndices(cells0).slice(17, 25));
      expect(getCellIndices(cells0, '.focused'), 'to equal', [16]);

      expect(input1.value, 'to be', '02/20/2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [25]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [16]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [25]);
      expect(getCellIndices(cells1, '.range'), 'to equal', mapIndices(cells1).slice(17, 25));
      expect(getCellIndices(cells1, '.focused'), 'to equal', [25]);

      simulant.fire(input0, 'keydown', {key: 'Escape'});
      input0.value = '';
      simulant.fire(input0, 'keydown', {key: 'Enter'});

      expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 20)]);
      expect(drp.getDates(), 'to equal', [undefined, new Date(drp.dates[1])]);
      expect(input0.value, 'to be', '');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [25]);
      expect(getCellIndices(cells0, '.range'), 'to equal', []);
      expect(getCellIndices(cells0, '.focused'), 'to equal', [19]);

      expect(input1.value, 'to be', '02/20/2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [25]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [25]);
      expect(getCellIndices(cells1, '.range'), 'to equal', []);
      expect(getCellIndices(cells1, '.focused'), 'to equal', [25]);

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
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(input1.value, 'to be', '');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

      drp.setDates(undefined, '02/20/2020');

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), dateValue(2020, 1, 20)]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(input1.value, 'to be', '02/20/2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [25]);

      drp.setDates({clear: true});

      expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 20)]);
      expect(input0.value, 'to be', '');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);
      expect(input1.value, 'to be', '02/20/2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [25]);

      drp.setDates('02/11/2020', {clear: true});

      expect(drp.dates, 'to equal', [dateValue(2020, 1, 11), undefined]);
      expect(input0.value, 'to be', '02/11/2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [16]);
      expect(input1.value, 'to be', '');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

      drp.setDates({clear: true}, '02/20/2020');

      expect(drp.dates, 'to equal', [undefined, dateValue(2020, 1, 20)]);
      expect(input0.value, 'to be', '');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);
      expect(input1.value, 'to be', '02/20/2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [25]);

      drp.setDates(undefined, {clear: true});

      expect(drp.dates, 'to equal', [undefined, undefined]);
      expect(input0.value, 'to be', '');
      expect(getCellIndices(cells0, '.selected'), 'to equal', []);
      expect(input1.value, 'to be', '');
      expect(getCellIndices(cells1, '.selected'), 'to equal', []);

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

  describe('pickLevel', function () {
    it('changes the span of range selection to 1st of a month → last day of a month when 1', function () {
      input0.value = '2/14/2020';
      input1.value = '2/14/2020';

      const {drp, picker0, picker1} = createDRP(elem, {pickLevel: 1});
      const viewSwitch0 = picker0.querySelector('.view-switch');
      const viewSwitch1 = picker1.querySelector('.view-switch');
      let cells0 = getCells(picker0);
      let cells1 = getCells(picker1);

      input0.focus();
      expect(drp.dates, 'to equal', [dateValue(2020, 1, 1), dateValue(2020, 1, 29)]);
      expect(input0.value, 'to be', '02/01/2020');
      expect(viewSwitch0.textContent, 'to be', '2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [1]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [1]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [1]);
      expect(getCellIndices(cells0, '.range'), 'to equal', []);
      expect(getCellIndices(cells0, '.focused'), 'to equal', [1]);

      input1.focus();
      expect(input1.value, 'to be', '02/29/2020');
      expect(viewSwitch1.textContent, 'to be', '2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range'), 'to equal', []);
      expect(getCellIndices(cells1, '.focused'), 'to equal', [1]);

      // mouse operation
      cells0[0].click();
      cells1[6].click();

      expect(drp.dates, 'to equal', [dateValue(2020, 0, 1), dateValue(2020, 6, 31)]);
      expect(input0.value, 'to be', '01/01/2020');
      expect(viewSwitch0.textContent, 'to be', '2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [0]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [0]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [6]);

      input1.focus();
      expect(input1.value, 'to be', '07/31/2020');
      expect(viewSwitch1.textContent, 'to be', '2020');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [6]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [0]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [6]);

      // api call
      drp.setDates('2/14/2021', '3/14/2020');

      expect(drp.dates, 'to equal', [dateValue(2020, 2, 1), dateValue(2021, 1, 28)]);
      expect(input0.value, 'to be', '03/01/2020');
      expect(viewSwitch0.textContent, 'to be', '2020');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [2]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [2]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);

      input1.focus();
      expect(input1.value, 'to be', '02/28/2021');
      expect(viewSwitch1.textContent, 'to be', '2021');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', []);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [1]);

      drp.destroy();
    });

    it('changes the span of range selection to Jan 1st of a month → Dec 31st of a month when 2', function () {
      input0.value = '2/14/2020';
      input1.value = '2/14/2020';

      const {drp, picker0, picker1} = createDRP(elem, {pickLevel: 2});
      const viewSwitch0 = picker0.querySelector('.view-switch');
      const viewSwitch1 = picker1.querySelector('.view-switch');
      let cells0 = getCells(picker0);
      let cells1 = getCells(picker1);

      input0.focus();
      expect(drp.dates, 'to equal', [dateValue(2020, 0, 1), dateValue(2020, 11, 31)]);
      expect(input0.value, 'to be', '01/01/2020');
      expect(viewSwitch0.textContent, 'to be', '2020-2029');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [1]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [1]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [1]);
      expect(getCellIndices(cells0, '.range'), 'to equal', []);
      expect(getCellIndices(cells0, '.focused'), 'to equal', [1]);

      input1.focus();
      expect(input1.value, 'to be', '12/31/2020');
      expect(viewSwitch1.textContent, 'to be', '2020-2029');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [1]);
      expect(getCellIndices(cells1, '.range'), 'to equal', []);
      expect(getCellIndices(cells1, '.focused'), 'to equal', [1]);

      // mouse operation
      cells0[0].click();
      cells1[3].click();

      expect(drp.dates, 'to equal', [dateValue(2019, 0, 1), dateValue(2022, 11, 31)]);
      expect(input0.value, 'to be', '01/01/2019');
      expect(viewSwitch0.textContent, 'to be', '2010-2019');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [10]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [10]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', []);

      input1.focus();
      expect(input1.value, 'to be', '12/31/2022');
      expect(viewSwitch1.textContent, 'to be', '2020-2029');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [3]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [0]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [3]);

      // api call
      drp.setDates('2/14/2025', '3/14/2021');

      expect(drp.dates, 'to equal', [dateValue(2021, 0, 1), dateValue(2025, 11, 31)]);
      expect(input0.value, 'to be', '01/01/2021');
      expect(viewSwitch0.textContent, 'to be', '2020-2029');
      expect(getCellIndices(cells0, '.selected'), 'to equal', [2]);
      expect(getCellIndices(cells0, '.range-start'), 'to equal', [2]);
      expect(getCellIndices(cells0, '.range-end'), 'to equal', [6]);

      input1.focus();
      expect(input1.value, 'to be', '12/31/2025');
      expect(viewSwitch1.textContent, 'to be', '2020-2029');
      expect(getCellIndices(cells1, '.selected'), 'to equal', [6]);
      expect(getCellIndices(cells1, '.range-start'), 'to equal', [2]);
      expect(getCellIndices(cells1, '.range-end'), 'to equal', [6]);

      drp.destroy();
    });
  });

  // for issue #54
  describe('maxDate/minDate', function () {
    it('does not prevent selecting start/end of available range when pickLevel > 0 and given date != the satar/end of month/year', function () {
      let {drp, picker0, picker1} = createDRP(elem, {pickLevel: 1, minDate: '2/14/2020', maxDate: '7/14/2020'});
      let cells0 = getCells(picker0);
      let cells1 = getCells(picker1);

      input0.focus();
      cells0[1].click();
      input1.focus();
      cells1[6].click();
      expect(drp.dates, 'to equal', [dateValue(2020, 1, 1), dateValue(2020, 6, 31)]);

      drp.destroy();

      ({drp, picker0, picker1} = createDRP(elem, {pickLevel: 2, minDate: '2/14/2020', maxDate: '2/14/2023'}));
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      input0.focus();
      cells0[2].click();
      input1.focus();
      cells1[4].click();
      expect(drp.dates, 'to equal', [dateValue(2020, 0, 1), dateValue(2023, 11, 31)]);

      drp.destroy();
    });
  });

  describe('datesDisabled', function () {
    it('disables months or years when pickLevel > 0 and given date != the satar/end of month/year', function () {
      let {drp, picker0, picker1} = createDRP(elem, {pickLevel: 1, datesDisabled: ['2/14/2020', '7/14/2020']});
      let cells0 = getCells(picker0);
      let cells1 = getCells(picker1);

      input0.focus();
      cells0[1].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells1[6].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells0[2].click();
      expect(drp.dates, 'to equal', [dateValue(2020, 2, 1), dateValue(2020, 2, 31)]);

      drp.setDates({clear: true});

      input1.focus();
      cells0[1].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells1[6].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells1[7].click();
      expect(drp.dates, 'to equal', [dateValue(2020, 7, 1), dateValue(2020, 7, 31)]);

      drp.setDates({clear: true});
      drp.destroy();

      ({drp, picker0, picker1} = createDRP(elem, {pickLevel: 2, datesDisabled: ['2/14/2021', '2/14/2024']}));
      cells0 = getCells(picker0);
      cells1 = getCells(picker1);

      input0.focus();
      cells0[2].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells1[5].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells0[1].click();
      expect(drp.dates, 'to equal', [dateValue(2020, 0, 1), dateValue(2020, 11, 31)]);

      drp.setDates({clear: true});

      input1.focus();
      cells0[2].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells1[5].click();
      expect(drp.dates, 'to equal', [undefined, undefined]);
      cells1[6].click();
      expect(drp.dates, 'to equal', [dateValue(2025, 0, 1), dateValue(2025, 11, 31)]);

      drp.destroy();
    });

    it('passes rangeEnd flag to callback as well as date and viewId', function () {
      let args = [];
      const callback = (date, viewId, rangeEnd) => {
        args.push([date.getTime(), viewId, rangeEnd]);
        return date.getMonth() === 0 && viewId < 2
          || date.getDate() % 20 === 1 && viewId === 0;
      };
      const {drp, picker0, picker1} = createDRP(elem, {datesDisabled: callback});
      const viewSwitch0 = getViewSwitch(picker0);
      const viewSwitch1 = getViewSwitch(picker1);
      let cells0 = getCells(picker0);
      let cells1 = getCells(picker1);

      // both month === 0 and day % 10 === 1 are applied
      // Jan 26-31, Feb 1, 21, and Mar 1 are disabled
      expect(getCellIndices(cells0, '.disabled'), 'to equal', [0, 1, 2, 3, 4, 5, 6, 26, 35]);
      expect(getCellIndices(cells1, '.disabled'), 'to equal', [0, 1, 2, 3, 4, 5, 6, 26, 35]);
      expect(args[0], 'to equal', [dateValue(2020, 0, 26), 0, false]);
      expect(args[41], 'to equal', [dateValue(2020, 2, 7), 0, false]);
      expect(args[42], 'to equal', [dateValue(2020, 0, 26), 0, true]);
      expect(args[83], 'to equal', [dateValue(2020, 2, 7), 0, true]);

      // go to months view
      // on start date
      input0.focus();
      args = [];
      viewSwitch0.click();
      cells0 = getCells(picker0);

      // month === 0 is applied but day % 10 === 1 isn't
      // only Jan is disabled
      expect(getCellIndices(cells0, '.disabled'), 'to equal', [0]);
      expect(args[0], 'to equal', [dateValue(2020, 0, 1), 1, false]);
      expect(args[11], 'to equal', [dateValue(2020, 11, 1), 1, false]);

      // on end date
      input1.focus();
      args = [];
      viewSwitch1.click();
      cells1 = getCells(picker1);

      expect(getCellIndices(cells1, '.disabled'), 'to equal', [0]);
      expect(args[0], 'to equal', [dateValue(2020, 0, 31), 1, true]);
      expect(args[11], 'to equal', [dateValue(2020, 11, 31), 1, true]);

      // go to years view
      // on start date
      input0.focus();
      args = [];
      viewSwitch0.click();
      cells0 = getCells(picker0);

      // both month === 0 and day % 10 === 1 are not applied
      // no years are disabled
      expect(getCellIndices(cells0, '.disabled'), 'to be empty');
      expect(args[0], 'to equal', [dateValue(2019, 0, 1), 2, false]);
      expect(args[11], 'to equal', [dateValue(2030, 0, 1), 2, false]);

      // on end date
      input1.focus();
      args = [];
      viewSwitch1.click();
      cells1 = getCells(picker1);

      // both month === 0 and day % 10 === 1 are not applied
      // no years are disabled
      expect(getCellIndices(cells1, '.disabled'), 'to be empty');
      expect(args[0], 'to equal', [dateValue(2019, 11, 31), 2, true]);
      expect(args[11], 'to equal', [dateValue(2030, 11, 31), 2, true]);

      // call setDates()
      args = [];
      drp.setDates('2/14/2020', '7/4/2020', {render: false});

      expect(args[0], 'to equal', [dateValue(2020, 1, 14), 0, false]);  // for setDate()
      expect(args[1], 'to equal', [dateValue(2020, 0, 26), 0, false]);  // for view.render()
      expect(args[42], 'to equal', [dateValue(2020, 2, 7), 0, false]);  // for view.render()
      expect(args[43], 'to equal', [dateValue(2020, 6, 4), 0, true]);   // for setDate()
      expect(args[44], 'to equal', [dateValue(2020, 5, 28), 0, true]);  // for view.render()
      expect(args[85], 'to equal', [dateValue(2020, 7, 8), 0, true]);   // for view.render()

      drp.setDates({clear: true});
      drp.setOptions({pickLevel: 1});
      input0.focus();
      viewSwitch0.click();
      viewSwitch0.click();
      input1.focus();
      viewSwitch1.click();
      viewSwitch1.click();

      args = [];
      drp.setDates('2/14/2020', '7/14/2020');

      expect(args[0], 'to equal', [dateValue(2020, 1, 1), 1, false]);   // for setDate()
      expect(args[1], 'to equal', [dateValue(2020, 0, 1), 1, false]);   // for view.render()
      expect(args[12], 'to equal', [dateValue(2020, 11, 1), 1, false]); // for view.render()
      expect(args[13], 'to equal', [dateValue(2020, 6, 31), 1, true]);  // for setDate()
      expect(args[14], 'to equal', [dateValue(2020, 0, 31), 1, true]);  // for view.render()
      expect(args[25], 'to equal', [dateValue(2020, 11, 31), 1, true]); // for view.render()

      drp.setDates({clear: true});
      drp.setOptions({pickLevel: 2});
      input0.focus();
      viewSwitch0.click();
      input1.focus();
      viewSwitch1.click();

      args = [];
      drp.setDates('3/14/2020', '4/20/2022');

      expect(args[0], 'to equal', [dateValue(2020, 0, 1), 2, false]);   // for setDate()
      expect(args[1], 'to equal', [dateValue(2019, 0, 1), 2, false]);   // for view.render()
      expect(args[12], 'to equal', [dateValue(2030, 0, 1), 2, false]);  // for view.render()
      expect(args[13], 'to equal', [dateValue(2022, 11, 31), 2, true]); // for setDate()
      expect(args[14], 'to equal', [dateValue(2019, 11, 31), 2, true]); // for view.render()
      expect(args[25], 'to equal', [dateValue(2030, 11, 31), 2, true]); // for view.render()

      drp.destroy();
    });
  });
});
