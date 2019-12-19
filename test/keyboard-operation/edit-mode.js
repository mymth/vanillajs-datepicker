describe('keyboard operation - edit mode', function () {
  let input;

  beforeEach(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
  });

  it('turns on when Datepicker.enterEditMode() is called', function () {
    const dp = new Datepicker(input);
    input.focus();
    dp.enterEditMode();

    expect(dp.editMode, 'to be true');
    expect(input.classList.contains('in-edit'), 'to be true');

    dp.destroy();
    input.classList.remove('in-edit');
  });

  it('turns on when a printable letter, backspace, delete or shift + escape key is pressed without ctrl/meta', function () {
    const dp = new Datepicker(input);
    input.focus();

    simulant.fire(input, 'keydown', {key: '1'});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: 'J'});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: '/'});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: ' '});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: 'Backspace'});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: 'Delete'});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: 'Escape', shiftKey: true});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    // with modifier key
    simulant.fire(input, 'keydown', {key: '1', shiftKey: true});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: '1', altKey: true});
    expect(dp.editMode, 'to be true');

    delete dp.editMode;
    input.classList.remove('in-edit');

    simulant.fire(input, 'keydown', {key: '1', ctrlKey: true});
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    simulant.fire(input, 'keydown', {key: '1', metaKey: true});
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    // non-pritable-letter key
    simulant.fire(input, 'keydown', {key: 'PageDown'});
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    simulant.fire(input, 'keydown', {key: 'Escape', ctrlKey: true});
    expect(dp.editMode, 'to be undefined');

    dp.destroy();
  });

  it('turns on when input is clicked', function () {
    const dp = new Datepicker(input);
    input.focus();

    simulant.fire(input, 'mousedown');
    input.click();
    expect(dp.editMode, 'to be true');
    expect(input.classList.contains('in-edit'), 'to be true');

    dp.destroy();
    input.classList.remove('in-edit');
  });

  it('does not turn on when the picker is hidden', function () {
    const dp = new Datepicker(input);

    dp.enterEditMode();
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    simulant.fire(input, 'keydown', {key: '1'});
    expect(dp.editMode, 'to be undefined');

    simulant.fire(input, 'keydown', {key: 'J'});
    expect(dp.editMode, 'to be undefined');

    simulant.fire(input, 'mousedown');
    input.click();
    expect(dp.editMode, 'to be undefined');

    dp.destroy();
  });

  it('disables the arrow-key operation of the picker', function () {
    const clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
    const {dp, picker} = createDP(input);
    const viewSwitch = getViewSwitch(picker);
    input.focus();
    dp.enterEditMode();

    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');

    let cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);
    expect(cells[19].textContent, 'to be', '14');

    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');
    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

    simulant.fire(input, 'keydown', {key: 'ArrowUp'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');
    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

    simulant.fire(input, 'keydown', {key: 'ArrowDownt'});
    expect(viewSwitch.textContent, 'to be', 'February 2020');
    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[19]]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
    expect(viewSwitch.textContent, 'to be', '2020');
    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowRight'});
    expect(viewSwitch.textContent, 'to be', '2020-2029');
    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[1]]);

    viewSwitch.click();
    simulant.fire(input, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', '2000-2090');
    cells = getCells(picker);
    expect(filterCells(cells, '.focused'), 'to equal', [cells[3]]);

    dp.destroy();
    clock.restore();
  });

  it('turns off when Datepicker.exitEditMode() is called', function () {
    const dp = new Datepicker(input);
    input.focus();
    dp.enterEditMode();

    dp.exitEditMode();
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    dp.destroy();
  });

  it('turns off when the picker hides', function () {
    const dp = new Datepicker(input);
    input.focus();
    dp.enterEditMode();

    dp.hide();
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    dp.destroy();
  });

  it('turns off when escape key is pressed', function () {
    const dp = new Datepicker(input);
    input.focus();
    dp.enterEditMode();

    simulant.fire(input, 'keydown', {key: 'Escape'});
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');

    dp.destroy();
  });

  it('cancels the edit on the input by default when turning off', function () {
    const dp = new Datepicker(input);
    const date = dateValue(2020, 1, 14);
    dp.setDate(date);
    input.focus();
    dp.enterEditMode();
    input.value = '4/22/2020';

    dp.exitEditMode();
    expect(input.value, 'to be', '02/14/2020');
    expect(dp.dates, 'to equal', [date]);

    dp.show();
    dp.enterEditMode();
    input.value = '4/22/2020';

    dp.hide();
    expect(input.value, 'to be', '02/14/2020');
    expect(dp.dates, 'to equal', [date]);

    dp.show();
    dp.enterEditMode();
    input.value = '4/22/2020';

    simulant.fire(input, 'keydown', {key: 'Escape'});
    expect(input.value, 'to be', '02/14/2020');
    expect(dp.dates, 'to equal', [date]);

    dp.destroy();
  });

  it('updates the selection with the input while turning off if update: true is passed to exitEditMode()', function () {
    const dp = new Datepicker(input);
    const date = dateValue(2020, 3, 22);
    dp.setDate('02/14/2020');
    input.focus();
    dp.enterEditMode();
    input.value = '4/22/2020';

    dp.exitEditMode({update: true});
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');
    expect(input.value, 'to be', '04/22/2020');
    expect(dp.dates, 'to equal', [date]);

    dp.destroy();
  });

  it('updates the selection with the input while turning off if enter key is pressed', function () {
    const dp = new Datepicker(input);
    const date = dateValue(2020, 3, 22);
    dp.setDate('02/14/2020');
    input.focus();
    dp.enterEditMode();
    input.value = '4/22/2020';

    simulant.fire(input, 'keydown', {key: 'Enter'});
    expect(dp.editMode, 'to be undefined');
    expect(input.classList.contains('in-edit'), 'to be false');
    expect(input.value, 'to be', '04/22/2020');
    expect(dp.dates, 'to equal', [date]);

    dp.destroy();
  });
});
