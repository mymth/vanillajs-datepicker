describe('options - format & language', function () {
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

  describe('format', function () {
    it('specifies the date format used to parse/format the date string in input', function () {
      const dp = new Datepicker(input, {format: 'yyyy-mm-dd'});

      dp.setDate(new Date(2020, 1, 14));
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '2020-02-14');

      input.value = '2020/4/22';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
      expect(input.value, 'to be', '2020-04-22');

      // when a date in a wrong format is given...
      dp.setDate('2/14/2020');
      expect(dp.dates, 'to equal', [dateValue(2, 13, 2020)]);
      expect(input.value, 'to be', '0008-08-12');

      input.value = '22/4/2020';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(22, 3, 2020)]);
      expect(input.value, 'to be', '0027-10-11');

      dp.destroy();
      input.value = '';
    });

    it('custom parser/fomatter can be used by providing them as toValue/toDisplay of an object', function () {
      const dp = new Datepicker(input, {
        format: {
          toDisplay(date) {
            return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
              .slice(0, 10)
              .replace(/-/g, '');
          },
          toValue(date) {
            const parts = [
              parseInt(date.slice(0, 4), 10),
              parseInt(date.slice(4, 6), 10) - 1,
              parseInt(date.slice(6, 8), 10),
            ];
            return dateValue(...parts);
          },
        },
      });

      dp.setDate(new Date(2020, 1, 14));
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '20200214');

      input.value = '20200422';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
      expect(input.value, 'to be', '20200422');

      dp.destroy();
      input.value = '';
    });

    it('can be updated with setOptions()', function () {
      const dp = new Datepicker(input);
      dp.setOptions({format: 'd M, \'yy'});

      dp.setDate('14/2/2020');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
      expect(input.value, 'to be', '14 Feb, \'20');

      dp.setOptions({format: 'mm/dd/yyyy'});
      expect(input.value, 'to be', '02/14/2020');
      input.value = '4/22/2020';
      dp.update();
      expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
      expect(input.value, 'to be', '04/22/2020');

      dp.destroy();
      input.value = '';
    });
  });

  describe('language', function () {
    const getDayNames = picker => Array.from(picker.querySelectorAll('.days .dow')).map(el => el.textContent);

    it('specifies the language used for the month/day names, today/clear buttons and the default format/weekStart', function () {
      const locale = Datepicker.locales['zh-CN'];
      const {dp, picker} = createDP(input, {language: 'zh-CN', todayButton: true, clearButton: true});
      const viewSwitch = getViewSwitch(picker);
      dp.setDate(new Date(2020, 1, 14));
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020年02月');
      expect(input.value, 'to be', '2020-02-14');
      expect(picker.querySelector('.today-button').textContent, 'to be', locale.today);
      expect(picker.querySelector('.clear-button').textContent, 'to be', locale.clear);

      const dayNames = locale.daysMin.slice(1);
      dayNames.push(locale.daysMin[0]);
      expect(getDayNames(picker), 'to equal', dayNames);

      let cells = getCells(picker);
      expect(cells[0].textContent, 'to be', '27');
      expect(cells[5].textContent, 'to be', '1');
      expect(cells[33].textContent, 'to be', '29');
      expect(cells[41].textContent, 'to be', '8');

      expect(getCellIndices(cells, '.selected'), 'to equal', [18]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);
      expect(cells[18].textContent, 'to be', '14');

      viewSwitch.click();
      expect(viewSwitch.textContent, 'to be', '2020');

      cells = getCells(picker);
      expect(Array.from(cells).map(el => el.textContent), 'to equal', locale.monthsShort);
      cells[1].click();

      input.value = '2020-4-22';
      dp.update();
      expect(viewSwitch.textContent, 'to be', '2020年04月');
      expect(input.value, 'to be', '2020-04-22');

      cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [23]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [23]);
      expect(cells[23].textContent, 'to be', '22');

      dp.destroy();
      input.value = '';
    });

    it('default format/weekStart in the locale are overriden by user-specified ones', function () {
      const locale = Datepicker.locales['zh-CN'];
      const {dp, picker} = createDP(input, {language: 'zh-CN', format: 'yyyy年mm月dd日', weekStart: 0});
      const viewSwitch = getViewSwitch(picker);
      dp.setDate(new Date(2020, 1, 14));
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020年02月');
      expect(input.value, 'to be', '2020年02月14日');
      expect(getDayNames(picker), 'to equal', locale.daysMin);

      let cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.destroy();
      input.value = '';
    });

    it('language code + tag not installed falls back to the language code without tag', function () {
      const locale = Datepicker.locales.fr;
      const {dp, picker} = createDP(input, {language: 'fr-CA', todayButton: true, clearButton: true});
      const viewSwitch = getViewSwitch(picker);
      dp.setDate(new Date(2020, 1, 14));
      dp.show();

      expect(viewSwitch.textContent, 'to be', 'février 2020');
      expect(input.value, 'to be', '14/02/2020');
      expect(picker.querySelector('.today-button').textContent, 'to be', locale.today);
      expect(picker.querySelector('.clear-button').textContent, 'to be', locale.clear);

      const dayNames = locale.daysMin.slice(1);
      dayNames.push(locale.daysMin[0]);
      expect(getDayNames(picker), 'to equal', dayNames);

      dp.destroy();
      input.value = '';
    });

    it('language code not installed falls back to "en"', function () {
      const locale = Datepicker.locales.en;
      const {dp, picker} = createDP(input, {language: 'it', todayButton: true, clearButton: true});
      const viewSwitch = getViewSwitch(picker);
      dp.setDate(new Date(2020, 1, 14));
      dp.show();

      expect(viewSwitch.textContent, 'to be', 'February 2020');
      expect(input.value, 'to be', '02/14/2020');
      expect(picker.querySelector('.today-button').textContent, 'to be', locale.today);
      expect(picker.querySelector('.clear-button').textContent, 'to be', locale.clear);

      expect(getDayNames(picker), 'to equal', locale.daysMin);

      dp.destroy();
      input.value = '';
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input, {todayButton: true, clearButton: true});
      const viewSwitch = getViewSwitch(picker);
      let locale = Datepicker.locales['zh-CN'];
      dp.setDate(new Date(2020, 1, 14));
      dp.setOptions({language: 'zh-CN'});
      dp.show();

      expect(viewSwitch.textContent, 'to be', '2020年02月');
      expect(input.value, 'to be', '2020-02-14');
      expect(picker.querySelector('.today-button').textContent, 'to be', locale.today);
      expect(picker.querySelector('.clear-button').textContent, 'to be', locale.clear);

      let dayNames = locale.daysMin.slice(1);
      dayNames.push(locale.daysMin[0]);
      expect(getDayNames(picker), 'to equal', dayNames);

      let cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [18]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);
      expect(cells[18].textContent, 'to be', '14');

      locale = Datepicker.locales.fr;
      dp.setOptions({language: 'fr'});

      expect(viewSwitch.textContent, 'to be', 'février 2020');
      expect(input.value, 'to be', '14/02/2020');
      expect(picker.querySelector('.today-button').textContent, 'to be', locale.today);
      expect(picker.querySelector('.clear-button').textContent, 'to be', locale.clear);

      dayNames = locale.daysMin.slice(1);
      dayNames.push(locale.daysMin[0]);
      expect(getDayNames(picker), 'to equal', dayNames);

      cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [18]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [18]);
      expect(cells[18].textContent, 'to be', '14');

      const getDisplayedWeeks = () => {
        return Array.from(picker.querySelectorAll('.week')).map(el => el.textContent);
      };
      dp.setOptions({weekNumbers: 4});
      dp.setDate('01/01/2021');
      // ISO week numbers should be displayed
      expect(getDisplayedWeeks(picker), 'to equal', ['53', '1', '2', '3', '4', '5']);

      dp.setDate('14/02/2020');

      locale = Datepicker.locales.en;
      dp.setOptions({language: 'en'});

      expect(viewSwitch.textContent, 'to be', 'February 2020');
      expect(input.value, 'to be', '02/14/2020');
      expect(picker.querySelector('.today-button').textContent, 'to be', locale.today);
      expect(picker.querySelector('.clear-button').textContent, 'to be', locale.clear);

      expect(getDayNames(picker), 'to equal', locale.daysMin);

      cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.setDate('01/01/2021');
      // Week numbers should be changed to Western trad. numbers
      expect(getDisplayedWeeks(picker), 'to equal', ['1', '2', '3', '4', '5', '6']);

      dp.destroy();
      input.value = '';
    });

    it('user-specified format/weekStart other than old language\'s default are kept on being updated dynamically', function () {
      const {dp, picker} = createDP(input, {language: 'zh-CN', format: 'yyyy/mm/dd', weekStart: 0});
      dp.setDate(new Date(2020, 1, 14));
      dp.show();

      let locale = Datepicker.locales.fr;
      dp.setOptions({language: 'fr'});

      expect(input.value, 'to be', '2020/02/14');
      expect(getDayNames(picker), 'to equal', locale.daysMin);

      let cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.destroy();
      input.value = '';
    });
  });
});
