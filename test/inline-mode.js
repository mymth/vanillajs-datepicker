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
});
