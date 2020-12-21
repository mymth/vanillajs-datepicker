describe('Datepicker - API methods', function () {
  let clock;
  let input;
  let dp;
  let picker;

  beforeEach(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 2, 14)});
    input = parseHTML('<input type="text" value="04/22/2020">').firstChild;
    testContainer.appendChild(input);
    dp = new Datepicker(input);
    picker = document.querySelector('.datepicker');
    input.focus(); // Activate for visibility checks
  });

  afterEach(function () {
    if (input.datepicker) {
      dp.destroy();
    }
    testContainer.removeChild(input);
    clock.restore();
  });

  describe('getDate()', function () {
    it('returns a Date object of selected date', function () {
      const date = dp.getDate();
      expect(date, 'to be a date');
      expect(date.getTime(), 'to be', dateValue(2020, 3, 22));
    });

    it('returns a formatted date stirng of selected date if the format is specified', function () {
      expect(dp.getDate('yyyy-mm-dd'), 'to be', '2020-04-22');
    });

    it('returns undefined if no date is selected', function () {
      dp.destroy();
      input.value = '';
      dp = new Datepicker(input);

      expect(dp.getDate(), 'to be undefined');
      expect(dp.getDate('yyyy-mm-dd'), 'to be undefined');
    });
  });

  describe('setDate()', function () {
    it('changes the selected date to given date', function () {
      const spyChnageEvent = sinon.spy();
      input.addEventListener('change', spyChnageEvent);

      const viewSwitdh = getViewSwitch(picker);
      const date = new Date(2019, 11, 23);
      dp.setDate(date);

      expect(dp.dates, 'to equal', [date.getTime()]);
      expect(input.value, 'to be', '12/23/2019');
      expect(viewSwitdh.textContent, 'to be', 'December 2019');

      let cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[22]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[22]]);
      expect(cells[22].textContent, 'to be', '23');

      dp.setDate('04/22/2020');

      expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
      expect(input.value, 'to be', '04/22/2020');
      expect(viewSwitdh.textContent, 'to be', 'April 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[24]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);
      expect(cells[24].textContent, 'to be', '22');

      // change by api call should not be a trigger of change event
      // (issue #24)
      expect(spyChnageEvent.called, 'to be false');
      input.removeEventListener('change', spyChnageEvent);

      // change the view to the selected daye's days view
      // (issue #33)
      dp.picker.changeFocus(dateValue(2021, 3, 20)).changeView(2).render();
      dp.setDate('02/14/2020');

      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/14/2020');
      expect(viewSwitdh.textContent, 'to be', 'February 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[19]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');
    });

    it('does nothing if no date or invalid date is given', function () {
      const viewSwitdh = getViewSwitch(picker);
      const origDates = [dateValue(2020, 3, 22)];

      dp.setDate();
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '04/22/2020');
      expect(viewSwitdh.textContent, 'to be', 'April 2020');

      const cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[24]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);
      expect(cells[24].textContent, 'to be', '22');

      dp.setDate('');
      expect(dp.dates, 'to equal', origDates);
      expect(input.value, 'to be', '04/22/2020');
    });

    it('clears the selection if no dates + clear: true option are given', function () {
      const spyChnageEvent = sinon.spy();
      input.addEventListener('change', spyChnageEvent);

      const viewSwitdh = getViewSwitch(picker);
      const today = dateUtils.today();

      dp.setDate({clear: true});
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(viewSwitdh.textContent, 'to be', Datepicker.formatDate(today, 'MM yyyy'));

      // view date is changed to the default view date (current date)
      const cells = getCells(picker);
      const todayCell = filterCells(cells, el => el.dataset.date == today)[0];
      expect(todayCell.textContent, 'to be', Datepicker.formatDate(today, 'd'));
      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [todayCell]);

      // change by api call should not be a trigger of change event
      // (issue #24)
      expect(spyChnageEvent.called, 'to be false');
      input.removeEventListener('change', spyChnageEvent);
    });

    it('omits updating the picker UI if render option = false', function () {
      const date = new Date(2019, 11, 23);
      dp.setDate(date, {render: false});

      expect(dp.dates, 'to equal', [date.getTime()]);
      expect(input.value, 'to be', '12/23/2019');

      const cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[24]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);
      expect(cells[24].textContent, 'to be', '22');
    });

    it('hides the picker if both render and autohide options are true', function () {
      let date = new Date(2019, 11, 23);
      dp.setDate(date, {render: false, autohide: true});

      expect(dp.dates, 'to equal', [date.getTime()]);
      expect(input.value, 'to be', '12/23/2019');
      expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');
      expect(filterCells(getCells(picker), '.selected')[0].textContent, 'to be', '22');
      expect(isVisible(picker), 'to be true');

      date = new Date(2018, 6, 14);
      dp.setDate(date, {autohide: true});

      expect(dp.dates, 'to equal', [date.getTime()]);
      expect(input.value, 'to be', '07/14/2018');
      expect(getViewSwitch(picker).textContent, 'to be', 'July 2018');
      expect(filterCells(getCells(picker), '.selected')[0].textContent, 'to be', '14');
      expect(isVisible(picker), 'to be false');
    });
  });

  describe('update()', function () {
    it('updates the selected date with the input element\'s value', function () {
      const viewSwitdh = getViewSwitch(picker);
      const date = new Date(2019, 11, 23);
      input.value = '12/23/2019';
      dp.update();

      expect(dp.dates, 'to equal', [date.getTime()]);
      expect(input.value, 'to be', '12/23/2019');
      expect(viewSwitdh.textContent, 'to be', 'December 2019');

      let cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[22]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[22]]);
      expect(cells[22].textContent, 'to be', '23');

      // change the view to the selected daye's days view
      // (issue #33)
      dp.picker.changeFocus(dateValue(2021, 3, 20)).changeView(2).render();
      input.value = '02/14/2020';
      dp.update();

      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '02/14/2020');
      expect(viewSwitdh.textContent, 'to be', 'February 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[19]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');
    });

    it('notmalizes iput text\'s format', function () {
      const date = new Date(2020, 6, 4);
      input.value = '7 4 2020';

      dp.update();
      expect(dp.dates, 'to equal', [date.getTime()]);
      expect(input.value, 'to be', '07/04/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'July 2020');
      expect(filterCells(getCells(picker), '.selected')[0].textContent, 'to be', '4');
    });
  });

  describe('refresh()', function () {
    it('refreshes the input element and picker UI to refrect the internal data', function () {
      const spyChnageEvent = sinon.spy();
      input.addEventListener('change', spyChnageEvent);

      dp.dates = [dateValue(2020, 1, 14)];
      dp.refresh();

      expect(input.value, 'to be', '02/14/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'February 2020');

      const cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[19]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');

      // change by api call should not be a trigger of change event
      // (issue #24)
      expect(spyChnageEvent.called, 'to be false');
      input.removeEventListener('change', spyChnageEvent);
    });

    it('also changes the view back to the selected date\'s days view', function () {
      dp.dates = [dateValue(2020, 1, 14)];
      dp.picker.changeFocus(dateValue(2021, 3, 20)).changeView(2).render();
      dp.refresh();

      expect(input.value, 'to be', '02/14/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'February 2020');

      let cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[19]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');

      // go back to the current date's days view if no date is selected
      dp.dates = [];
      dp.picker.changeFocus(dateValue(2019, 10, 22)).update().changeView(1).render();
      dp.refresh();

      expect(input.value, 'to be', '');
      expect(getViewSwitch(picker).textContent, 'to be', 'March 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[13]]);
      expect(cells[13].textContent, 'to be', '14');

      clock.restore();
    });

    it('refresh only picker UI if target: "picker" is passed', function () {
      dp.dates = [dateValue(2020, 1, 14)];
      dp.refresh('picker');

      expect(input.value, 'to be', '04/22/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'February 2020');

      const cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[19]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
      expect(cells[19].textContent, 'to be', '14');
    });

    it('refresh only input element if target: "input" is passed', function () {
      dp.dates = [dateValue(2020, 1, 14)];
      dp.refresh('input');

      expect(input.value, 'to be', '02/14/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');

      const cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[24]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);
      expect(cells[24].textContent, 'to be', '22');
    });

    it('re-renders the picker regardless of its state if forceRender true is passed', function () {
      let cells = getCells(picker);
      cells[16].classList.add('foo');
      cells[12].textContent = '♥︎';
      dp.dates = [dateValue(2020, 3, 10)];
      dp.refresh('picker');

      cells = getCells(picker);
      expect(input.value, 'to be', '04/22/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[12]]);
      expect(filterCells(cells, '.foo'), 'to equal', [cells[16]]);
      expect(cells[12].textContent, 'to be', '♥︎');

      dp.refresh('picker', true);

      cells = getCells(picker);
      expect(input.value, 'to be', '04/22/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[12]]);
      expect(filterCells(cells, '.foo'), 'to equal', []);
      expect(cells[12].textContent, 'to be', '10');

      cells[16].classList.add('foo');
      cells[12].textContent = '♥︎';
      dp.refresh(true);

      cells = getCells(picker);
      expect(input.value, 'to be', '04/10/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');
      expect(filterCells(cells, '.selected'), 'to equal', [cells[12]]);
      expect(filterCells(cells, '.foo'), 'to equal', []);
      expect(cells[12].textContent, 'to be', '10');
    });
  });
});
