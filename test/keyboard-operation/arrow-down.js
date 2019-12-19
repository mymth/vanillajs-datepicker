describe('keyboard operation - arrow-down', function () {
  const replaceInput = () => {
    const newInput = document.createElement('input');
    testContainer.replaceChild(newInput, input);
    return newInput;
  };
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
  });

  it('shows the picker if it is hidden', function () {
    const {dp, picker} = createDP(input);

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(isVisible(picker), 'to be true');

    dp.destroy();
  });

  it('moves the view date/month/year/decade to 1 step down side', function () {
    const clock = sinon.useFakeTimers({now: new Date(2044, 5, 15)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', 'June 2044');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[24]]);
    expect(cells[24].textContent, 'to be', '22');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2044');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2040-2049');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);
    expect(cells[9].textContent, 'to be', '2048');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);
    expect(cells[9].textContent, 'to be', '2080');

    dp.destroy();
    clock.restore();
  });

  it('also changes month of the days view if the current view date >= last 7 days of month', function () {
    let clock = sinon.useFakeTimers({now: new Date(2020, 1, 23)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', 'March 2020');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[0]]);
    expect(cells[0].textContent, 'to be', '1');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 1, 26)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', 'March 2020');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
    expect(cells[3].textContent, 'to be', '4');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 1, 29)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', 'March 2020');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);
    expect(cells[6].textContent, 'to be', '7');

    dp.destroy();
    clock.restore();
  });

  it('also changes year of the months view if the current view month is Sep/Oct/Npv/Dec', function () {
    let clock = sinon.useFakeTimers({now: new Date(2020, 8, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2021');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[0]]);

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 9, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2021');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 10, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2021');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[2]]);

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 11, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2021');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

    dp.destroy();
    clock.restore();
  });

  it('also changes decade of the years view if the current view year is the first 4 of the decade', function () {
    let clock = sinon.useFakeTimers({now: new Date(2016, 1, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '2020');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2018, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
    expect(cells[3].textContent, 'to be', '2022');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2019, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
    expect(cells[4].textContent, 'to be', '2023');

    dp.destroy();
    clock.restore();
  });

  it('also changes century of the decades view if the current view decade is the first 4 of the century', function () {
    let clock = sinon.useFakeTimers({now: new Date(1960, 1, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '2000');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(1980, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
    expect(cells[3].textContent, 'to be', '2020');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(1990, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[4]]);
    expect(cells[4].textContent, 'to be', '2030');

    dp.destroy();
    clock.restore();
  });
});
