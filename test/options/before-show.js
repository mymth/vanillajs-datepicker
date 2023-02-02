describe('options - beforeShow hooks', function () {
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

  describe('beforeShowDay', function () {
    it('disables the date when it returns false', function () {
      const beforeShowDay = date => !!(date.getDate() % 10);
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [4, 15, 25]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['30', '10', '20']);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [9, 19, 29, 40]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['10', '20', '30', '10']);

      dp.destroy();
    });

    it('adds classes to the date when it returns spece separated classes', function () {
      const beforeShowDay = date => date.getDate() % 10 ? undefined : 'foo bar';
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [4, 15, 25]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['30', '10', '20']);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [9, 19, 29, 40]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['10', '20', '30', '10']);

      dp.destroy();
    });

    it('disables the date when the return contains enabled: false', function () {
      const beforeShowDay = date => ({enabled: !!(date.getDate() % 10)});
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [4, 15, 25]);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [9, 19, 29, 40]);

      dp.destroy();
    });

    it('adds classes to the date when the return contains space separated classes in the classes property', function () {
      const beforeShowDay = date => date.getDate() % 10 ? undefined : {classes: 'foo bar'};
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [4, 15, 25]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [9, 19, 29, 40]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      dp.destroy();
    });

    it('uses custom content to the date cell when the return contains text/html in the content property', function () {
      const beforeShowDay = (date) => date.getDate() % 10 === 4 ? {content: '<em>❤️</em>'} : undefined;
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let ccCellIndices = getCellIndices(cells, el => el.children.length > 0);

      expect(ccCellIndices, 'to equal', [9, 19, 29, 38]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].innerHTML, 'to be', '<em>❤️</em>');
      });

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      ccCellIndices = getCellIndices(cells, el => el.children.length > 0);

      expect(ccCellIndices, 'to equal', [3, 13, 23, 34]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].innerHTML, 'to be', '<em>❤️</em>');
      });

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({beforeShowDay: date => !!(date.getDate() % 10)});
      dp.show();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [4, 15, 25]);

      dp.hide();
      dp.setOptions({beforeShowDay: null});
      dp.show();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');
      expect(disabledCellIndices, 'to equal', []);

      dp.destroy();
    });
  });

  describe('beforeShowMonth', function () {
    it('disables the month on months view when it returns false', function () {
      const beforeShowMonth = date => !!(date.getMonth() % 5);
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [0, 5, 10]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [0, 5, 10]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      dp.destroy();
    });

    it('adds classes to the month on months view when it returns spece separated classes', function () {
      const beforeShowMonth = date => date.getMonth() % 5 ? undefined : 'foo bar';
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [0, 5, 10]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [0, 5, 10]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      dp.destroy();
    });

    it('disables the month on months view when the return contains enabled: false', function () {
      const beforeShowMonth = date => ({enabled: !!(date.getMonth() % 5)});
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [0, 5, 10]);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [0, 5, 10]);

      dp.destroy();
    });

    it('adds classes to the month on months view when the return contains space separated classes in the classes property', function () {
      const beforeShowMonth = date => date.getMonth() % 5 ? undefined : {classes: 'foo bar'};
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [0, 5, 10]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [0, 5, 10]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      dp.destroy();
    });

    it('uses custom content to the month cell when the return contains text/html in the content property', function () {
      const beforeShowMonth = (date) => (date.getMonth() + date.getFullYear() % 10) % 10 ? undefined : {content: '🍀'};
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let ccCellIndices = getCellIndices(cells, el => el.textContent.length < 3);

      expect(ccCellIndices, 'to equal', [0, 10]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].textContent, 'to be', '🍀');
      });

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      ccCellIndices = getCellIndices(cells, el => el.textContent.length  < 3);

      expect(ccCellIndices, 'to equal', [9]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].textContent, 'to be', '🍀');
      });

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.setOptions({beforeShowMonth: date => !!(date.getMonth() % 5)});
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [0, 5, 10]);

      dp.hide();
      dp.setOptions({beforeShowMonth: null});
      dp.show();
      viewSwitch.click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');
      expect(disabledCellIndices, 'to equal', []);

      dp.destroy();
    });
  });

  describe('beforeShowYear', function () {
    it('disables the year on years view when it returns false', function () {
      const beforeShowYear = date => !!(date.getFullYear() % 4);
      const {dp, picker} = createDP(input, {beforeShowYear});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [1, 5, 9]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2020', '2024', '2028',]);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [3, 7, 11]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2032', '2036', '2040']);

      dp.destroy();
    });

    it('adds classes to the year on years view when it returns spece separated classes', function () {
      const beforeShowYear = date => date.getFullYear() % 4 ? undefined : 'foo bar';
      const {dp, picker} = createDP(input, {beforeShowYear});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [1, 5, 9]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2020', '2024', '2028']);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [3, 7, 11]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2032', '2036', '2040']);

      dp.destroy();
    });

    it('disables the year on years view when the return contains enabled: false', function () {
      const beforeShowYear = date => ({enabled: !!(date.getFullYear() % 4)});
      const {dp, picker} = createDP(input, {beforeShowYear});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [1, 5, 9]);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [3, 7, 11]);

      dp.destroy();
    });

    it('adds classes to the year on years view when the return contains space separated classes in the classes property', function () {
      const beforeShowYear = date => date.getFullYear() % 4 ? undefined : {classes: 'foo bar'};
      const {dp, picker} = createDP(input, {beforeShowYear});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [1, 5, 9]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [3, 7, 11]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      dp.destroy();
    });

    it('uses custom content to the year cell when the return contains text/html in the content property', function () {
      const beforeShowYear = (date) => {
        const year = date.getFullYear();
        return year % 4 || !(year % 40) ? undefined : {content: '<i class="icn-x"></i>'};
      };
      const {dp, picker} = createDP(input, {beforeShowYear});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let ccCellIndices = getCellIndices(cells, el => el.children.length > 0);

      expect(ccCellIndices, 'to equal', [1, 5, 9]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].innerHTML, 'to be', '<i class="icn-x"></i>');
      });

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      ccCellIndices = getCellIndices(cells, el => el.children.length > 0);

      expect(ccCellIndices, 'to equal', [3, 7]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].innerHTML, 'to be', '<i class="icn-x"></i>');
      });

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.setOptions({beforeShowYear: date => !!(date.getFullYear() % 4)});
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [1, 5, 9]);

      dp.hide();
      dp.setOptions({beforeShowYear: null});
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');
      expect(disabledCellIndices, 'to equal', []);

      dp.destroy();
    });
  });

  describe('beforeShowDecade', function () {
    it('disables the decade on decades view when it returns false', function () {
      const beforeShowDecade = date => !!((date.getFullYear() / 10) % 4);
      const {dp, picker} = createDP(input, {beforeShowDecade});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [1, 5, 9]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2000', '2040', '2080',]);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [3, 7, 11]);
      expect(disabledCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2120', '2160', '2200']);

      dp.destroy();
    });

    it('adds classes to the decade on decades view when it returns spece separated classes', function () {
      const beforeShowDecade = date => (date.getFullYear() / 10) % 4 ? undefined : 'foo bar';
      const {dp, picker} = createDP(input, {beforeShowDecade});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [1, 5, 9]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2000', '2040', '2080']);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [3, 7, 11]);
      expect(barCellIndices, 'to equal', fooCellIndices);
      expect(fooCellIndices.map(idx => cells[idx].textContent), 'to equal', ['2120', '2160', '2200']);

      dp.destroy();
    });

    it('disables the decade on decades view when the return contains enabled: false', function () {
      const beforeShowDecade = date => ({enabled: !!((date.getFullYear() / 10) % 4)});
      const {dp, picker} = createDP(input, {beforeShowDecade});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [1, 5, 9]);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [3, 7, 11]);

      dp.destroy();
    });

    it('adds classes to the decade on decades view when the return contains space separated classes in the classes property', function () {
      const beforeShowDecade = date => (date.getFullYear() / 10) % 4 ? undefined : {classes: 'foo bar'};
      const {dp, picker} = createDP(input, {beforeShowDecade});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCellIndices = getCellIndices(cells, '.foo');
      let barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [1, 5, 9]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      fooCellIndices = getCellIndices(cells, '.foo');
      barCellIndices = getCellIndices(cells, '.bar');

      expect(fooCellIndices, 'to equal', [3, 7, 11]);
      expect(barCellIndices, 'to equal', fooCellIndices);

      dp.destroy();
    });

    it('uses custom content to the decade cell when the return contains text/html in the content property', function () {
      const beforeShowDecade = (date) => {
        const dec = date.getFullYear() / 10;
        return (dec + Math.floor(dec / 10) % 10) % 5 ? undefined : {content: '<strong>X</strong>'};
      };
      const {dp, picker} = createDP(input, {beforeShowDecade});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let ccCellIndices = getCellIndices(cells, el => el.children.length > 0);

      expect(ccCellIndices, 'to equal', [1, 6]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].innerHTML, 'to be', '<strong>X</strong>');
      });

      picker.querySelector('.next-button').click();

      cells = getCells(picker);
      ccCellIndices = getCellIndices(cells, el => el.children.length > 0);

      expect(ccCellIndices, 'to equal', [5, 10]);
      ccCellIndices.forEach((idx) => {
        expect(cells[idx].innerHTML, 'to be', '<strong>X</strong>');
      });

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      dp.setOptions({beforeShowDecade: date => !!((date.getFullYear() / 10) % 4)});
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCellIndices = getCellIndices(cells, '.disabled');

      expect(disabledCellIndices, 'to equal', [1, 5, 9]);

      dp.hide();
      dp.setOptions({beforeShowDecade: null});
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      cells = getCells(picker);
      disabledCellIndices = getCellIndices(cells, '.disabled');
      expect(disabledCellIndices, 'to equal', []);

      dp.destroy();
    });
  });
});
