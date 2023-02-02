describe('events', function () {
  let clock;
  let input;
  let dp;
  let picker;
  let viewSwitch;

  before(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
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
    let spyChangeDate;
    let pickerSnapshot;

    beforeEach(function () {
      dp.show();
      spyChangeDate = sinon.spy(() => {
        const snapshot = dp.picker.element.cloneNode(true);
        pickerSnapshot = {
          viewSwitchLabel: getViewSwitch(snapshot).textContent,
          cells: getCells(snapshot),
        };
      });
      input.addEventListener('changeDate', spyChangeDate);
    });

    afterEach(function () {
      input.removeEventListener('changeDate', spyChangeDate);
      dp.hide();
    });

    it('is triggered when the selection is changed', function () {
      // by setDate()
      dp.setDate('2/14/2020');
      expect(spyChangeDate.calledOnce, 'to be true');
      // triggered after the picker element is updated
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to equal', [19]);

      spyChangeDate.resetHistory();

      // by update()
      input.value = '4/22/2020';
      dp.update();
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'April 2020');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to equal', [24]);

      spyChangeDate.resetHistory();

      // by clicking on a day cell
      getCells(picker)[12].click();
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to equal', [12]);

      spyChangeDate.resetHistory();

      // by hitting enter in edit mode
      dp.enterEditMode();
      input.value = '2/4/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to equal', [9]);

      spyChangeDate.resetHistory();

      // by hitting enter when the picker is hidden
      dp.hide();
      input.value = '3/20/2020';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'March 2020');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to equal', [19]);

      dp.setDate({clear: true});
    });

    it('is triggered when the selection is cleared', function () {
      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by setDate()
      dp.setDate({clear: true});
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to be empty');

      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by update()
      input.value = '';
      dp.update();
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to be empty');

      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by hitting enter in edit mode
      dp.enterEditMode();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to be empty');

      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

      // by hitting enter when the picker is hidden
      dp.hide();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.calledOnce, 'to be true');
      expect(getCellIndices(pickerSnapshot.cells, '.selected'), 'to be empty');
    });

    it('is not triggered when trying to update with the current value', function () {
      dp.setDate('2/14/2020');
      spyChangeDate.resetHistory();

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

      // by hitting enter when the picker is hidden
      dp.hide();
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeDate.called, 'to be false');

      dp.setDate({clear: true});
    });
  });

  describe('changeMonth', function () {
    let spyChangeMonth;
    let pickerSnapshot;

    beforeEach(function () {
      dp.show();
      spyChangeMonth = sinon.spy(() => {
        const snapshot = dp.picker.element.cloneNode(true);
        pickerSnapshot = {
          viewSwitchLabel: getViewSwitch(snapshot).textContent,
          cells: getCells(snapshot),
        };
      });
      input.addEventListener('changeMonth', spyChangeMonth);
    });

    afterEach(function () {
      input.removeEventListener('changeMonth', spyChangeMonth);
      dp.hide();
    });

    it('is triggered when prevButton or nextButton is clicked on days view', function () {
      const [prevButton, nextButton] = getParts(picker, ['.prev-button', '.next-button']);

      prevButton.click();
      expect(spyChangeMonth.calledOnce, 'to be true');
      // triggered after the picker element is updated
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');
      nextButton.click();
      expect(spyChangeMonth.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

      spyChangeMonth.resetHistory();

      // months view
      viewSwitch.click();
      prevButton.click();
      expect(spyChangeMonth.called, 'to be false');
      nextButton.click();
      expect(spyChangeMonth.called, 'to be false');

      // years view
      viewSwitch.click();
      prevButton.click();
      expect(spyChangeMonth.called, 'to be false');
      nextButton.click();
      expect(spyChangeMonth.called, 'to be false');

      // decades view
      viewSwitch.click();
      prevButton.click();
      expect(spyChangeMonth.called, 'to be false');
      nextButton.click();
      expect(spyChangeMonth.called, 'to be false');
    });

    it('is triggered when ctrl + arrow lett/right is pressed on days view', function () {
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeMonth.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeMonth.called, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeMonth.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

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
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');

      getCells(picker)[40].click();
      expect(spyChangeMonth.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

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
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');

      // go back to 2/1
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeMonth.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

      spyChangeMonth.resetHistory();

      // move to 2/3/2020
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});

      // go to 1/27
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');

      // go back to 2/3
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeMonth.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
    });

    it('is triggered when a different month is selected on months view', function () {
      viewSwitch.click();

      getCells(picker)[1].click();
      expect(spyChangeMonth.called, 'to be false');

      viewSwitch.click();
      getCells(picker)[2].click();
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'March 2020');
    });

    it('is triggered when moving month by arrow keys on months view', function () {
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeMonth.callCount, 'to be', 1);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [2]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeMonth.callCount, 'to be', 2);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [1]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeMonth.callCount, 'to be', 3);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [5]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeMonth.callCount, 'to be', 4);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [1]);
    });

    it('is triggered when the selection is updated to a different month by API calls', function () {
      dp.setDate('2/22/2020');
      expect(spyChangeMonth.called, 'to be false');

      dp.setDate('4/22/2020');
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'April 2020');

      input.value = '3/14/2020';
      dp.update();
      expect(spyChangeMonth.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'March 2020');
    });

    it('is triggered when the selection is cleard from a date of a different month from default view date', function () {
      dp.setDate('2/22/2020');
      spyChangeMonth.resetHistory();
      dp.setDate({clear: true});
      expect(spyChangeMonth.called, 'to be false');

      dp.setDate('4/22/2020');
      spyChangeMonth.resetHistory();
      dp.setDate({clear: true});
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

      dp.setDate('4/22/2020');
      spyChangeMonth.resetHistory();
      input.value = '';
      dp.update();
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

      dp.setDate('4/22/2020');
      spyChangeMonth.resetHistory();
      dp.enterEditMode();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
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
      picker.querySelector('.next-button').click();
      spyChangeMonth.resetHistory();

      dp.hide();
      expect(spyChangeMonth.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
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
    let pickerSnapshot;

    beforeEach(function () {
      dp.show();
      spyChangeYear = sinon.spy(() => {
        const snapshot = dp.picker.element.cloneNode(true);
        pickerSnapshot = {
          viewSwitchLabel: getViewSwitch(snapshot).textContent,
          cells: getCells(snapshot),
        };
      });
      input.addEventListener('changeYear', spyChangeYear);
    });

    afterEach(function () {
      input.removeEventListener('changeYear', spyChangeYear);
      dp.hide();
    });

    it('is triggered when prevButton on January on days view or nextButton on December is clicked', function () {
      const [prevButton, nextButton] = getParts(picker, ['.prev-button', '.next-button']);

      // move to 1/15
      prevButton.click();
      spyChangeYear.resetHistory();

      prevButton.click();
      expect(spyChangeYear.calledOnce, 'to be true');
      // triggered after the picker element is updated
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'December 2019');
      nextButton.click();
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');
    });

    it('is triggered when ctrl + arrow lett is pressed on January on days view or right on December', function () {
      // move to 1/15
      picker.querySelector('.prev-button').click();
      spyChangeYear.resetHistory();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.called, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'December 2019');
      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');
    });

    it('is triggered when a previous month\'s day on January or a next month\'s on December is clicked', function () {
      // move to 1/15
      picker.querySelector('.prev-button').click();
      spyChangeYear.resetHistory();

      getCells(picker)[19].click();
      expect(spyChangeYear.called, 'to be false');

      getCells(picker)[2].click();
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'December 2019');

      getCells(picker)[40].click();
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'January 2020');

      dp.setDate({clear: true});
    });

    it('is triggered when prevButton or nextButton is clicked on months view', function () {
      const [prevButton, nextButton] = getParts(picker, ['.prev-button', '.next-button']);
      viewSwitch.click();

      prevButton.click();
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2019');
      nextButton.click();
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020');
    });

    it('is triggered when view month is moved to a previous or next year\'s by arrow keys', function () {
      viewSwitch.click();
      // move to january
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});

      // go to last year's December
      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2019');

      // go back to January
      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020');

      spyChangeYear.resetHistory();

      // go to last year's September
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2019');

      // go back to January
      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020');
    });

    it('is triggered when a different year/decade is selected on years/decades view', function () {
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      // decades view
      getCells(picker)[0].click();
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '1990-1999');

      // years view
      getCells(picker)[2].click();
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '1991');
    });

    it('is triggered when moving year/decade by arrow keys on years/decades view', function () {
      viewSwitch.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.callCount, 'to be', 1);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [2]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.callCount, 'to be', 2);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [1]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeYear.callCount, 'to be', 3);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [5]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeYear.callCount, 'to be', 4);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [1]);

      viewSwitch.click();
      spyChangeYear.resetHistory();

      simulant.fire(input, 'keydown', {key: 'ArrowRight'});
      expect(spyChangeYear.callCount, 'to be', 1);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [4]);

      simulant.fire(input, 'keydown', {key: 'ArrowLeft'});
      expect(spyChangeYear.callCount, 'to be', 2);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [3]);

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyChangeYear.callCount, 'to be', 3);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [7]);

      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeYear.callCount, 'to be', 4);
      expect(getCellIndices(pickerSnapshot.cells, '.focused'), 'to equal', [3]);
    });

    it('is triggered when the selection is updated to a different year by API calls', function () {
      dp.setDate('2/22/2020');
      expect(spyChangeYear.called, 'to be false');

      dp.setDate('4/22/2022');
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'April 2022');

      input.value = '3/14/2018';
      dp.update();
      expect(spyChangeYear.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'March 2018');
    });

    it('is triggered when the selection is cleard from a date of a different year from default view date', function () {
      dp.setDate('2/22/2020');
      spyChangeYear.resetHistory();
      dp.setDate({clear: true});
      expect(spyChangeYear.called, 'to be false');

      dp.setDate('4/22/2022');
      spyChangeYear.resetHistory();
      dp.setDate({clear: true});
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

      dp.setDate('4/22/2022');
      spyChangeYear.resetHistory();
      input.value = '';
      dp.update();
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');

      dp.setDate('4/22/2022');
      spyChangeYear.resetHistory();
      dp.enterEditMode();
      input.value = '';
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
    });

    it('is triggered before changeDate/Month when triggered on change of the selection', function () {
      const spyChangeDate = sinon.spy();
      const spyChangeMonth = sinon.spy();
      input.addEventListener('changeDate', spyChangeDate);
      input.addEventListener('changeMonth', spyChangeMonth);

      dp.setDate('4/22/2022');
      expect(spyChangeDate.called, 'to be true');
      expect(spyChangeMonth.called, 'to be true');
      expect(spyChangeYear.called, 'to be true');
      expect(spyChangeYear.calledBefore(spyChangeDate), 'to be true');
      expect(spyChangeYear.calledBefore(spyChangeMonth), 'to be true');

      input.removeEventListener('changeDate', spyChangeDate);
      input.removeEventListener('changeDate', spyChangeMonth);
      dp.setDate({clear: true});
    });

    it('is triggered when view is reset from different year from default view date on hide', function () {
      picker.querySelector('.prev-button').click();
      picker.querySelector('.prev-button').click();
      spyChangeYear.resetHistory();

      dp.hide();
      expect(spyChangeYear.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
    });

    it('is not triggered when view date is changed to the same year of different decades/century', function () {
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      // decades view
      getCells(picker)[3].click();
      expect(spyChangeYear.called, 'to be false');
      // years view
      getCells(picker)[1].click();
      expect(spyChangeYear.called, 'to be false');

      viewSwitch.click();
      viewSwitch.click();
      // decades view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeYear.called, 'to be false');
      // months view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeYear.called, 'to be false');
    });
  });

  describe('changeView', function () {
    let spyChangeView;
    let pickerSnapshot;

    beforeEach(function () {
      dp.show();
      spyChangeView = sinon.spy(() => {
        const snapshot = dp.picker.element.cloneNode(true);
        pickerSnapshot = {
          viewSwitchLabel: getViewSwitch(snapshot).textContent,
        };
      });
      input.addEventListener('changeView', spyChangeView);
    });

    afterEach(function () {
      input.removeEventListener('changeView', spyChangeView);
      dp.hide();
    });

    it('is triggered when view is changed by clicking view switch', function () {
      viewSwitch.click();
      expect(spyChangeView.calledOnce, 'to be true');
      // triggered after the picker element is updated
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020');

      // on months view
      viewSwitch.click();
      expect(spyChangeView.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020-2029');

      // on years view
      viewSwitch.click();
      expect(spyChangeView.calledThrice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2000-2090');

      // on decades view
      viewSwitch.click();
      expect(spyChangeView.calledThrice, 'to be true');
    });

    it('is triggered when view is changed by pressing ctrl + arrow up', function () {
      simulant.fire(input, 'keydown', {key: 'ArrowUp'});
      expect(spyChangeView.called, 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020');

      // on months view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2020-2029');

      // on years view
      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyChangeView.calledThrice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2000-2090');

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
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2010-2019');

      // on years view
      getCells(picker)[2].click();
      expect(spyChangeView.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2011');

      // on months view
      getCells(picker)[2].click();
      expect(spyChangeView.calledThrice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'March 2011');

      // on days view
      getCells(picker)[12].click();
      expect(spyChangeView.calledThrice, 'to be true');

      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      spyChangeView.resetHistory();

      // on decades view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2010-2019');

      // on years view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledTwice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', '2011');

      // on months view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledThrice, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'March 2011');

      // on days view
      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledThrice, 'to be true');

      simulant.fire(input, 'keydown', {key: 'Enter'});
      expect(spyChangeView.calledThrice, 'to be true');

      dp.setDate({clear: true});
    });

    it('is triggered before changeDate/Month/Year when triggered on change of the selection', function () {
      const spyChangeDate = sinon.spy();
      const spyChangeMonth = sinon.spy();
      const spyChangeYear = sinon.spy();
      input.addEventListener('changeDate', spyChangeDate);
      input.addEventListener('changeMonth', spyChangeMonth);
      input.addEventListener('changeYear', spyChangeYear);

      viewSwitch.click();
      dp.setDate('4/22/2022');
      expect(spyChangeDate.called, 'to be true');
      expect(spyChangeMonth.called, 'to be true');
      expect(spyChangeYear.called, 'to be true');
      expect(spyChangeView.calledBefore(spyChangeDate), 'to be true');
      expect(spyChangeView.calledBefore(spyChangeMonth), 'to be true');
      expect(spyChangeView.calledBefore(spyChangeYear), 'to be true');

      input.removeEventListener('changeDate', spyChangeDate);
      input.removeEventListener('changeDate', spyChangeMonth);
      input.removeEventListener('changeYear', spyChangeYear);
      dp.setDate({clear: true});
    });

    it('is triggered when view is reset on hide', function () {
      viewSwitch.click();
      spyChangeView.resetHistory();

      dp.hide();
      expect(spyChangeView.calledOnce, 'to be true');
      expect(pickerSnapshot.viewSwitchLabel, 'to be', 'February 2020');
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

      spyShow.resetHistory();
      dp.hide();

      // by API call
      dp.show();
      expect(spyShow.called, 'to be true');

      spyShow.resetHistory();
      dp.hide();
      input.blur();

      // by getting focus
      input.focus();
      expect(spyShow.called, 'to be true');

      spyShow.resetHistory();

      // by toggling picker's display by API call
      dp.toggle();  // hiding
      expect(spyShow.called, 'to be false');
      dp.toggle();  // showing
      expect(spyShow.called, 'to be true');

      spyShow.resetHistory();

      // by toggling picker's display by Esc key
      simulant.fire(input, 'keydown', {key: 'Escape'}); // hiding
      expect(spyShow.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'Escape'}); // showing
      expect(spyShow.called, 'to be true');
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
      expect(spyHide.called, 'to be true');

      spyHide.resetHistory();
      dp.show();

      // by clicking outside
      simulant.fire(testContainer, 'mousedown');
      input.blur();
      expect(spyHide.called, 'to be true');

      spyHide.resetHistory();
      input.focus();

      // by pressing tab key
      simulant.fire(input, 'keydown', {key: 'Tab'});
      input.blur();
      expect(spyHide.called, 'to be true');

      spyHide.resetHistory();

      // by toggling picker's display by API call
      dp.toggle(); // showing
      expect(spyHide.called, 'to be false');
      dp.toggle(); // hiding
      expect(spyHide.called, 'to be true');

      spyHide.resetHistory();

      // by toggling picker's display by Esc key
      simulant.fire(input, 'keydown', {key: 'Escape'}); // showing
      expect(spyHide.called, 'to be false');
      simulant.fire(input, 'keydown', {key: 'Escape'}); // hiding
      expect(spyHide.called, 'to be true');
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
