describe('mouse operation', function () {
  let clock;
  let input;

  before(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  after(function () {
    clock.restore();
    testContainer.removeChild(input);
  });

  it('picker hides if mouse is pressed outside the picker or the input', function () {
    const outsider = document.createElement('p');
    testContainer.appendChild(outsider);

    const {dp, picker} = createDP(input);
    input.focus();

    simulant.fire(picker.querySelector('.dow'), 'mousedown');
    expect(isVisible(picker), 'to be true');

    simulant.fire(input, 'mousedown');
    expect(isVisible(picker), 'to be true');

    simulant.fire(outsider, 'mousedown');
    expect(isVisible(picker), 'to be false');

    // hide() should not called when picker is hidden
    // (issue #45)
    const spyHide = sinon.spy(dp, 'hide');
    input.blur();

    simulant.fire(outsider, 'mousedown');
    expect(spyHide.called, 'to be false');

    spyHide.restore();

    // picker shown programmatically should be closed by clicking outside
    // (issue #52)
    dp.show();

    simulant.fire(outsider, 'mousedown');
    expect(isVisible(picker), 'to be false');

    dp.destroy();
    testContainer.removeChild(outsider);
  });

  it('selection is updated with input\'s value if mouse is pressed outside the input', function () {
    const outsider = document.createElement('p');
    testContainer.appendChild(outsider);

    const {dp, picker} = createDP(input);
    // when picker is shown
    input.focus();
    input.value = 'foo';

    simulant.fire(picker.querySelector('.dow'), 'mousedown');
    expect(input.value, 'to be', 'foo');

    simulant.fire(input, 'mousedown');
    expect(input.value, 'to be', 'foo');

    simulant.fire(outsider, 'mousedown');
    expect(input.value, 'to be', '02/14/2020');
    expect(dp.getDate().getTime(), 'to be', dateValue(2020, 1, 14));

    // when picker is hidden
    input.focus();
    input.value = '04/22/2020';

    simulant.fire(outsider, 'mousedown');
    expect(input.value, 'to be', '04/22/2020');
    expect(dp.getDate().getTime(), 'to be', dateValue(2020, 3, 22));

    input.focus();
    input.value = '';

    simulant.fire(outsider, 'mousedown');
    expect(input.value, 'to be', '');
    expect(dp.getDate(), 'to be undefined');

    dp.destroy();
    testContainer.removeChild(outsider);
  });

  it('picker shows up if input field is clicked wheh picker is hidden', function () {
    const {dp, picker} = createDP(input);
    // when input field is not focued
    simulant.fire(input, 'mousedown');
    input.click();
    expect(isVisible(picker), 'to be true');

    dp.hide();

    // when input has focus
    simulant.fire(input, 'mousedown');
    input.click();
    expect(isVisible(picker), 'to be true');

    dp.destroy();
  });

  describe('view-switch', function () {
    it('changes the view to the next greater one', function () {
      input.value = '04/22/2020';

      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.show();

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(input.value, 'to be', '04/22/2020');

      let cells = getCells(picker);
      expect(cells.map(el => el.textContent), 'to equal', Datepicker.locales.en.monthsShort);
      expect(cells[3].classList.contains('selected'), 'to be true');
      expect(cells[3].classList.contains('focused'), 'to be true');

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      expect(input.value, 'to be', '04/22/2020');

      cells = getCells(picker);
      expect(cells, 'to have length', 12);
      expect(cells[0].textContent, 'to be', '2019');
      expect(cells[0].classList.contains('prev'), 'to be true');
      expect(cells[0].classList.contains('next'), 'to be false');
      expect(cells[1].textContent, 'to be', '2020');
      expect(cells[1].classList.contains('prev'), 'to be false');
      expect(cells[1].classList.contains('next'), 'to be false');
      expect(cells[10].textContent, 'to be', '2029');
      expect(cells[10].classList.contains('prev'), 'to be false');
      expect(cells[10].classList.contains('next'), 'to be false');
      expect(cells[11].textContent, 'to be', '2030');
      expect(cells[11].classList.contains('prev'), 'to be false');
      expect(cells[11].classList.contains('next'), 'to be true');

      expect(filterCells(cells, '.selected'), 'to equal', [cells[1]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2000-2090');
      expect(input.value, 'to be', '04/22/2020');

      cells = getCells(picker);
      expect(cells, 'to have length', 12);
      expect(cells[0].textContent, 'to be', '1990');
      expect(cells[0].classList.contains('prev'), 'to be true');
      expect(cells[0].classList.contains('next'), 'to be false');
      expect(cells[1].textContent, 'to be', '2000');
      expect(cells[1].classList.contains('prev'), 'to be false');
      expect(cells[1].classList.contains('next'), 'to be false');
      expect(cells[10].textContent, 'to be', '2090');
      expect(cells[10].classList.contains('prev'), 'to be false');
      expect(cells[10].classList.contains('next'), 'to be false');
      expect(cells[11].textContent, 'to be', '2100');
      expect(cells[11].classList.contains('prev'), 'to be false');
      expect(cells[11].classList.contains('next'), 'to be true');

      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
      expect(cells[3].textContent, 'to be', '2020');

      // does nothig if the view has reached to the max view
      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2000-2090');

      dp.destroy();
      input.value = '';
    });
  });

  describe('prev-btn', function () {
    it('changes the month/year/decade/century of the view to the previouse one', function () {
      input.value = '04/22/2020';

      const {dp, picker} = createDP(input);
      const [viewSwitch, prevBtn] = getParts(picker, ['.view-switch', '.prev-btn']);
      dp.show();

      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', 'March 2020');
      expect(input.value, 'to be', '04/22/2020');

      // view date is changed to the same day of the previous month
      let cells = getCells(picker);
      expect(cells, 'to have length', 42);
      expect(cells[0].textContent, 'to be', '1');
      expect(cells[0].classList.contains('prev'), 'to be false');
      expect(cells[0].classList.contains('next'), 'to be false');
      expect(cells[30].textContent, 'to be', '31');
      expect(cells[30].classList.contains('prev'), 'to be false');
      expect(cells[30].classList.contains('next'), 'to be false');
      expect(cells[31].textContent, 'to be', '1');
      expect(cells[31].classList.contains('prev'), 'to be false');
      expect(cells[31].classList.contains('next'), 'to be true');
      expect(cells[41].textContent, 'to be', '11');
      expect(cells[41].classList.contains('prev'), 'to be false');
      expect(cells[41].classList.contains('next'), 'to be true');

      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[21]]);
      expect(cells[21].textContent, 'to be', '22');

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2020');
      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);

      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', '2019');
      expect(input.value, 'to be', '04/22/2020');

      // view date is changed to the same month of the previous year
      cells = getCells(picker);
      expect(cells.map(el => el.textContent), 'to equal', Datepicker.locales.en.monthsShort);
      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2010-2019');
      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[11]]);
      expect(cells[11].textContent, 'to be', '2020');
      expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);
      expect(cells[10].textContent, 'to be', '2019');

      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', '2000-2009');
      expect(input.value, 'to be', '04/22/2020');

      cells = getCells(picker);
      expect(cells, 'to have length', 12);
      expect(cells[0].textContent, 'to be', '1999');
      expect(cells[1].textContent, 'to be', '2000');
      expect(cells[10].textContent, 'to be', '2009');
      expect(cells[11].textContent, 'to be', '2010');

      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2000-2090');
      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);
      expect(cells[3].textContent, 'to be', '2020');
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2000');

      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', '1900-1990');
      expect(input.value, 'to be', '04/22/2020');

      cells = getCells(picker);
      expect(cells, 'to have length', 12);
      expect(cells[0].textContent, 'to be', '1890');
      expect(cells[1].textContent, 'to be', '1900');
      expect(cells[10].textContent, 'to be', '1990');
      expect(cells[11].textContent, 'to be', '2000');

      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

      dp.destroy();
      input.value = '';
    });

    it('controls the view date in days view to be in the prev month when moving from a longer month to shorter', function () {
      input.value = '03/31/2019';

      const {dp, picker} = createDP(input);
      const [viewSwitch, prevBtn] = getParts(picker, ['.view-switch', '.prev-btn']);
      dp.show();

      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', 'February 2019');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[32]]);
      expect(cells[32].textContent, 'to be', '28');

      input.value = '03/31/2020';
      dp.update();
      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[34]]);
      expect(cells[34].textContent, 'to be', '29');

      input.value = '10/31/2020';
      dp.update();
      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', 'September 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[31]]);
      expect(cells[31].textContent, 'to be', '30');

      dp.destroy();
      input.value = '';
    });

    it('becomes disabled if the view includes the decade/year/month/day of 0000-01-01', function () {
      input.value = '01/04/0000';

      const {dp, picker} = createDP(input);
      const [viewSwitch, prevBtn] = getParts(picker, ['.view-switch', '.prev-btn']);
      dp.show();

      expect(prevBtn.disabled, 'to be true');
      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', 'January 0');

      viewSwitch.click();

      expect(prevBtn.disabled, 'to be true');
      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', '0');

      viewSwitch.click();

      expect(prevBtn.disabled, 'to be true');
      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', '0-9');

      viewSwitch.click();

      expect(prevBtn.disabled, 'to be true');
      prevBtn.click();
      expect(viewSwitch.textContent, 'to be', '0-90');

      dp.destroy();
      input.value = '';
    });
  });

  describe('next-btn', function () {
    it('changes the month/year/decade/century of the view to the next one', function () {
      input.value = '04/22/2020';

      const {dp, picker} = createDP(input);
      const [viewSwitch, nextBtn] = getParts(picker, ['.view-switch', '.next-btn']);
      dp.show();

      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', 'May 2020');
      expect(input.value, 'to be', '04/22/2020');

      // view date is changed to the same day of the next month
      let cells = getCells(picker);
      expect(cells, 'to have length', 42);
      expect(cells[0].textContent, 'to be', '26');
      expect(cells[0].classList.contains('prev'), 'to be true');
      expect(cells[0].classList.contains('next'), 'to be false');
      expect(cells[4].textContent, 'to be', '30');
      expect(cells[4].classList.contains('prev'), 'to be true');
      expect(cells[4].classList.contains('next'), 'to be false');
      expect(cells[5].textContent, 'to be', '1');
      expect(cells[5].classList.contains('prev'), 'to be false');
      expect(cells[5].classList.contains('next'), 'to be false');
      expect(cells[35].textContent, 'to be', '31');
      expect(cells[35].classList.contains('prev'), 'to be false');
      expect(cells[35].classList.contains('next'), 'to be false');
      expect(cells[36].textContent, 'to be', '1');
      expect(cells[36].classList.contains('prev'), 'to be false');
      expect(cells[36].classList.contains('next'), 'to be true');
      expect(cells[41].textContent, 'to be', '6');
      expect(cells[41].classList.contains('prev'), 'to be false');
      expect(cells[41].classList.contains('next'), 'to be true');

      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[26]]);
      expect(cells[26].textContent, 'to be', '22');

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2020');
      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);

      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', '2021');
      expect(input.value, 'to be', '04/22/2020');

      // view date is changed to the same month of the previous year
      cells = getCells(picker);
      expect(cells.map(el => el.textContent), 'to equal', Datepicker.locales.en.monthsShort);
      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[1]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);
      expect(cells[1].textContent, 'to be', '2020');
      expect(cells[2].textContent, 'to be', '2021');

      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', '2030-2039');
      expect(input.value, 'to be', '04/22/2020');

      cells = getCells(picker);
      expect(cells, 'to have length', 12);
      expect(cells[0].textContent, 'to be', '2029');
      expect(cells[1].textContent, 'to be', '2030');
      expect(cells[10].textContent, 'to be', '2039');
      expect(cells[11].textContent, 'to be', '2040');

      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);
      expect(cells[2].textContent, 'to be', '2031');

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2000-2090');
      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[3]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
      expect(cells[3].textContent, 'to be', '2020');
      expect(cells[4].textContent, 'to be', '2030');

      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', '2100-2190');
      expect(input.value, 'to be', '04/22/2020');

      cells = getCells(picker);
      expect(cells, 'to have length', 12);
      expect(cells[0].textContent, 'to be', '2090');
      expect(cells[1].textContent, 'to be', '2100');
      expect(cells[10].textContent, 'to be', '2190');
      expect(cells[11].textContent, 'to be', '2200');

      expect(filterCells(cells, '.selected'), 'to equal', []);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
      expect(cells[4].textContent, 'to be', '2130');

      dp.destroy();
      input.value = '';
    });

    it('controls the view date in days view to be in the next month when moving from a longer month to shorter', function () {
      input.value = '01/31/2019';

      const {dp, picker} = createDP(input);
      const [viewSwitch, nextBtn] = getParts(picker, ['.view-switch', '.next-btn']);
      dp.show();

      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', 'February 2019');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[32]]);
      expect(cells[32].textContent, 'to be', '28');

      input.value = '01/31/2020';
      dp.update();
      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[34]]);
      expect(cells[34].textContent, 'to be', '29');

      input.value = '08/31/2020';
      dp.update();
      nextBtn.click();
      expect(viewSwitch.textContent, 'to be', 'September 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[31]]);
      expect(cells[31].textContent, 'to be', '30');

      dp.destroy();
      input.value = '';
    });
  });

  describe('datepicker-cell', function () {
    let dp;
    let picker;

    beforeEach(function () {
      ({dp, picker} = createDP(input));
      dp.show();
    });

    afterEach(function () {
      dp.destroy();
    });

    it('changes the selection to the clicked date if the current view = days', function () {
      const targetCell = getCells(picker)[19];
      targetCell.click();

      expect(dp.dates, 'to equal', [new Date(2020, 1, 14).getTime()]);
      expect(input.value, 'to be', '02/14/2020');
      expect(getViewSwitch(picker).textContent, 'to be', 'February 2020');
      expect(targetCell.classList.contains('selected'), 'to be true');
      expect(targetCell.classList.contains('focused'), 'to be true');

      dp.setDate({clear: true});
    });

    it('also changes the month of the view if a date of previous or next month is clicked', function () {
      const viewSwitch = getViewSwitch(picker);
      getCells(picker)[1].click();

      expect(dp.dates, 'to equal', [new Date(2020, 0, 27).getTime()]);
      expect(input.value, 'to be', '01/27/2020');
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      let cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[29]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[29]]);
      expect(cells[29].textContent, 'to be', '27');

      expect(cells[40].textContent, 'to be', '7');
      cells[40].click();

      expect(dp.dates, 'to equal', [dateValue(2020, 1, 7)]);
      expect(input.value, 'to be', '02/07/2020');
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      cells = getCells(picker);
      expect(filterCells(cells, '.selected'), 'to equal', [cells[12]]);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[12]]);
      expect(cells[12].textContent, 'to be', '7');

      dp.setDate({clear: true});
    });

    it('changes the view year or month to the clicked one and moves to the next minor view if the current view != days', function () {
      const viewSwitch = getViewSwitch(picker);
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      // on decades view: 2000-2090
      let cells = getCells(picker);
      // click "2010"
      cells[2].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getViewSwitch(picker).textContent, 'to be', '2010-2019');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2010');

      // click "2017"
      cells[8].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getViewSwitch(picker).textContent, 'to be', '2017');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', 'Feb');

      // click "Oct"
      cells[9].click();
      expect(dp.dates, 'to equal', []);
      expect(input.value, 'to be', '');
      expect(getViewSwitch(picker).textContent, 'to be', 'October 2017');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[10].textContent, 'to be', '11');
    });
  });
});
