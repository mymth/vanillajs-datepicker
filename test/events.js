describe('events', function () {
  let clock;
  let input;
  let dp;
  let picker;
  let viewSwitch;

  before(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14)});
    input = document.createElement('input');
    testContainer.appendChild(input);
    ({dp, picker} = createDP(input));
    viewSwitch = getViewSwitch(picker);
  });

  after(function () {
    dp.destroy();
    testContainer.removeChild(input);
    clock.restore();
  });

  describe('changeDate', function () {
    it('is triggered when the selection is changed', function () {
      const spyChangeDate = sinon.spy();
      input.addEventListener('changeDate', spyChangeDate);

      // by setDate()
      dp.setDate('2/14/2020');
      expect(spyChangeDate.calledOnce, 'to be true');

      spyChangeDate.resetHistory();

      // by update()
      input.value = '4/22/2020';
      dp.update();
      expect(spyChangeDate.calledOnce, 'to be true');

      spyChangeDate.resetHistory();

      // by clicking on a day cell
      getCells(picker)[12].click();
      expect(spyChangeDate.calledOnce, 'to be true');

      spyChangeDate.resetHistory();

      // by hitting enter in edit mode
      dp.enterEditMode();
      input.value = '2/4/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');

      spyChangeDate.resetHistory();

      // by hittin enter when the picker is hidden
      dp.hide();
      input.value = '3/20/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');

      input.removeEventListener('changeDate', spyChangeDate);
      dp.setDate({clear: true});
    });

    it('is triggered when the selection is cleared', function () {
      const spyChangeDate = sinon.spy();
      dp.setDate('2/14/2020');
      input.addEventListener('changeDate', spyChangeDate);

      // by setDate()
      dp.setDate({clear: true});
      expect(spyChangeDate.calledOnce, 'to be true');

      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by update()
      input.value = '';
      dp.update();
      expect(spyChangeDate.calledOnce, 'to be true');

      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by hitting enter in edit mode
      dp.enterEditMode();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');

      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by hittin enter when the picker is hidden
      dp.hide();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');

      input.removeEventListener('changeDate', spyChangeDate);
    });

    it('is not triggered when trying to update with the current value', function () {
      const spyChangeDate = sinon.spy();
      dp.setDate('2/14/2020');
      input.addEventListener('changeDate', spyChangeDate);

      // by setDate()
      dp.setDate('2/14/2020');
      expect(spyChangeDate.called, 'to be false');

      // by update()
      dp.update();
      expect(spyChangeDate.called, 'to be false');

      // by clicking on a day cell
      getCells(picker)[19].click();
      expect(spyChangeDate.called, 'to be false');

      // by hitting enter in edit mode
      dp.enterEditMode();
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.called, 'to be false');

      // by hittin enter when the picker is hidden
      dp.hide();
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.called, 'to be false');

      input.removeEventListener('changeDate', spyChangeDate);
      dp.setDate({clear: true});
    });
  });

  describe('changeMonth', function () {
    let spyChangeMonth;

    beforeEach(function () {
      dp.show();
      spyChangeMonth = sinon.spy();
      input.addEventListener('changeMonth', spyChangeMonth);
    });

    afterEach(function () {
      input.removeEventListener('changeMonth', spyChangeMonth);
      dp.hide();
    });

    it('is triggered when prevBtn or nextBtn is clicked on days view', function () {
      const [prevBtn, nextBtn] = getParts(picker, ['.prev-btn', '.next-btn']);

      prevBtn.click();
      expect(spyChangeMonth.calledOnce, 'to be true');
      nextBtn.click();
      expect(spyChangeMonth.calledTwice, 'to be true');

      spyChangeMonth.resetHistory();

      // months view
      viewSwitch.click();
      prevBtn.click();
      expect(spyChangeMonth.called, 'to be false');
      nextBtn.click();
      expect(spyChangeMonth.called, 'to be false');

      // years view
      viewSwitch.click();
      prevBtn.click();
      expect(spyChangeMonth.called, 'to be false');
      nextBtn.click();
      expect(spyChangeMonth.called, 'to be false');

      // decades view
      viewSwitch.click();
      prevBtn.click();
      expect(spyChangeMonth.called, 'to be false');
      nextBtn.click();
      expect(spyChangeMonth.called, 'to be false');
    });

    it('is triggered when ctrl + arrow lett/right is pressed on days view', function () {
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeMonth.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeMonth.called, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeMonth.calledOnce, 'to be true');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeMonth.calledTwice, 'to be true');

      spyChangeMonth.resetHistory();

      // months view
      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeMonth.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeMonth.called, 'to be false');

      // years view
      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeMonth.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeMonth.called, 'to be false');

      // decades view
      viewSwitch.click();
      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeMonth.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeMonth.called, 'to be false');
    });

    it('is triggered when a previous or next month\'s day is clicked', function () {
      getCells(picker)[19].click();
      expect(spyChangeMonth.called, 'to be false');

      getCells(picker)[2].click();
      expect(spyChangeMonth.calledOnce, 'to be true');

      getCells(picker)[40].click();
      expect(spyChangeMonth.calledTwice, 'to be true');

      dp.setDate({clear: true});
    });

    it('is triggered when view date is moved to a previous or next month\'s day by arrow keys', function () {
      // move to 2/1/2020
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});

      // go to 1/31
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeMonth.calledOnce, 'to be true');

      // go back to 2/1
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeMonth.calledTwice, 'to be true');

      spyChangeMonth.resetHistory();

      // move to 2/3/2020
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});

      // go to 1/27
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeMonth.calledOnce, 'to be true');

      // go back to 2/3
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeMonth.calledTwice, 'to be true');
    });

    it('is triggered when a different month is seleced on months view', function () {
      viewSwitch.click();

      getCells(picker)[1].click();
      expect(spyChangeMonth.called, 'to be false');

      viewSwitch.click();
      getCells(picker)[2].click();
      expect(spyChangeMonth.calledOnce, 'to be true');
    });

    it('is triggered when moving month by arrow keys on months view', function () {
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeMonth.callCount, 'to be', 1);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeMonth.callCount, 'to be', 2);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeMonth.callCount, 'to be', 3);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeMonth.callCount, 'to be', 4);
    });

    it('is triggered when the selection is updated to a different month by API calls', function () {
      dp.setDate('2/22/2020');
      expect(spyChangeMonth.called, 'to be false');

      dp.setDate('4/22/2020');
      expect(spyChangeMonth.calledOnce, 'to be true');

      input.value = '3/14/2020';
      dp.update();
      expect(spyChangeMonth.calledTwice, 'to be true');
    });

    it('is triggered when the selection is cleard from a date of a different month from default view date', function () {
      dp.setDate('2/22/2020');
      spyChangeMonth.resetHistory();
      dp.setDate({clear: true});
      expect(spyChangeMonth.called, 'to be false');

      dp.setDate('4/22/2020');
      spyChangeMonth.resetHistory();
      input.value = '';
      dp.update();
      expect(spyChangeMonth.calledOnce, 'to be true');

      dp.setDate('4/22/2020');
      spyChangeMonth.resetHistory();
      dp.enterEditMode();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeMonth.calledOnce, 'to be true');
    });

    it('is triggered before changeDate when triggered on change of the selection', function () {
      const spyChangeDate = sinon.spy();
      input.addEventListener('changeDate', spyChangeDate);

      dp.setDate('4/22/2020');
      expect(spyChangeDate.called, 'to be true');
      expect(spyChangeMonth.called, 'to be true');
      expect(spyChangeMonth.calledBefore(spyChangeDate), 'to be true');

      input.removeEventListener('changeDate', spyChangeDate);
      dp.setDate({clear: true});
    });

    it('is triggered when view is reset from different month from default view date on hide', function () {
      picker.querySelector('.next-btn').click();
      spyChangeMonth.resetHistory();

      dp.hide();
      expect(spyChangeMonth.calledOnce, 'to be true');
    });

    it('is not triggered when view date is changed to the same month of different year', function () {
      viewSwitch.click();
      viewSwitch.click();
      // years view
      getCells(picker)[3].click();
      expect(spyChangeMonth.called, 'to be false');
      // months view
      getCells(picker)[1].click();
      expect(spyChangeMonth.called, 'to be false');

      viewSwitch.click();
      viewSwitch.click();
      // years view
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeMonth.called, 'to be false');
      // months view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeMonth.called, 'to be false');
    });
  });

  describe('changeYear', function () {
    let spyChangeYear;

    beforeEach(function () {
      dp.show();
      spyChangeYear = sinon.spy();
      input.addEventListener('changeYear', spyChangeYear);
    });

    afterEach(function () {
      input.removeEventListener('changeYear', spyChangeYear);
      dp.hide();
    });

    it('is triggered when prevBtn on January on days view or nextBtn on December is clicked', function () {
      const [prevBtn, nextBtn] = getParts(picker, ['.prev-btn', '.next-btn']);

      // move to 1/15
      prevBtn.click();
      spyChangeYear.resetHistory();

      prevBtn.click();
      expect(spyChangeYear.calledOnce, 'to be true');
      nextBtn.click();
      expect(spyChangeYear.calledTwice, 'to be true');
    });

    it('is triggered when ctrl + arrow lett is pressed on January on days view or right on December', function () {
      // move to 1/15
      picker.querySelector('.prev-btn').click();
      spyChangeYear.resetHistory();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.called, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeYear.calledOnce, 'to be true');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeYear.calledTwice, 'to be true');
    });

    it('is triggered when a previous month\'s day on January or a next month\'s on December is clicked', function () {
      // move to 1/15
      picker.querySelector('.prev-btn').click();
      spyChangeYear.resetHistory();

      getCells(picker)[19].click();
      expect(spyChangeYear.called, 'to be false');

      getCells(picker)[2].click();
      expect(spyChangeYear.calledOnce, 'to be true');

      getCells(picker)[40].click();
      expect(spyChangeYear.calledTwice, 'to be true');

      dp.setDate({clear: true});
    });

    it('is triggered when prevBtn or nextBtn is clicked on months view', function () {
      const [prevBtn, nextBtn] = getParts(picker, ['.prev-btn', '.next-btn']);
      viewSwitch.click();

      prevBtn.click();
      expect(spyChangeYear.calledOnce, 'to be true');
      nextBtn.click();
      expect(spyChangeYear.calledTwice, 'to be true');
    });

    it('is triggered when view month is moved to a previous or next year\'s by arrow keys', function () {
      viewSwitch.click();
      // move to january
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});

      // go to last year's December
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.calledOnce, 'to be true');

      // go back to January
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.calledTwice, 'to be true');

      spyChangeYear.resetHistory();

      // go to last year's September
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeYear.calledOnce, 'to be true');

      // go back to January
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeYear.calledTwice, 'to be true');
    });

    it('is triggered when a different year/decade is seleced on years/decades view', function () {
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      // decades view
      getCells(picker)[0].click();
      expect(spyChangeYear.calledOnce, 'to be true');

      // years view
      getCells(picker)[2].click();
      expect(spyChangeYear.calledTwice, 'to be true');

      viewSwitch.click();
      viewSwitch.click();
      spyChangeYear.resetHistory();

      // decades view
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeYear.calledOnce, 'to be true');

      // years view
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeYear.calledTwice, 'to be true');
    });

    it('is triggered when moving year/decade by arrow keys on years/decades view', function () {
      viewSwitch.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.callCount, 'to be', 1);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.callCount, 'to be', 2);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeYear.callCount, 'to be', 3);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeYear.callCount, 'to be', 4);

      viewSwitch.click();
      spyChangeYear.resetHistory();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.callCount, 'to be', 1);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.callCount, 'to be', 2);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeYear.callCount, 'to be', 3);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeYear.callCount, 'to be', 4);
    });

    it('is triggered when the selection is updated to a different year by API calls', function () {
      dp.setDate('2/22/2020');
      expect(spyChangeYear.called, 'to be false');

      dp.setDate('4/22/2022');
      expect(spyChangeYear.calledOnce, 'to be true');

      input.value = '3/14/2018';
      dp.update();
      expect(spyChangeYear.calledTwice, 'to be true');
    });

    it('is triggered when the selection is cleard from a date of a different year from default view date', function () {
      dp.setDate('2/22/2020');
      spyChangeYear.resetHistory();
      dp.setDate({clear: true});
      expect(spyChangeYear.called, 'to be false');

      dp.setDate('4/22/2022');
      spyChangeYear.resetHistory();
      input.value = '';
      dp.update();
      expect(spyChangeYear.calledOnce, 'to be true');

      dp.setDate('4/22/2022');
      spyChangeYear.resetHistory();
      dp.enterEditMode();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeYear.calledOnce, 'to be true');
    });

    it('is triggered before changeDate when triggered on change of the selection', function () {
      const spyChangeDate = sinon.spy();
      input.addEventListener('changeDate', spyChangeDate);

      dp.setDate('4/22/2022');
      expect(spyChangeDate.called, 'to be true');
      expect(spyChangeYear.called, 'to be true');
      expect(spyChangeYear.calledBefore(spyChangeDate), 'to be true');

      input.removeEventListener('changeDate', spyChangeDate);
      dp.setDate({clear: true});
    });

    it('is triggered when view is reset from different year from default view date on hide', function () {
      picker.querySelector('.prev-btn').click();
      picker.querySelector('.prev-btn').click();
      spyChangeYear.resetHistory();

      dp.hide();
      expect(spyChangeYear.calledOnce, 'to be true');
    });
  });

  describe('changeView', function () {
    let spyChangeView;

    beforeEach(function () {
      dp.show();
      spyChangeView = sinon.spy();
      input.addEventListener('changeView', spyChangeView);
    });

    afterEach(function () {
      input.removeEventListener('changeView', spyChangeView);
      dp.hide();
    });

    it('is triggered when view is changed by clicking view switch', function () {
      viewSwitch.click();
      expect(spyChangeView.calledOnce, 'to be true');

      // on months view
      viewSwitch.click();
      expect(spyChangeView.calledTwice, 'to be true');

      // on years view
      viewSwitch.click();
      expect(spyChangeView.calledThrice, 'to be true');

      // on decades view
      viewSwitch.click();
      expect(spyChangeView.calledThrice, 'to be true');
    });

    it('is triggered when view is changed by pressing ctrl + arrow up', function () {
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeView.called, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledOnce, 'to be true');

      // on months view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledTwice, 'to be true');

      // on years view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledThrice, 'to be true');

      // on decades view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledThrice, 'to be true');
    });

    it('is triggered when view is changed by seleting a decade/year/month on decades/years/months view', function () {
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      spyChangeView.resetHistory();

      // on decades view
      getCells(picker)[2].click();
      expect(spyChangeView.calledOnce, 'to be true');

      // on years view
      getCells(picker)[2].click();
      expect(spyChangeView.calledTwice, 'to be true');

      // on months view
      getCells(picker)[2].click();
      expect(spyChangeView.calledThrice, 'to be true');

      // on days view
      getCells(picker)[12].click();
      expect(spyChangeView.calledThrice, 'to be true');

      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      spyChangeView.resetHistory();

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledOnce, 'to be true');

      // on decades view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledTwice, 'to be true');

      // on years view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledThrice, 'to be true');

      // on months view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledThrice, 'to be true');

      // on days view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledThrice, 'to be true');
    });

    it('is triggered when view is reset on hide', function () {
      viewSwitch.click();
      spyChangeView.resetHistory();

      dp.hide();
      expect(spyChangeView.calledOnce, 'to be true');
    });
  });

  describe('show', function () {
    let spyShow;

    beforeEach(function () {
      dp.show();
      spyShow = sinon.spy();
      input.addEventListener('show', spyShow);
    });

    afterEach(function () {
      input.removeEventListener('show', spyShow);
      dp.hide();
    });

    it('is triggered when the picker becomes visible', function () {
      // not triggered if already shown
      dp.show();
      expect(spyShow.called, 'to be false');

      dp.hide();
      // by API call
      dp.show();
      expect(spyShow.calledOnce, 'to be true');

      dp.hide();
      input.blur();
      // by getting focus
      input.focus();
      expect(spyShow.calledTwice, 'to be true');

      // by toggling visibility by Esc key
      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(spyShow.calledTwice, 'to be true');
      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(spyShow.calledThrice, 'to be true');
    });
  });

  describe('hide', function () {
    let spyHide;

    beforeEach(function () {
      dp.show();
      spyHide = sinon.spy();
      input.addEventListener('hide', spyHide);
    });

    afterEach(function () {
      input.removeEventListener('hide', spyHide);
      dp.hide();
    });

    it('is triggered when the picker becomes hidden', function () {
      // by API call
      dp.hide();
      expect(spyHide.callCount, 'to be', 1);

      dp.show();
      // by clicking outside
      simulant.fire(testContainer, 'mousedown');
      expect(spyHide.callCount, 'to be', 2);

      dp.show();
      // by pressing tab key
      simulant.fire(input, 'keydown', {key: 'Tab'});
      expect(spyHide.callCount, 'to be', 3);

      dp.show();
      // by toggling visibility by Esc key
      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(spyHide.callCount, 'to be', 4);
    });
  });

  describe('event object', function () {
    const stubChangeDate = (ev) => {
      eventObj = ev;
    };
    let eventObj;

    before(function () {
      input.addEventListener('changeDate', stubChangeDate);
      dp.setDate('2/14/2020');
    });

    after(function () {
      input.removeEventListener('changeDate', stubChangeDate);
    });

    it('is a custom event object', function () {
      expect(eventObj, 'to be a', CustomEvent);
    });

    it('has the result of getDate() in detail.date', function () {
      expect(eventObj.detail.date, 'to equal', dp.getDate());
    });

    it('has a date object of view date in detail.viewDate', function () {
      expect(eventObj.detail.viewDate, 'to be a date');
      expect(eventObj.detail.viewDate.getTime(), 'to be', dateValue(2020, 1, 14));
    });

    it('has view mode of current view in detail.viewId', function () {
      expect(eventObj.detail.viewId, 'to be', 0);
    });

    it('has the Datepicker instance in detail.datepicker', function () {
      expect(eventObj.detail.datepicker, 'to be', dp);
    });
  });
});
