describe('DateRangePicker', function () {
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

  it('input elements\' values are used for the initial dates', function () {
    input0.value = '04/20/2020';
    input1.value = '04/22/2020';

    const drp = new DateRangePicker(elem);
    expect(drp.dates, 'to equal', [dateValue(2020, 3, 20), dateValue(2020, 3, 22)]);

    drp.destroy();
    input0.value = '';
    input1.value = '';
  });

  it('the pickers are hidden at start', function () {
    const {drp, picker0, picker1} = createDRP(elem);

    expect(isVisible(picker0), 'to be false');
    expect(isVisible(picker1), 'to be false');

    drp.destroy();
  });

  it('the pickers becomes visible when the input element get focus and invisivle when losing focus', function () {
    const {drp, picker0, picker1} = createDRP(elem);

    input0.focus();
    expect(isVisible(picker0), 'to be true');

    simulant.fire(input0, 'keydown', {key: 'Tab'});
    input0.blur();
    expect(isVisible(picker0), 'to be false');

    input1.focus();
    expect(isVisible(picker1), 'to be true');

    simulant.fire(input1, 'keydown', {key: 'Tab'});
    input1.blur();
    expect(isVisible(picker1), 'to be false');

    drp.destroy();
  });

  it('indicates the range with hilighting the start/end in the pickers', function () {
    input0.value = '04/20/2020';
    input1.value = '04/22/2020';

    const partsClasses = ['.view-switch', '.prev-button', '.next-button'];
    let {drp, picker0, picker1} = createDRP(elem);
    let [viewSwitch0, prevButton0, nextButton0] = getParts(picker0, partsClasses);
    let [viewSwitch1, prevButton1, nextButton1] = getParts(picker1, partsClasses);
    input0.focus();

    let cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', 'April 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [22]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [22]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [24]);
    expect(getCellIndices(cells, '.range'), 'to equal', [23]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [22]);

    input1.focus();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', 'April 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [22]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [24]);
    expect(getCellIndices(cells, '.range'), 'to equal', [23]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [24]);

    drp.destroy();

    // range over months (days → months views)
    input0.value = '02/26/2020';
    input1.value = '04/12/2020';

    ({drp, picker0, picker1} = createDRP(elem));
    ([viewSwitch0, prevButton0, nextButton0] = getParts(picker0, partsClasses));
    ([viewSwitch1, prevButton1, nextButton1] = getParts(picker1, partsClasses));

    // range-start
    input0.focus();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', 'February 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [31]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [31]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [32, 33, 34, 35, 36, 37, 38, 39, 40, 41]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [31]);

    prevButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', 'January 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [28]);

    nextButton0.click();
    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', 'March 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 42);
    expect(getCellIndices(cells, '.focused'), 'to equal', [25]);

    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', 'April 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [14]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [28]);

    viewSwitch0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [1]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [1]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [3]);
    expect(getCellIndices(cells, '.range'), 'to equal', [2]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

    // range-end
    input1.focus();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', 'April 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [14]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [14]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [14]);

    nextButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', 'May 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [16]);

    prevButton1.click();
    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', 'March 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 42);
    expect(getCellIndices(cells, '.focused'), 'to equal', [11]);

    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', 'February 2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [31]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [32, 33, 34, 35, 36, 37, 38, 39, 40, 41]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [17]);

    viewSwitch1.click();
    cells = getCells(picker1);

    expect(viewSwitch0.textContent, 'to be', '2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [1]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [3]);
    expect(getCellIndices(cells, '.range'), 'to equal', [2]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

    drp.destroy();

    // range over years (months → years views)
    input0.value = '10/01/2020';
    input1.value = '03/31/2023';

    ({drp, picker0, picker1} = createDRP(elem));
    ([viewSwitch0, prevButton0, nextButton0] = getParts(picker0, partsClasses));
    ([viewSwitch1, prevButton1, nextButton1] = getParts(picker1, partsClasses));

    // range-start
    input0.focus();
    viewSwitch0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', [9]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [10, 11]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    prevButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2019');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    nextButton0.click();
    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2021');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 12);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    nextButton0.click();
    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2023');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    viewSwitch0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2020-2029');
    expect(getCellIndices(cells, '.selected'), 'to equal', [1]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [1]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [4]);
    expect(getCellIndices(cells, '.range'), 'to equal', [2, 3]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [4]);

    // range-end
    input1.focus();
    viewSwitch1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2023');
    expect(getCellIndices(cells, '.selected'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    nextButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2024');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    prevButton1.click();
    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2022');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 12);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    prevButton1.click();
    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2020');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [10, 11]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    viewSwitch1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2020-2029');
    expect(getCellIndices(cells, '.selected'), 'to equal', [4]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [1]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [4]);
    expect(getCellIndices(cells, '.range'), 'to equal', [2, 3]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [1]);

    drp.destroy();

    // range over decades (years → decades views)
    input0.value = '01/01/2017';
    input1.value = '12/31/2041';

    ({drp, picker0, picker1} = createDRP(elem));
    ([viewSwitch0, prevButton0, nextButton0] = getParts(picker0, partsClasses));
    ([viewSwitch1, prevButton1, nextButton1] = getParts(picker1, partsClasses));

    // range-start
    input0.focus();
    viewSwitch0.click();
    viewSwitch0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2010-2019');
    expect(getCellIndices(cells, '.selected'), 'to equal', [8]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [8]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [9, 10, 11]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [8]);

    prevButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2000-2009');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [8]);

    nextButton0.click();
    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2020-2029');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 12);
    expect(getCellIndices(cells, '.focused'), 'to equal', [8]);

    nextButton0.click();
    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2040-2049');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [8]);

    viewSwitch0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2000-2090');
    expect(getCellIndices(cells, '.selected'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [5]);
    expect(getCellIndices(cells, '.range'), 'to equal', [3, 4]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [5]);

    // range-end
    input1.focus();
    viewSwitch1.click();
    viewSwitch1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2040-2049');
    expect(getCellIndices(cells, '.selected'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    nextButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2050-2059');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    prevButton1.click();
    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2030-2039');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 12);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    prevButton1.click();
    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2010-2019');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [8]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [9, 10, 11]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    viewSwitch1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2000-2090');
    expect(getCellIndices(cells, '.selected'), 'to equal', [5]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [2]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [5]);
    expect(getCellIndices(cells, '.range'), 'to equal', [3, 4]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [2]);

    drp.destroy();

    // range over centures (decades views)
    input0.value = '01/22/1984';
    input1.value = '12/31/2121';

    ({drp, picker0, picker1} = createDRP(elem));
    ([viewSwitch0, prevButton0, nextButton0] = getParts(picker0, partsClasses));
    ([viewSwitch1, prevButton1, nextButton1] = getParts(picker1, partsClasses));

    // range-start
    input0.focus();
    viewSwitch0.click();
    viewSwitch0.click();
    viewSwitch0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '1900-1990');
    expect(getCellIndices(cells, '.selected'), 'to equal', [9]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [10, 11]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    prevButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '1800-1890');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    nextButton0.click();
    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2000-2090');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 12);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    nextButton0.click();
    cells = getCells(picker0);

    expect(viewSwitch0.textContent, 'to be', '2100-2190');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [3]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1, 2]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [9]);

    // range-end
    input1.focus();
    viewSwitch1.click();
    viewSwitch1.click();
    viewSwitch1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2100-2190');
    expect(getCellIndices(cells, '.selected'), 'to equal', [3]);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', [3]);
    expect(getCellIndices(cells, '.range'), 'to equal', [0, 1, 2]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

    nextButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2200-2290');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', []);
    expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

    prevButton1.click();
    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '2000-2090');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', []);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range').length, 'to be', 12);
    expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

    prevButton1.click();
    cells = getCells(picker1);

    expect(viewSwitch1.textContent, 'to be', '1900-1990');
    expect(getCellIndices(cells, '.selected'), 'to equal', []);
    expect(getCellIndices(cells, '.range-start'), 'to equal', [9]);
    expect(getCellIndices(cells, '.range-end'), 'to equal', []);
    expect(getCellIndices(cells, '.range'), 'to equal', [10, 11]);
    expect(getCellIndices(cells, '.focused'), 'to equal', [3]);

    drp.destroy();
  });
});
