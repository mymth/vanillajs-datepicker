describe('options - buttons', function () {
  let clock;
  let input;

  beforeEach(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  afterEach(function () {
    testContainer.removeChild(input);
    clock.restore();
  });

  describe('clearBtn', function () {
    it('displays a button to clear the selection when true', function () {
      const {dp, picker} = createDP(input, {clearBtn: true});
      const [viewSwitch, clearBtn] = getParts(picker, ['.view-switch', '.clear-btn']);
      dp.show();

      expect(isVisible(clearBtn), 'to be true');
      expect(clearBtn.textContent, 'to be', 'Clear');

      // months view
      viewSwitch.click();
      expect(isVisible(clearBtn), 'to be true');

      // years view
      viewSwitch.click();
      expect(isVisible(clearBtn), 'to be true');

      // decades view
      viewSwitch.click();
      expect(isVisible(clearBtn), 'to be true');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({clearBtn: true});
      dp.show();

      const clearBtn = picker.querySelector('.clear-btn');
      expect(isVisible(clearBtn), 'to be true');

      dp.setOptions({clearBtn: false});
      expect(isVisible(clearBtn), 'to be false');

      dp.destroy();
    });

    describe('clear button', function () {
      let dp;
      let picker;
      let clearBtn;

      beforeEach(function () {
        ({dp, picker} = createDP(input, {clearBtn: true}));
        clearBtn = picker.querySelector('.clear-btn');
        dp.show();
      });

      afterEach(function () {
        dp.destroy();
      });

      it('clears the selection', function () {
        dp.setDate('2/14/2020');
        clearBtn.click();

        expect(dp.dates, 'to equal', []);
        expect(input.value, 'to be', '');

        const viewSwitch = getViewSwitch(picker);
        // months view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        clearBtn.click();
        expect(dp.dates, 'to equal', []);

        // years view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        clearBtn.click();
        expect(dp.dates, 'to equal', []);

        // decades view
        dp.setDate('2/14/2020');
        viewSwitch.click();
        clearBtn.click();
        expect(dp.dates, 'to equal', []);
      });

      it('hides the picker as well when autohide = true', function () {
        dp.setDate('2/14/2020');
        dp.setOptions({autohide: true});
        clearBtn.click();

        expect(isVisible(picker), 'to be false');
      });
    });
  });

  describe('todayBtn', function () {
    it('displays a button to change the view date to current date when true', function () {
      const {dp, picker} = createDP(input, {todayBtn: true});
      const [viewSwitch, todayBtn] = getParts(picker, ['.view-switch', '.today-btn']);
      dp.show();

      expect(isVisible(todayBtn), 'to be true');
      expect(todayBtn.textContent, 'to be', 'Today');

      // months view
      viewSwitch.click();
      expect(isVisible(todayBtn), 'to be true');

      // years view
      viewSwitch.click();
      expect(isVisible(todayBtn), 'to be true');

      // decades view
      viewSwitch.click();
      expect(isVisible(todayBtn), 'to be true');

      dp.destroy();
    });

    it('today will be disabled if the current date is out of the range of minDate/maxDate', function () {
      const {dp, picker} = createDP(input, {todayBtn: true});
      const todayBtn = picker.querySelector('.today-btn');
      dp.show();

      expect(todayBtn.disabled, 'to be false');

      dp.setOptions({minDate: '2/20/2020'});
      expect(todayBtn.disabled, 'to be true');

      dp.setOptions({minDate: null, maxDate: '2/10/2020'});
      expect(todayBtn.disabled, 'to be true');

      dp.setOptions({minDate: '2/1/2020', maxDate: '2/29/2020'});
      expect(todayBtn.disabled, 'to be false');

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({todayBtn: true});
      dp.show();

      const todayBtn = picker.querySelector('.today-btn');
      expect(isVisible(todayBtn), 'to be true');

      dp.setOptions({todayBtn: false});
      expect(isVisible(todayBtn), 'to be false');

      dp.setOptions({todayBtn: 'true'});
      expect(isVisible(todayBtn), 'to be true');

      dp.destroy();
    });
  });

  describe('todayBtnMode', function () {
    let dp;
    let picker;
    let viewSwitch;
    let todayBtn;
    let cells;

    beforeEach(function () {
      ({dp, picker} = createDP(input, {todayBtn: true}));
      [viewSwitch, todayBtn] = getParts(picker, ['.view-switch', '.today-btn']);
      dp.show();
    });

    afterEach(function () {
      dp.destroy();
    });

    it('specifies the behavior of the today buton', function () {
      const date = dateValue(2020, 1, 11);

      // defualt to 0: focus-on (change view date)
      dp.setDate(date);
      todayBtn.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[16].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [date]);

      dp.destroy();

      // 1: select (change the selection)
      ({dp, picker} = createDP(input, {todayBtn: true, todayBtnMode: 1}));
      todayBtn = picker.querySelector('.today-btn');
      dp.setDate(date);
      dp.show();
      todayBtn.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[19].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);
    });

    it('can be updated with setOptions()', function () {
      const date = dateValue(2020, 1, 11);

      dp.setDate(date);
      dp.setOptions({todayBtnMode: 1});
      todayBtn.click();

      cells = getCells(picker);
      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[19].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

      dp.setDate(date);
      dp.setOptions({todayBtnMode: 0});
      todayBtn.click();

      expect(cells[19].textContent, 'to be', '14');
      expect(cells[19].classList.contains('focused'), 'to be true');
      expect(cells[16].classList.contains('selected'), 'to be true');
      expect(dp.dates, 'to equal', [date]);
    });

    describe('today button', function () {
      it('changes the view date to the current date when todayBtnMode = 0', function () {
        dp.setDate('4/22/2020');
        todayBtn.click();

        expect(viewSwitch.textContent, 'to be', 'February 2020');

        cells = getCells(picker);
        expect(cells[19].textContent, 'to be', '14');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells.find(el => el.classList.contains('selected')), 'to be undefined');

        expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);
        expect(input.value, 'to be', '04/22/2020');

        dp.setDate({clear: true});
      });

      it('also changes the view to days view when todayBtnMode = 0', function () {
        // months view
        dp.setDate('4/22/2020');
        viewSwitch.click();
        todayBtn.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // years view
        dp.setDate({clear: true});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        todayBtn.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        // decades view
        dp.setDate({clear: true});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        viewSwitch.click();
        todayBtn.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');

        dp.setDate({clear: true});
      });

      it('changes the selection to the current date when todayBtnMode = 1', function () {
        dp.setOptions({todayBtnMode: 1});
        dp.setDate('4/22/2020');
        todayBtn.click();

        expect(viewSwitch.textContent, 'to be', 'February 2020');

        cells = getCells(picker);
        expect(cells[19].textContent, 'to be', '14');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');

        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        expect(input.value, 'to be', '02/14/2020');
        dp.setDate({clear: true});
        dp.setDate('4/22/2020');
        viewSwitch.click();
        viewSwitch.click();
        todayBtn.click();
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        dp.setDate({clear: true});
      });

      it('also hides the picker when todayBtnMode = 1 and autohide = true', function () {
        dp.setOptions({todayBtnMode: 1, autohide: true});
        dp.setDate('4/22/2020');
        todayBtn.click();

        expect(isVisible(picker), 'to be false');

        dp.setDate({clear: true});
      });

      it('always changes the view to current date\'s days view when todayBtnMode = 1', function () {
        const nextBtn = picker.querySelector('.next-btn');
        dp.setOptions({todayBtnMode: 1});

        // after moving other month or view while the current date is selected already
        // (issue #11)
        todayBtn.click();
        nextBtn.click();
        todayBtn.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        viewSwitch.click();
        nextBtn.click();
        todayBtn.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        viewSwitch.click();
        viewSwitch.click();
        nextBtn.click();
        nextBtn.click();
        todayBtn.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 1, 14)]);

        // when current date is deslected by toggling in multi-date mode
        dp.setOptions({maxNumberOfDates: 3});
        nextBtn.click();
        getCells(picker)[20].click();
        todayBtn.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be false');
        expect(dp.dates, 'to equal', [dateValue(2020, 2, 21)]);

        nextBtn.click();
        todayBtn.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('selected'), 'to be true');
        expect(dp.dates, 'to equal', [dateValue(2020, 2, 21), dateValue(2020, 1, 14)]);

        viewSwitch.click();
        nextBtn.click();
        todayBtn.click();
        cells = getCells(picker);
        expect(viewSwitch.textContent, 'to be', 'February 2020');
        expect(cells[19].classList.contains('focused'), 'to be true');
        expect(cells[19].classList.contains('selected'), 'to be false');
        expect(dp.dates, 'to equal', [dateValue(2020, 2, 21)]);

        dp.setDate({clear: true});
      });
    });
  });
});
