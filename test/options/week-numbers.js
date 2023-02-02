describe('options - week numbers', function () {
  let clock;
  let input;

  beforeEach(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    if (input.datepicker) {
      input.datepicker.destroy();
    }
    testContainer.removeChild(input);
    clock.restore();
  });

  describe('calendarWeeks', function () {
    function getDisplayedWeeks(picker) {
      return Array.from(picker.querySelectorAll('.calendar-weeks .week')).map(el => el.textContent);
    }

    it('enables ISO week numbers to be displayed in days view when true', function () {
      const {dp, picker} = createDP(input, {calendarWeeks: true, weekStart: 1});
      const [viewSwitch, prevButton] = getParts(picker, ['.view-switch', '.prev-button']);
      dp.show();

      expect(isVisible(picker.querySelector('.calendar-weeks')), 'to be true');
      expect(getDisplayedWeeks(picker), 'to equal', ['5', '6', '7', '8', '9', '10']);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(picker), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(picker), 'to equal', ['48', '49', '50', '51', '52', '1']);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(picker), 'to equal', ['44', '45', '46', '47', '48', '49']);

      dp.setDate('01/01/2021'); // Jan, 2021
      expect(getDisplayedWeeks(picker), 'to equal', ['53', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(picker), 'to equal', ['49', '50', '51', '52', '53', '1']);

      // months view
      viewSwitch.click();
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      // years view
      viewSwitch.click();
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      // decades view
      viewSwitch.click();
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      dp.hide();
      dp.setOptions({weekStart: 0});
      dp.setDate('02/14/2020');
      dp.show();

      // ISO week numbers of the days of weekStart are showm
      expect(getDisplayedWeeks(picker), 'to equal', ['4', '5', '6', '7', '8', '9']);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(picker), 'to equal', ['52', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(picker), 'to equal', ['48', '49', '50', '51', '52', '1']);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(picker), 'to equal', ['43', '44', '45', '46', '47', '48',]);

      dp.setDate('01/01/2021'); // Jan, 2021
      expect(getDisplayedWeeks(picker), 'to equal', ['52', '53', '1', '2', '3', '4']);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(picker), 'to equal', ['48', '49', '50', '51', '52', '53']);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({calendarWeeks: true});
      dp.show();

      expect(isVisible(picker.querySelector('.calendar-weeks')), 'to be true');

      dp.setOptions({calendarWeeks: false});
      expect(picker.querySelector('.calendar-weeks'), 'to be null');

      dp.destroy();
    });
  });

  describe('weekNumbers', function () {
    function getWeekElems(picker) {
      return Array.from(picker.querySelectorAll('.week-numbers .week'));
    }

    function getDisplayedWeeks(weekElems) {
      return weekElems.map(el => el.textContent);
    }

    function getIndicesOfNextMonWeeks(weekElems) {
      return weekElems.reduce((indices, el, index) => {
        if (el.classList.contains('next')) {
          indices.push(index);
        }
        return indices;
      }, []);
    }

    it('enables ISO week numbers to be displayed in days view when 1', function () {
      const {dp, picker} = createDP(input, {weekNumbers: 1, weekStart: 1});
      const [viewSwitch, prevButton] = getParts(picker, ['.view-switch', '.prev-button']);
      const weekElems = getWeekElems(picker);
      dp.show();

      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['53', '1', '2', '3', '4', '5']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['52', '1', '2', '3', '4', '5']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2021'); // Feb 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      // months view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      // years view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      // decades view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      dp.hide();
      dp.setOptions({weekStart: 0});
      dp.setDate('02/14/2020');
      dp.show();

      // ISO week numbers of the days of weekStart are showm
      expect(getDisplayedWeeks(weekElems), 'to equal', ['4', '5', '6', '7', '8', '9']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['52', '1', '2', '3', '4', '5']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['43', '44', '45', '46', '47', '48',]);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan, 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['52', '53', '1', '2', '3', '4']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '53']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2015'); // Feb 2015
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      dp.destroy();
    });

    it('enables Western traditional week numbers to be displayed in days view when 2', function () {
      const {dp, picker} = createDP(input, {weekNumbers: 2, weekStart: 0});
      const [viewSwitch, prevButton] = getParts(picker, ['.view-switch', '.prev-button']);
      const weekElems = getWeekElems(picker);
      dp.show();

      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2015'); // Feb 2015
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      // months view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      // years view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      // decades view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      dp.hide();
      dp.setOptions({weekStart: 1});
      dp.setDate('02/14/2020');
      dp.show();

      // Western traditionsl week numbers of the days of weekStart are showm
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jam, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan, 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2021'); // Feb 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      dp.destroy();
    });

    it('enables Middle Eastern week numbers to be displayed in days view when 3', function () {
      const {dp, picker} = createDP(input, {weekNumbers: 3, weekStart: 6});
      const [viewSwitch, prevButton] = getParts(picker, ['.view-switch', '.prev-button']);
      const weekElems = getWeekElems(picker);
      dp.show();

      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      dp.setDate('02/14/2014'); // Feb 2014
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      // months view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      // years view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      // decades view
      viewSwitch.click();
      expect(picker.querySelector('.week-numbers'), 'to be null');

      dp.hide();
      dp.setOptions({weekStart: 1});
      dp.setDate('02/14/2020');
      dp.show();

      // Middle eastern week numbers of the days of weekStart are showm
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jam, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan, 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2021'); // Feb 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      dp.destroy();
    });

    it('makes week numbers to display change depending on weekStart when 4', function () {
      const {dp, picker} = createDP(input, {weekNumbers: 4});
      const prevButton = picker.querySelector('.prev-button');
      const weekElems = getWeekElems(picker);
      dp.show();

      // weekStart: 0 --> Western Traditional week numbers
      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);

      prevButton.click();  // Nob, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);

      dp.hide();
      dp.setOptions({weekStart: 6});
      dp.setDate('02/14/2020');
      dp.show();

      // weekStart: 6 --> Middle Eastern week numbers
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);

      prevButton.click();  // Nob, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);

      dp.hide();
      dp.setOptions({weekStart: 1});
      dp.setDate('02/14/2020');
      dp.show();

      // weekStart: 6 --> ISO week numbers
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);

      prevButton.click();  // Nob, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['53', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['52', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);

      dp.hide();
      dp.setOptions({weekStart: 4});
      dp.setDate('02/14/2020');
      dp.show();

      // other than 0, 1, 6 --> ISO week numbers
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['52', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);

      prevButton.click();  // Nob, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['53', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '53']);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['47', '48', '49', '50', '51', '52']);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['52', '1', '2', '3', '4', '5']);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);

      dp.destroy();
    });

    it('enables week numbers calulated by given callback to be displayed when a function is set', function () {
      const callback = function (date, weekStart) {
        const startOfFirstWeek = dateUtils.dayOfTheWeekOf(new Date(date).setMonth(0, 1), weekStart, weekStart);
        const startOfTheWeek = dateUtils.dayOfTheWeekOf(date, weekStart, weekStart);
        const weekNum = Math.round((startOfTheWeek - startOfFirstWeek) / 604800000) + 1;
        if (weekNum < 53) {
          return weekNum;
        }
        const weekOneOfNextYear = dateUtils.dayOfTheWeekOf(new Date(date).setDate(32), weekStart, weekStart);
        return startOfTheWeek === weekOneOfNextYear ? 1 : weekNum;
      };
      const {dp, picker} = createDP(input, {weekNumbers: callback, weekStart: 1});
      const prevButton = picker.querySelector('.prev-button');
      const weekElems = getWeekElems(picker);
      dp.show();

      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Nov, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['44', '45', '46', '47', '48', '49']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2021'); // Feb 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      dp.hide();
      dp.setOptions({weekStart: 4});
      dp.setDate('02/14/2020');
      dp.show();

      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Jan, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      prevButton.click();  // Dec, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Nob, 2019
      expect(getDisplayedWeeks(weekElems), 'to equal', ['45', '46', '47', '48', '49', '50']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('01/01/2021'); // Jan 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2020
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '53', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      dp.setDate('12/01/2021'); // Dec 2021
      expect(getDisplayedWeeks(weekElems), 'to equal', ['48', '49', '50', '51', '52', '1']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', []);

      dp.setDate('01/01/2017'); // Jan 2017
      expect(getDisplayedWeeks(weekElems), 'to equal', ['1', '2', '3', '4', '5', '6']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      prevButton.click();  // Dec, 2016
      expect(getDisplayedWeeks(weekElems), 'to equal', ['49', '50', '51', '52', '1', '2']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [5]);

      dp.setDate('02/14/2018'); // Feb 2018
      expect(getDisplayedWeeks(weekElems), 'to equal', ['6', '7', '8', '9', '10', '11']);
      expect(getIndicesOfNextMonWeeks(weekElems), 'to equal', [4, 5]);

      dp.destroy();
    });

    it('overrides calendarWeeks if both are set', function () {
      const {dp, picker} = createDP(input, {calendarWeeks: true, weekNumbers: 2});
      dp.show();

      // Western trad. numbers should be shown
      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(getWeekElems(picker)), 'to equal', ['5', '6', '7', '8', '9', '10']);

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({weekNumbers: 1});
      dp.show();

      const weekElems = getWeekElems(picker);
      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['4', '5', '6', '7', '8', '9']);

      dp.setOptions({weekNumbers: 2});

      expect(isVisible(picker.querySelector('.week-numbers')), 'to be true');
      expect(getDisplayedWeeks(weekElems), 'to equal', ['5', '6', '7', '8', '9', '10']);

      dp.setOptions({weekNumbers: 0});
      expect(picker.querySelector('.week-numbers'), 'to be null');

      dp.destroy();
    });
  });
});
