describe('options - beforeShow hooks', function () {
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

  describe('beforeShowDay', function () {
    it('disables the date when it returns false', function () {
      const beforeShowDay = date => !!(date.getDate() % 10);
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[4], cells[15], cells[25]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['30', '10', '20']);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[9], cells[19], cells[29], cells[40]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['10', '20', '30', '10']);

      dp.destroy();
    });

    it('adds classes to the date when it returns spece separated classes', function () {
      const beforeShowDay = date => date.getDate() % 10 ? undefined : 'foo bar';
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[4], cells[15], cells[25]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['30', '10', '20']);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[9], cells[19], cells[29], cells[40]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['10', '20', '30', '10']);

      dp.destroy();
    });

    it('disables the date when the return contains enabled: false', function () {
      const beforeShowDay = date => ({enabled: !!(date.getDate() % 10)});
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[4], cells[15], cells[25]]);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[9], cells[19], cells[29], cells[40]]);

      dp.destroy();
    });

    it('adds classes to the date when the return contains space separated classes in the classes property', function () {
      const beforeShowDay = date => date.getDate() % 10 ? undefined : {classes: 'foo bar'};
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[4], cells[15], cells[25]]);
      expect(barCells, 'to equal', fooCells);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[9], cells[19], cells[29], cells[40]]);
      expect(barCells, 'to equal', fooCells);

      dp.destroy();
    });

    it('uses custom content to the date cell when the return contains text/html in the content property', function () {
      const beforeShowDay = (date) => date.getDate() % 10 === 4 ? {content: '<em>❤️</em>'} : undefined;
      const {dp, picker} = createDP(input, {beforeShowDay});
      let cells = getCells(picker);
      let ccCells = cells.filter(el => el.children.length > 0);

      expect(ccCells, 'to equal', [cells[9], cells[19], cells[29], cells[38]]);
      ccCells.forEach((cell) => {
        expect(cell.innerHTML, 'to be', '<em>❤️</em>');
      });

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      ccCells = cells.filter(el => el.children.length > 0);

      expect(ccCells, 'to equal', [cells[3], cells[13], cells[23], cells[34]]);
      ccCells.forEach((cell) => {
        expect(cell.innerHTML, 'to be', '<em>❤️</em>');
      });

      dp.destroy();
    });

    it('can be updated with setOptions()', function () {
      const {dp, picker} = createDP(input);
      dp.setOptions({beforeShowDay: date => !!(date.getDate() % 10)});
      dp.show();

      let cells = getCells(picker);
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[4], cells[15], cells[25]]);

      dp.hide();
      dp.setOptions({beforeShowDay: null});
      dp.show();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');
      expect(disabledCells, 'to equal', []);

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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[0], cells[5], cells[10]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[0], cells[5], cells[10]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      dp.destroy();
    });

    it('adds classes to the month on months view when it returns spece separated classes', function () {
      const beforeShowMonth = date => date.getMonth() % 5 ? undefined : 'foo bar';
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[0], cells[5], cells[10]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[0], cells[5], cells[10]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['Jan', 'Jun', 'Nov']);

      dp.destroy();
    });

    it('disables the month on months view when the return contains enabled: false', function () {
      const beforeShowMonth = date => ({enabled: !!(date.getMonth() % 5)});
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[0], cells[5], cells[10]]);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[0], cells[5], cells[10]]);

      dp.destroy();
    });

    it('adds classes to the month on months view when the return contains space separated classes in the classes property', function () {
      const beforeShowMonth = date => date.getMonth() % 5 ? undefined : {classes: 'foo bar'};
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[0], cells[5], cells[10]]);
      expect(barCells, 'to equal', fooCells);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[0], cells[5], cells[10]]);
      expect(barCells, 'to equal', fooCells);

      dp.destroy();
    });

    it('uses custom content to the month cell when the return contains text/html in the content property', function () {
      const beforeShowMonth = (date) => (date.getMonth() + date.getFullYear() % 10) % 10 ? undefined : {content: '🍀'};
      const {dp, picker} = createDP(input, {beforeShowMonth});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();

      let cells = getCells(picker);
      let ccCells = cells.filter(el => el.textContent.length < 3);

      expect(ccCells, 'to equal', [cells[0], cells[10]]);
      ccCells.forEach((cell) => {
        expect(cell.textContent, 'to be', '🍀');
      });

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      ccCells = cells.filter(el => el.textContent.length  < 3);

      expect(ccCells, 'to equal', [cells[9]]);
      ccCells.forEach((cell) => {
        expect(cell.textContent, 'to be', '🍀');
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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[0], cells[5], cells[10]]);

      dp.hide();
      dp.setOptions({beforeShowMonth: null});
      dp.show();
      viewSwitch.click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');
      expect(disabledCells, 'to equal', []);

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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[1], cells[5], cells[9]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['2020', '2024', '2028',]);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[3], cells[7], cells[11]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['2032', '2036', '2040']);

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
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[1], cells[5], cells[9]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['2020', '2024', '2028']);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[3], cells[7], cells[11]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['2032', '2036', '2040']);

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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[1], cells[5], cells[9]]);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[3], cells[7], cells[11]]);

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
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[1], cells[5], cells[9]]);
      expect(barCells, 'to equal', fooCells);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[3], cells[7], cells[11]]);
      expect(barCells, 'to equal', fooCells);

      dp.destroy();
    });

    it('uses custom content to the year cell when the return contains text/html in the content property', function () {
      const beforeShowYear = (date) => {
        const year = date.getFullYear();
        return (year + Math.floor(year / 10) % 10) % 4 ? undefined : {content: '<i class="icn-x"></i>'};
      };
      const {dp, picker} = createDP(input, {beforeShowYear});
      const viewSwitch = getViewSwitch(picker);
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      let cells = getCells(picker);
      let ccCells = cells.filter(el => el.children.length > 0);

      expect(ccCells, 'to equal', [cells[1], cells[5], cells[9]]);
      ccCells.forEach((cell) => {
        expect(cell.innerHTML, 'to be', '<i class="icn-x"></i>');
      });

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      ccCells = cells.filter(el => el.children.length > 0);

      expect(ccCells, 'to equal', [cells[2], cells[6], cells[10]]);
      ccCells.forEach((cell) => {
        expect(cell.innerHTML, 'to be', '<i class="icn-x"></i>');
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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[1], cells[5], cells[9]]);

      dp.hide();
      dp.setOptions({beforeShowYear: null});
      dp.show();
      viewSwitch.click();
      viewSwitch.click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');
      expect(disabledCells, 'to equal', []);

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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[1], cells[5], cells[9]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['2000', '2040', '2080',]);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[3], cells[7], cells[11]]);
      expect(disabledCells.map(el => el.textContent), 'to equal', ['2120', '2160', '2200']);

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
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[1], cells[5], cells[9]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['2000', '2040', '2080']);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[3], cells[7], cells[11]]);
      expect(barCells, 'to equal', fooCells);
      expect(fooCells.map(el => el.textContent), 'to equal', ['2120', '2160', '2200']);

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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[1], cells[5], cells[9]]);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[3], cells[7], cells[11]]);

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
      let fooCells = filterCells(cells, '.foo');
      let barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[1], cells[5], cells[9]]);
      expect(barCells, 'to equal', fooCells);

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      fooCells = filterCells(cells, '.foo');
      barCells = filterCells(cells, '.bar');

      expect(fooCells, 'to equal', [cells[3], cells[7], cells[11]]);
      expect(barCells, 'to equal', fooCells);

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
      let ccCells = cells.filter(el => el.children.length > 0);

      expect(ccCells, 'to equal', [cells[1], cells[6]]);
      ccCells.forEach((cell) => {
        expect(cell.innerHTML, 'to be', '<strong>X</strong>');
      });

      picker.querySelector('.next-btn').click();

      cells = getCells(picker);
      ccCells = cells.filter(el => el.children.length > 0);

      expect(ccCells, 'to equal', [cells[5], cells[10]]);
      ccCells.forEach((cell) => {
        expect(cell.innerHTML, 'to be', '<strong>X</strong>');
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
      let disabledCells = filterCells(cells, '.disabled');

      expect(disabledCells, 'to equal', [cells[1], cells[5], cells[9]]);

      dp.hide();
      dp.setOptions({beforeShowDecade: null});
      dp.show();
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();

      cells = getCells(picker);
      disabledCells = filterCells(cells, '.disabled');
      expect(disabledCells, 'to equal', []);

      dp.destroy();
    });
  });
});
