describe('inline mode', function () {
  let element;
  let dp;
  let picker;

  beforeEach(function () {
    element = parseHTML('<div data-date="04/22/2020"></div>').firstChild;
    testContainer.appendChild(element);
    dp = new Datepicker(element, {container: 'body'});
    picker = document.querySelector('.datepicker');
  });

  afterEach(function () {
    dp.destroy();
    testContainer.removeChild(element);
  });

  it('uses the bound element for the container regardless of the container option', function () {
    expect(picker.parentElement, 'to be', element);
  });

  it('does not add datepicker-input class to the bound element', function () {
    expect(element.classList.contains('datepicker-input'), 'to be false');
  });

  it('shows the picker on construction', function () {
    expect(isVisible(picker), 'to be true');
  });

  it('uses the data-date attribute for the initial date(s)', function () {
    expect(dp.dates[0], 'to be', dateValue(2020, 3, 22));
    expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');
    expect(picker.querySelector('.datepicker-cell.selected').textContent, 'to be', '22');
  });

  it('hide() takes no effect', function () {
    dp.hide();
    expect(isVisible(picker), 'to be true');
  });

  it('enterEditMode() takes no effect', function () {
    dp.enterEditMode();
    expect(dp.editMode, 'to be undefined');
  });

  it('keyboard operation works when the bound element has tabindex attribute', function () {
    // test without tabindex becuase programatically generated events can go off
    const viewSwitch = getViewSwitch(picker);
    let cells = getCells(picker);

    simulant.fire(element, 'keydown', {key: 'ArrowDown'});
    expect(viewSwitch.textContent, 'to be', 'April 2020');
    expect(getCellIndices(cells, '.focused'), 'to equal', [31]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(cells[31].textContent, 'to be', '29');
    expect(cells[24].textContent, 'to be', '22');

    simulant.fire(element, 'keydown', {key: 'ArrowLeft'});
    expect(getCellIndices(cells, '.focused'), 'to equal', [30]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(cells[30].textContent, 'to be', '28');
    expect(cells[24].textContent, 'to be', '22');

    simulant.fire(element, 'keydown', {key: 'ArrowUp'});
    expect(getCellIndices(cells, '.focused'), 'to equal', [23]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(cells[23].textContent, 'to be', '21');

    simulant.fire(element, 'keydown', {key: 'ArrowRight'});
    expect(getCellIndices(cells, '.focused'), 'to equal', [24]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(cells[24].textContent, 'to be', '22');

    simulant.fire(element, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
    expect(viewSwitch.textContent, 'to be', 'March 2020');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [21]);
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(cells[21].textContent, 'to be', '22');

    simulant.fire(element, 'keydown', {key: 'ArrowRight', ctrlKey: true});
    expect(viewSwitch.textContent, 'to be', 'April 2020');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [24]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(cells[24].textContent, 'to be', '22');

    simulant.fire(element, 'keydown', {key: 'ArrowUp', ctrlKey: true});
    expect(viewSwitch.textContent, 'to be', '2020');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [3]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
    expect(cells[3].textContent, 'to be', 'Apr');

    simulant.fire(element, 'keydown', {key: 'Enter'});
    expect(viewSwitch.textContent, 'to be', 'April 2020');
    cells = getCells(picker);
    expect(getCellIndices(cells, '.focused'), 'to equal', [24]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(cells[24].textContent, 'to be', '22');

    simulant.fire(element, 'keydown', {key: 'ArrowLeft'});
    simulant.fire(element, 'keydown', {key: 'ArrowLeft'});
    simulant.fire(element, 'keydown', {key: 'Enter'});
    expect(viewSwitch.textContent, 'to be', 'April 2020');
    expect(getCellIndices(cells, '.focused'), 'to equal', [22]);
    expect(getCellIndices(cells, '.selected'), 'to equal', [22]);
    expect(cells[22].textContent, 'to be', '20');
    expect(dp.dates, 'to equal', [dateValue(2020, 3, 20)]);
  });
});
