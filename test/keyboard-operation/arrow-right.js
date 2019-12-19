describe('keyboard operation - arrow-right', function () {
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
  });

  it('moves the view date/month/year/decade to 1 step right side', function () {
    const clock = sinon.useFakeTimers({now: new Date(2024, 5, 12)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', 'June 2024');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);
    expect(cells[18].textContent, 'to be', '13');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2024');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);
    expect(cells[6].textContent, 'to be', '2025');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
    expect(cells[4].textContent, 'to be', '2030');

    dp.destroy();
    clock.restore();
  });

  it('also changes month of the days view if the current view date is the last day', function () {
    const clock = sinon.useFakeTimers({now: new Date(2020, 1, 29)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', 'March 2020');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[0]]);
    expect(cells[0].textContent, 'to be', '1');

    dp.destroy();
    clock.restore();
  });

  it('also changes year of the months view if the current view month is December', function () {
    const clock = sinon.useFakeTimers({now: new Date(2020, 11, 1)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2021');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[0]]);

    dp.destroy();
    clock.restore();
  });

  it('also changes decade of the years view if the current view year is the end of the decade', function () {
    const clock = sinon.useFakeTimers({now: new Date(2019, 1, 1)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '2020');

    dp.destroy();
    clock.restore();
  });

  it('also changes century of the decades view if the current view decade is the end of the century', function () {
    const clock = sinon.useFakeTimers({now: new Date(1990, 1, 1)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '2000');

    dp.destroy();
    clock.restore();
  });

  describe('with control', function () {
    it('functions as the shortcut key of the next button', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 3, 22)});
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'May 2020');

      // view date is changed to the same day of the next month
      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[26]]);
      expect(cells[26].textContent, 'to be', '22');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2021');

      // view date is changed to the same month of the previous year
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
      expect(filterCells(cells, '.selected'), 'to equal', []);

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2030-2039');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);
      expect(cells[2].textContent, 'to be', '2031');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2100-2190');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);
      expect(cells[4].textContent, 'to be', '2130');

      dp.destroy();
      clock.reset();
    });
  });

  describe('with meta', function () {
    it('functions as a substitute for the "+ctrl" key combination', function () {
      let clock = sinon.useFakeTimers({now: new Date(2020, 3, 22)});
      let {dp, picker} = createDP(input);
      let viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'May 2020');

      // view date is changed to the same day of the next month
      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[26]]);
      expect(cells[26].textContent, 'to be', '22');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowRight', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2021');

      // view date is changed to the same month of the previous year
      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
      expect(filterCells(cells, '.selected'), 'to equal', []);

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowRight', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2030-2039');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);
      expect(cells[2].textContent, 'to be', '2031');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowRight', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2100-2190');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);
      expect(cells[4].textContent, 'to be', '2130');

      dp.destroy();
      clock.restore();
    });
  });
});
