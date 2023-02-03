describe('keyboard operation - arrow-left', function () {
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    if (input.datepicker) {
      input.datepicker.destroy();
    }
    testContainer.removeChild(input);
  });

  it('moves the view date/month/year/decade to 1 step left side', function () {
    const clock = sinon.useFakeTimers({now: new Date(2024, 5, 12), shouldAdvanceTime: true});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', 'June 2024');

    let cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [16]);
    expect(cells[16].textContent, 'to be', '11');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '2024');

    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [4]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');

    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [4]);
    expect(cells[4].textContent, 'to be', '2023');

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');

    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);
    expect(cells[2].textContent, 'to be', '2010');

    clock.restore();
    dp.destroy();
  });

  it('also changes month of the days view if the current view date is the 1st', function () {
    const clock = sinon.useFakeTimers({now: new Date(2020, 2, 1), shouldAdvanceTime: true});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');

    let cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [34]);
    expect(cells[34].textContent, 'to be', '29');

    dp.destroy();
    clock.restore();
  });

  it('also changes year of the months view if the current view month is January', function () {
    const clock = sinon.useFakeTimers({now: new Date(2020, 0, 1), shouldAdvanceTime: true});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '2019');

    let cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [11]);

    dp.destroy();
    clock.restore();
  });

  it('also changes decade of the years view if the current view year is the start of the decade', function () {
    const clock = sinon.useFakeTimers({now: new Date(2020, 1, 1), shouldAdvanceTime: true});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '2010-2019');

    let cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [10]);
    expect(cells[10].textContent, 'to be', '2019');

    dp.destroy();
    clock.restore();
  });

  it('also changes century of the decades view if the current view decade is the start of the century', function () {
    const clock = sinon.useFakeTimers({now: new Date(2000, 1, 1), shouldAdvanceTime: true});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    viewSwitch.click();
    viewSwitch.click();
    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '1900-1990');

    let cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [10]);
    expect(cells[10].textContent, 'to be', '1990');

    dp.destroy();
    clock.restore();
  });

  it('does nothing if the view date is 0000-01-01', function () {
    input.value = '01/01/0000';

    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', 'January 0');

    let cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [6]);
    expect(cells[6].textContent, 'to be', '1');

    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '0');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [0]);

    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '0-9');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
    expect(cells[1].textContent, 'to be', '0');

    viewSwitch.click();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '0-90');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
    expect(cells[1].textContent, 'to be', '0');

    dp.destroy();
  });

  it('keydown event is canceled but bubbles', function () {
    const outer = document.createElement('div');
    testContainer.replaceChild(outer, input);
    outer.appendChild(input);

    const dp = new Datepicker(input);
    const spyInputKeydown = sinon.spy();
    const spyOuterKeydown = sinon.spy();
    input.addEventListener('keydown', spyInputKeydown);
    outer.addEventListener('keydown', spyOuterKeydown);
    input.focus();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(spyInputKeydown.called, 'to be true');
    expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
    expect(spyOuterKeydown.called, 'to be true');

    input.removeEventListener('keydown', spyInputKeydown);
    outer.removeEventListener('keydown', spyOuterKeydown);
    dp.destroy();
    outer.removeChild(input);
    testContainer.replaceChild(input, outer);
  });

  describe('with control', function () {
    it('functions as the shortcut key of the prev button', function () {
      const clock = sinon.useFakeTimers({now: new Date(2020, 3, 22), shouldAdvanceTime: true});
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      // view date is changed to the same day of the previous month
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [21]);
      expect(cells[21].textContent, 'to be', '22');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2019');

      // view date is changed to the same month of the previous year
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [2]);
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2000-2009');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [10]);
      expect(cells[10].textContent, 'to be', '2009');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '1900-1990');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', '1900');

      dp.destroy();
      clock.restore();
    });

    it('keydown event is canceled and does not bubble', function () {
      const outer = document.createElement('div');
      testContainer.replaceChild(outer, input);
      outer.appendChild(input);

      const dp = new Datepicker(input);
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
      dp.destroy();
      outer.removeChild(input);
      testContainer.replaceChild(input, outer);
    });
  });

  describe('with meta', function () {
    it('functions as a substitute for the "+ctrl" key combination', function () {
      let clock = sinon.useFakeTimers({now: new Date(2020, 3, 22), shouldAdvanceTime: true});
      let {dp, picker} = createDP(input);
      let viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      // view date is changed to the same day of the previous month
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [21]);
      expect(cells[21].textContent, 'to be', '22');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2019');

      // view date is changed to the same month of the previous year
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [2]);
      expect(getCellIndices(cells, '.selected'), 'to equal', []);

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2000-2009');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [10]);
      expect(cells[10].textContent, 'to be', '2009');

      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '1900-1990');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', '1900');

      dp.destroy();
      clock.restore();
    });

    it('keydown event is canceled and does not bubble', function () {
      const outer = document.createElement('div');
      testContainer.replaceChild(outer, input);
      outer.appendChild(input);

      const dp = new Datepicker(input);
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', metaKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
      dp.destroy();
      outer.removeChild(input);
      testContainer.replaceChild(input, outer);
    });
  });
});
