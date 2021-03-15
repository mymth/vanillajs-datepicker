describe('Datepicker', function () {
  let input;

  before(function () {
    input = document.createElement('input');
    testContainer.appendChild(input);
  });

  after(function () {
    testContainer.removeChild(input);
  });

  it('input element\'s value is used for the initial date', function () {
    input.value = '04/22/2020';

    const dp = new Datepicker(input);
    expect(dp.dates, 'to equal', [dateValue(2020, 3, 22)]);

    dp.destroy();
    input.value = '';
  });

  it('the picker is hidden at start', function () {
    const dp = new Datepicker(input);
    expect(isVisible(document.querySelector('.datepicker')), 'to be false');
    expect(dp.active, 'to be false');
    dp.destroy();
  });

  it('the picker becomes visible when the input element get focused', function () {
    const dp = new Datepicker(input);
    input.focus();

    expect(isVisible(document.querySelector('.datepicker')), 'to be true');
    expect(dp.active, 'to be true');
    dp.destroy();
  });

  describe('hide()', function () {
    it('makes the picker invisible', function () {
      const dp = new Datepicker(input);
      input.focus();
      dp.hide();

      expect(isVisible(document.querySelector('.datepicker')), 'to be false');
      expect(dp.active, 'to be false');

      dp.destroy();
    });
  });

  describe('show()', function () {
    it('makes the picker visible', function () {
      const dp = new Datepicker(input);
      dp.show();

      expect(isVisible(document.querySelector('.datepicker')), 'to be true');
      expect(dp.active, 'to be true');

      dp.destroy();
    });

    it('moves the focus onto the input field', function () {
      // related to issue #52
      const dp = new Datepicker(input);
      const spyShow = sinon.spy(dp, 'show');
      input.blur();
      dp.show();

      expect(document.activeElement, 'to be', input);
      // the focus listener's calling show() is prevented
      expect(spyShow.calledOnce, 'to be true');

      spyShow.restore();
      dp.destroy();
    });

    it('adds or removes dir attribute to/from the picker if picker\'s text direction != input\'s', function (done) {
      testContainer.dir = 'rtl';

      const {dp, picker} = createDP(input);
      dp.show();
      expect(picker.dir, 'to be', 'rtl');

      dp.hide();
      testContainer.removeAttribute('dir');

      dp.show();
      expect(picker.hasAttribute('dir'), 'to be false');

      dp.hide();

      const htmlElem = document.querySelector('html');
      htmlElem.dir = 'rtl';
      input.style.direction = 'ltr';

      dp.show();
      expect(picker.dir, 'to be', 'ltr');

      dp.hide();
      input.removeAttribute('style');

      dp.show();
      expect(picker.hasAttribute('dir'), 'to be false');

      dp.destroy();
      htmlElem.removeAttribute('dir');
      htmlElem.style.direction = 'ltr';

      const checkDirChange = () => {
        if (window.getComputedStyle(htmlElem).direction === 'ltr') {
          htmlElem.removeAttribute('style');
          done();
        } else {
          setTimeout(checkDirChange, 10);
        }
      };
      checkDirChange();
    });
  });

  describe('picker', function () {
    it('displays current month with current date as focued date if no initial date is provided', function () {
      let clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});

      const {dp, picker} = createDP(input);
      const days = Array.from(picker.querySelector('.datepicker-grid').children);
      dp.show();

      expect(getViewSwitch(picker).textContent, 'to be', 'February 2020');

      expect(days, 'to have length', 42);
      expect(filterCells(days, '.datepicker-cell'), 'to have length', 42);
      expect(days[0].textContent, 'to be', '26');
      expect(days[0].classList.contains('prev'), 'to be true');
      expect(days[0].classList.contains('next'), 'to be false');
      expect(days[5].textContent, 'to be', '31');
      expect(days[5].classList.contains('prev'), 'to be true');
      expect(days[5].classList.contains('next'), 'to be false');
      expect(days[6].textContent, 'to be', '1');
      expect(days[6].classList.contains('prev'), 'to be false');
      expect(days[6].classList.contains('next'), 'to be false');
      expect(days[34].textContent, 'to be', '29');
      expect(days[34].classList.contains('prev'), 'to be false');
      expect(days[34].classList.contains('next'), 'to be false');
      expect(days[35].textContent, 'to be', '1');
      expect(days[35].classList.contains('prev'), 'to be false');
      expect(days[35].classList.contains('next'), 'to be true');
      expect(days[41].textContent, 'to be', '7');
      expect(days[41].classList.contains('prev'), 'to be false');
      expect(days[41].classList.contains('next'), 'to be true');

      expect(filterCells(days, '.focused'), 'to equal', [days[19]]);
      expect(filterCells(days, '.selected'), 'to be empty');
      expect(days[19].textContent, 'to be', '14');

      dp.destroy();
      clock.restore();
    });

    it('displays iniial date\'s month with the date as selected and focued date', function () {
      input.value = '04/22/2020';

      const {dp, picker} = createDP(input);
      const days = Array.from(picker.querySelector('.datepicker-grid').children);
      dp.show();

      expect(getViewSwitch(picker).textContent, 'to be', 'April 2020');

      expect(days, 'to have length', 42);
      expect(filterCells(days, '.datepicker-cell'), 'to have length', 42);
      expect(days[0].textContent, 'to be', '29');
      expect(days[0].classList.contains('prev'), 'to be true');
      expect(days[0].classList.contains('next'), 'to be false');
      expect(days[2].textContent, 'to be', '31');
      expect(days[2].classList.contains('prev'), 'to be true');
      expect(days[2].classList.contains('next'), 'to be false');
      expect(days[3].textContent, 'to be', '1');
      expect(days[3].classList.contains('prev'), 'to be false');
      expect(days[3].classList.contains('next'), 'to be false');
      expect(days[32].textContent, 'to be', '30');
      expect(days[32].classList.contains('prev'), 'to be false');
      expect(days[32].classList.contains('next'), 'to be false');
      expect(days[33].textContent, 'to be', '1');
      expect(days[33].classList.contains('prev'), 'to be false');
      expect(days[33].classList.contains('next'), 'to be true');
      expect(days[41].textContent, 'to be', '9');
      expect(days[41].classList.contains('prev'), 'to be false');
      expect(days[41].classList.contains('next'), 'to be true');

      expect(filterCells(days, '.focused'), 'to equal', [days[24]]);
      expect(filterCells(days, '.selected'), 'to equal', [days[24]]);
      expect(days[24].textContent, 'to be', '22');

      dp.destroy();
      input.value = '';
    });

    it('displays day names of week by default', function () {
      const {dp, picker} = createDP(input);
      const daysOfWeek = picker.querySelector('.days-of-week');
      const days = Array.from(daysOfWeek.children).map(el => el.textContent);

      expect(days, 'to equal', ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

      dp.destroy();
    });

    it('does not display calendar weeks by default', function () {
      const {dp, picker} = createDP(input);

      expect(picker.querySelectorAll('.calendar-weeks').length, 'to be', 0);

      dp.destroy();
    });

    it('uses "button" for the main class of button element', function () {
      const {dp, picker} = createDP(input);
      const [viewSwitch, prevBtn, nextBtn, todayBtn, clearBtn] = getParts(picker, [
        '.view-switch',
        '.prev-btn',
        '.next-btn',
        '.today-btn',
        '.clear-btn',
      ]);

      expect(viewSwitch.className, 'to be', 'button view-switch');
      expect(prevBtn.className, 'to be', 'button prev-btn');
      expect(nextBtn.className, 'to be', 'button next-btn');
      expect(todayBtn.className, 'to be', 'button today-btn');
      expect(clearBtn.className, 'to be', 'button clear-btn');

      dp.destroy();
    });
  });
});
