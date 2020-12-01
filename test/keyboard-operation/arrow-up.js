describe('keyboard operation - arrow-up', function () {
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

  it('moves the view date/month/year/decade to 1 step up side', function () {
    const clock = sinon.useFakeTimers({now: new Date(2044, 5, 15)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'June 2044');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);
    expect(cells[10].textContent, 'to be', '8');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2044');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2040-2049');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '2040');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '2000');

    dp.destroy();
    clock.restore();
  });

  it('also changes month of the days view if the current view date <= 7th', function () {
    let clock = sinon.useFakeTimers({now: new Date(2020, 2, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[28]]);
    expect(cells[28].textContent, 'to be', '23');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 2, 4)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[31]]);
    expect(cells[31].textContent, 'to be', '26');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 2, 7)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[34]]);
    expect(cells[34].textContent, 'to be', '29');

    dp.destroy();
    clock.restore();
  });

  it('also changes year of the months view if the current view month is Jan/Feb/Mar/Apr', function () {
    let clock = sinon.useFakeTimers({now: new Date(2020, 0, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2019');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[8]]);

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2019');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 2, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2019');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 3, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2019');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[11]]);

    dp.destroy();
    clock.restore();
  });

  it('also changes decade of the years view if the current view year is the first 4 of the decade', function () {
    let clock = sinon.useFakeTimers({now: new Date(2020, 1, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2010-2019');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[7]]);
    expect(cells[7].textContent, 'to be', '2016');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2022, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2010-2019');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);
    expect(cells[9].textContent, 'to be', '2018');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2023, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '2010-2019');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);
    expect(cells[10].textContent, 'to be', '2019');

    dp.destroy();
    clock.restore();
  });

  it('also changes century of the decades view if the current view decade is the first 4 of the century', function () {
    let clock = sinon.useFakeTimers({now: new Date(2000, 1, 1)});
    let {dp, picker} = createDP(input);
    let viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '1900-1990');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[7]]);
    expect(cells[7].textContent, 'to be', '1960');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2020, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '1900-1990');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[9]]);
    expect(cells[9].textContent, 'to be', '1980');

    dp.destroy();
    clock.restore();
    input = replaceInput();

    clock = sinon.useFakeTimers({now: new Date(2030, 1, 1)});
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '1900-1990');

    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[10]]);
    expect(cells[10].textContent, 'to be', '1990');

    dp.destroy();
    clock.restore();
  });

  it('does nothing if the current view date <= 0000-01-07 in the days view', function () {
    input.value = '01/01/0000';

    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'January 0');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[6]]);
    expect(cells[6].textContent, 'to be', '1');

    dp.setDate('01/07/0000');
    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'January 0');
    expect(filterCells(cells, '.focused'), 'to equal', [cells[12]]);
    expect(cells[12].textContent, 'to be', '7');

    dp.destroy();
  });

  it('does nothing if the current view month <= April 0000 in the months view', function () {
    input.value = '01/01/0000';

    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '0');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[0]]);

    dp.setDate('04/07/0000');
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '0');
    expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

    dp.destroy();
  });

  it('does nothing if the current view year <= 0004 in the years view', function () {
    input.value = '01/01/0000';

    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '0-9');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '0');

    dp.setDate('04/07/0004');
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '0-9');
    expect(filterCells(cells, '.focused'), 'to equal', [cells[5]]);
    expect(cells[5].textContent, 'to be', '4');

    dp.destroy();
  });

  it('does nothing if the current view decade <= 0040 in the decades view', function () {
    input.value = '01/01/0000';

    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '0-90');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
    expect(cells[1].textContent, 'to be', '0');

    dp.setDate('04/07/0047');
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', '0-90');
    expect(filterCells(cells, '.focused'), 'to equal', [cells[5]]);
    expect(cells[5].textContent, 'to be', '40');

    dp.destroy();
  });

  describe('with control', function () {
    it('functions as the shortcut key of the view switch', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 3, 22)});
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020-2029');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2020');

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2000-2090');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
      expect(cells[3].textContent, 'to be', '2020');

      // does nothig if the view has reached to the max view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2000-2090');

      dp.destroy();
      clock.reset();
    });
  });

  describe('with meta', function () {
    it('functions as a substitute for the "+ctrl" key combination', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 3, 22)});
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      let cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2020-2029');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);
      expect(cells[1].textContent, 'to be', '2020');

      simulant.fire(input, 'keydown', {key: 'ArrowUp', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2000-2090');

      cells = getCells(picker);
      expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);
      expect(cells[3].textContent, 'to be', '2020');

      // does nothig if the view has reached to the max view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2000-2090');

      dp.destroy();
      clock.reset();
    });
  });
});
