describe('options - shortcutKeys', function () {
  let clock;
  let input;
  let outer;

  beforeEach(function () {
    clock = sinon.useFakeTimers({now: new Date(2020, 1, 14), shouldAdvanceTime: true});
    input = document.createElement('input');
    outer = document.createElement('div');
    outer.appendChild(input);
    testContainer.appendChild(outer);
  });

  afterEach(function () {
    if (input.datepicker) {
      input.datepicker.destroy();
    }
    outer.removeChild(input);
    testContainer.removeChild(outer);
    clock.restore();
  });

  describe('show option', function () {
    it('changes shortcut key to show the picker', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {show: {key: 'F2'}}
      });
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {show: {key: 'F2'}}
      });
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {show: {key: 'F2', ctrlOrMetaKey: true}},
      });
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {show: {key: 'F2', ctrlKey: true}};
      let {dp, picker} = createDP(input, {shortcutKeys});
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();

      shortcutKeys.show = {key: 'F2', metaKey: true};
      ({dp, picker} = createDP(input, {shortcutKeys}));

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {show: {key: '/'}},
      });
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('disables shortcut key to show picker when falsy value other than undefined', function () {
      let {dp, picker} = createDP(input, {shortcutKeys: {show: null}});
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');

      dp.destroy();

      ({dp, picker} = createDP(input, {shortcutKeys: {show: false}}));

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');

      dp.destroy();

      // does nothing when undefined
      ({dp, picker} = createDP(input, {shortcutKeys: {show: undefined}}));

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {show: {key: 'F2'}},
      });
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is showm is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      input.focus();
      dp.hide();

      dp.setOptions({shortcutKeys: {show: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'ArrowDown'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });
  });

  describe('hide option', function () {
    it('sets shortcut key to hide the picker', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {hide: {key: 'F2'}}
      });
      const [nextButton, viewSwitch] = getParts(picker, ['.next-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');

      // the picker is reset to start view state, but no update to the selection
      dp.show();
      input.value = '2/8/2020';
      nextButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');
      expect(dp.getDate(), 'to be undefined');
      expect(input.value, 'to be', '2/8/2020');
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      expect(cellInfo(getCells(picker), '.focused'), 'to equal', [[19, '14']]);

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {hide: {key: 'F2'}}
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {hide: {key: 'F2', ctrlOrMetaKey: true}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {hide: {key: 'F2', ctrlKey: true}};
      let {dp, picker} = createDP(input, {shortcutKeys});
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');

      dp.destroy();

      shortcutKeys.hide = {key: 'F2', metaKey: true};
      ({dp, picker} = createDP(input, {shortcutKeys}));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {hide: {key: '/'}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(isVisible(picker), 'to be false');

      dp.show();

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('does not add shortcut key when falsy', function () {
      let {dp, picker} = createDP(input, {shortcutKeys: {hide: null}});
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();

      ({dp, picker} = createDP(input, {shortcutKeys: {hide: false}}));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('makes the keypress event of new shortcut key be canceled (incl. bubbling)', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {hide: {key: 'F2'}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is hidden is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      input.focus();

      dp.setOptions({shortcutKeys: {hide: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });
  });

  describe('toggle option', function () {
    it('changes shortcut key to toggle the display of the picker', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {toggle: {key: 'F2'}}
      });
      const [nextButton, viewSwitch] = getParts(picker, ['.next-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      // when hiding, the picker is not reset to start view state,
      // and no update to the selection as well
      input.value = '2/8/2020';
      nextButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be false');
      expect(dp.getDate(), 'to be undefined');
      expect(input.value, 'to be', '2/8/2020');
      expect(viewSwitch.textContent, 'to be', '2020');
      expect(cellInfo(getCells(picker), '.focused'), 'to equal', [[2, 'Mar']]);

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {toggle: {key: 'F2'}}
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(isVisible(picker), 'to be true');

      dp.hide();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(isVisible(picker), 'to be false');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {toggle: {key: 'F2', ctrlOrMetaKey: true}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {toggle: {key: 'F2', ctrlKey: true}};
      let {dp, picker} = createDP(input, {shortcutKeys});
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();

      shortcutKeys.toggle = {key: 'F2', metaKey: true};
      ({dp, picker} = createDP(input, {shortcutKeys}));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {toggle: {key: '/'}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: '/'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('disables shortcut key to toggle picker when falsy value other than undefined', function () {
      let {dp, picker} = createDP(input, {shortcutKeys: {toggle: null}});
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();

      ({dp, picker} = createDP(input, {shortcutKeys: {toggle: false}}));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();

      // does nothing when undefined
      ({dp, picker} = createDP(input, {shortcutKeys: {toggle: undefined}}));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be false');
      //
      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be true');

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {toggle: {key: 'F2'}},
      });
      input.focus();
      dp.hide();

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press always functions as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      input.focus();

      dp.setOptions({shortcutKeys: {toggle: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(isVisible(picker), 'to be true');

      simulant.fire(input, 'keydown', {key: 'Escape'});
      expect(isVisible(picker), 'to be false');

      dp.destroy();
    });
  });

  describe('prevButton option', function () {
    it('changes shortcut key for prev button click', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {prevButton: {key: 'F2'}}
      });
      const [nextButton, viewSwitch] = getParts(picker, ['.next-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');
      // original behaivor before the shortcut assignment is restored
      expect(dp.editMode, 'to be true');
      dp.exitEditMode();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'January 2020');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [16]);
      expect(cells[16].textContent, 'to be', '14');

      nextButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2019');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', 'Feb');

      nextButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2010-2019');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', '2010');

      nextButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '1900-1990');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);
      expect(cells[3].textContent, 'to be', '1920');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {prevButton: {key: 'F2'}}
      });
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {prevButton: {key: 'F2', ctrlOrMetaKey: true}},
      });
      const [nextButton, viewSwitch] = getParts(picker, ['.next-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {prevButton: {key: 'F2', ctrlKey: true}};
      const partsClasses = ['.next-button', '.view-switch'];
      let {dp, picker} = createDP(input, {shortcutKeys});
      let [nextButton, viewSwitch] = getParts(picker, partsClasses);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      dp.destroy();

      shortcutKeys.prevButton = {key: 'F2', metaKey: true};
      ({dp, picker} = createDP(input, {shortcutKeys}));
      ([nextButton, viewSwitch] = getParts(picker, partsClasses));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {prevButton: {key: '/'}},
      });
      const [nextButton, viewSwitch] = getParts(picker, ['.next-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      nextButton.click();

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('disables shortcut key for prev button when falsy value other than undefined', function () {
      let {dp, picker} = createDP(input, {shortcutKeys: {prevButton: null}});
      let viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();

      ({dp, picker} = createDP(input, {shortcutKeys: {prevButton: false}}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();

      // does nothing when undefined
      ({dp, picker} = createDP(input, {shortcutKeys: {prevButton: undefined}}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {prevButton: {key: 'F2'}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.exitEditMode();
      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is shown is always treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();
      dp.hide();

      // the same key press while picker is hidden is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      dp.setOptions({shortcutKeys: {prevButton: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'ArrowLeft', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'January 2020');

      dp.destroy();
    });
  });

  describe('nextButton option', function () {
    it('changes shortcut key for next button click', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {nextButton: {key: 'F2'}}
      });
      const [prevButton, viewSwitch] = getParts(picker, ['.prev-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');
      // original behaivor before the shortcut assignment is restored
      expect(dp.editMode, 'to be true');
      dp.exitEditMode();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'March 2020');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [13]);
      expect(cells[13].textContent, 'to be', '14');

      prevButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2021');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', 'Feb');

      prevButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2030-2039');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', '2030');

      prevButton.click();
      viewSwitch.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2100-2190');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);
      expect(cells[3].textContent, 'to be', '2120');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {nextButton: {key: 'F2'}}
      });
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {nextButton: {key: 'F2', ctrlOrMetaKey: true}},
      });
      const [prevButton, viewSwitch] = getParts(picker, ['.prev-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {nextButton: {key: 'F2', ctrlKey: true}};
      const partsClasses = ['.prev-button', '.view-switch'];
      let {dp, picker} = createDP(input, {shortcutKeys});
      let [prevButton, viewSwitch] = getParts(picker, partsClasses);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      dp.destroy();

      shortcutKeys.nextButton = {key: 'F2', metaKey: true};
      ({dp, picker} = createDP(input, {shortcutKeys}));
      ([prevButton, viewSwitch] = getParts(picker, partsClasses));
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {nextButton: {key: '/'}},
      });
      const [prevButton, viewSwitch] = getParts(picker, ['.prev-button', '.view-switch']);
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      prevButton.click();

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('disables shortcut key for next button when falsy value other than undefined', function () {
      let {dp, picker} = createDP(input, {shortcutKeys: {nextButton: null}});
      let viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();

      ({dp, picker} = createDP(input, {shortcutKeys: {nextButton: false}}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();

      // does nothing when undefined
      ({dp, picker} = createDP(input, {shortcutKeys: {nextButton: undefined}}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {nextButton: {key: 'F2'}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.exitEditMode();
      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is shown is always treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();
      dp.hide();

      // the same key press while picker is hidden is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      dp.setOptions({shortcutKeys: {nextButton: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'ArrowRight', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'March 2020');

      dp.destroy();
    });
  });

  describe('viewSwitch option', function () {
    it('changes shortcut key for view switch click', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {viewSwitch: {key: 'F2'}}
      });
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');
      // original behaivor before the shortcut assignment is restored
      expect(dp.editMode, 'to be true');
      dp.exitEditMode();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2020');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', 'Feb');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2020-2029');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [1]);
      expect(cells[1].textContent, 'to be', '2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', '2000-2090');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [3]);
      expect(cells[3].textContent, 'to be', '2020');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {viewSwitch: {key: 'F2'}}
      });
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {viewSwitch: {key: 'F2', ctrlOrMetaKey: true}},
      });
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {viewSwitch: {key: 'F2', ctrlKey: true}};
      let {dp, picker} = createDP(input, {shortcutKeys});
      let viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.destroy();

      shortcutKeys.viewSwitch = {key: 'F2', metaKey: true};
      ({dp, picker} = createDP(input, {shortcutKeys}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {viewSwitch: {key: '/'}},
      });
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.hide();
      dp.show();

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });

    it('disables shortcut key for prev button when falsy value other than undefined', function () {
      let {dp, picker} = createDP(input, {shortcutKeys: {viewSwitch: null}});
      let viewSwitch = getViewSwitch(picker);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();

      ({dp, picker} = createDP(input, {shortcutKeys: {viewSwitch: false}}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();

      // does nothing when undefined
      ({dp, picker} = createDP(input, {shortcutKeys: {viewSwitch: undefined}}));
      viewSwitch = getViewSwitch(picker);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {viewSwitch: {key: 'F2'}},
      });
      input.focus();

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.exitEditMode();
      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is shown is always treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();
      dp.hide();

      // the same key press while picker is hidden is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input);
      const viewSwitch = getViewSwitch(picker);
      input.focus();

      dp.setOptions({shortcutKeys: {viewSwitch: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      simulant.fire(input, 'keydown', {key: 'ArrowUp', ctrlKey: true});
      expect(viewSwitch.textContent, 'to be', '2020');

      dp.destroy();
    });
  });

  describe('clearButton option', function () {
    it('changes shortcut key for clear button click', function () {
      const {dp, picker} = createDP(input, {
        clearButton: true,
        shortcutKeys: {clearButton: {key: 'F2'}}
      });
      const [prevButton, viewSwitch] = getParts(picker, ['.prev-button', '.view-switch']);
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
      expect(cells[24].textContent, 'to be', '22');
      // original behaivor before the shortcut assignment is restored
      expect(dp.editMode, 'to be true');
      dp.exitEditMode();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', []);
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', []);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.setDate(apr22);
      viewSwitch.click();
      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', []);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);
      viewSwitch.click();
      viewSwitch.click();
      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', []);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', []);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      // shortcut is only available when clearButton: true
      dp.setOptions({clearButton: false});
      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: {key: 'F2'}}
      });
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: {key: 'F2', ctrlOrMetaKey: true}},
      });
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {clearButton: {key: 'F2', ctrlKey: true}};
      const apr22 = dateValue(2020, 3, 22);
      let dp = new Datepicker(input, {clearButton: true, shortcutKeys});
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', []);

      dp.destroy();

      shortcutKeys.clearButton = {key: 'F2', metaKey: true};
      dp = new Datepicker(input, {clearButton: true, shortcutKeys});
      dp.setDate(apr22);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', []);

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: {key: '/'}},
      });
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(dp.dates, 'to equal', []);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      dp.destroy();
    });

    it('disables shortcut key for next button when falsy value other than undefined', function () {
      let dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: null},
      });
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);

      dp.destroy();

      dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: false},
      });
      dp.setDate(apr22);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);

      dp.destroy();

      // does nothing when undefined
      dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: undefined},
      });
      dp.setDate(apr22);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
      expect(dp.dates, 'to equal', []);

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        clearButton: true,
        shortcutKeys: {clearButton: {key: 'F2'}},
      });
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.exitEditMode();
      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is shown is always treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();
      dp.hide();

      // the same key press while picker is hidden is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const dp = new Datepicker(input, {clearButton: true});
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      dp.setOptions({shortcutKeys: {clearButton: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);

      simulant.fire(input, 'keydown', {key: 'Backspace', ctrlKey: true});
      expect(dp.dates, 'to equal', []);

      dp.destroy();
    });
  });

  describe('todayButton option', function () {
    it('changes shortcut key for today button click', function () {
      const {dp, picker} = createDP(input, {
        todayButton: true,
        shortcutKeys: {todayButton: {key: 'F2'}}
      });
      const [prevButton, viewSwitch] = getParts(picker, ['.prev-button', '.view-switch']);
      const apr22 = dateValue(2020, 3, 22);
      const today = dateValue(2020, 1, 14);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');
      let cells = getCells(picker);
      expect(getCellIndices(cells, '.focused'), 'to equal', [24]);
      expect(getCellIndices(cells, '.selected'), 'to equal', [24]);
      expect(cells[24].textContent, 'to be', '22');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', []);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.setOptions({todayButtonMode: 1});

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');
      cells = getCells(picker);
      expect(getCellIndices(cells, '.selected'), 'to equal', [19]);
      expect(getCellIndices(cells, '.focused'), 'to equal', [19]);
      expect(cells[19].textContent, 'to be', '14');

      dp.setDate(apr22);
      viewSwitch.click();
      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);
      viewSwitch.click();
      viewSwitch.click();
      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);
      viewSwitch.click();
      viewSwitch.click();
      viewSwitch.click();
      prevButton.click();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      // shortcut is only available when todayButton: true
      dp.setOptions({todayButton: false});
      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const {dp, picker} = createDP(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: {key: 'F2'}}
      });
      const viewSwitch = getViewSwitch(picker);
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const {dp, picker} = createDP(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: {key: 'F2', ctrlOrMetaKey: true}},
      });
      const viewSwitch = getViewSwitch(picker);
      const apr22 = dateValue(2020, 3, 22);
      const today = dateValue(2020, 1, 14);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {todayButton: {key: 'F2', ctrlKey: true}};
      const apr22 = dateValue(2020, 3, 22);
      const today = dateValue(2020, 1, 14);
      let dp = new Datepicker(input, {todayButton: true, todayButtonMode: 1, shortcutKeys});
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', [today]);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', [today]);

      dp.destroy();

      shortcutKeys.todayButton = {key: 'F2', metaKey: true};
      dp = new Datepicker(input, {todayButton: true, todayButtonMode: 1, shortcutKeys});
      dp.setDate(apr22);
      dp.show();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.dates, 'to equal', [today]);

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.dates, 'to equal', [today]);

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const {dp, picker} = createDP(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: {key: '/'}},
      });
      const viewSwitch = getViewSwitch(picker);
      const apr22 = dateValue(2020, 3, 22);
      const today = dateValue(2020, 1, 14);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.setDate(apr22);

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();
    });

    it('disables shortcut key for next button when falsy value other than undefined', function () {
      let {dp, picker} = createDP(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: null},
      });
      let viewSwitch = getViewSwitch(picker);
      const apr22 = dateValue(2020, 3, 22);
      const today = dateValue(2020, 1, 14);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();

      dp = new Datepicker(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: false},
      });
      viewSwitch = getViewSwitch(picker);
      dp.setDate(apr22);
      dp.show();

      simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      dp.destroy();

      // does nothing when undefined
      dp = new Datepicker(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: undefined},
      });
      dp.setDate(apr22);
      dp.show();

      simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
      expect(dp.dates, 'to equal', [today]);

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        todayButton: true,
        todayButtonMode: 1,
        shortcutKeys: {todayButton: {key: 'F2'}},
      });
      const apr22 = dateValue(2020, 3, 22);
      dp.setDate(apr22);
      input.focus();

      simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.exitEditMode();
      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while picker is shown is always treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();
      dp.hide();

      // the same key press while picker is hidden is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const {dp, picker} = createDP(input, {todayButton: true, todayButtonMode: 1});
      const viewSwitch = getViewSwitch(picker);
      const apr22 = dateValue(2020, 3, 22);
      const today = dateValue(2020, 1, 14);
      dp.setDate(apr22);
      input.focus();

      dp.setOptions({shortcutKeys: {todayButton: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.dates, 'to equal', [apr22]);
      expect(viewSwitch.textContent, 'to be', 'April 2020');

      simulant.fire(input, 'keydown', {key: '.', ctrlKey: true});
      expect(dp.dates, 'to equal', [today]);
      expect(viewSwitch.textContent, 'to be', 'February 2020');

      dp.destroy();
    });
  });

  describe('exitEditMode option', function () {
    it('changes shortcut key to exit edit mode', function () {
      const {dp, picker} = createDP(input, {
        shortcutKeys: {exitEditMode: {key: 'F2'}}
      });
      input.focus();
      dp.enterEditMode();
      input.value = '2/8/2020';

      simulant.fire(input, 'keydown', {key: 'ArrowDown', ctrlKey: true});
      expect(dp.editMode, 'to be true');
      expect(input.classList.contains('in-edit'), 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.editMode, 'to be undefined');
      expect(input.classList.contains('in-edit'), 'to be false');
      expect(isVisible(picker), 'to be true');
      expect(dp.getDate(), 'to be undefined');
      expect(input.value, 'to be', '2/8/2020');

      dp.destroy();
    });

    it('considers unspecified modifier key state as false', function () {
      const dp = new Datepicker(input, {
        shortcutKeys: {exitEditMode: {key: 'F2'}}
      });
      input.focus();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', altKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', shiftKey: true});
      expect(dp.editMode, 'to be true');

      dp.destroy();
    });

    it('takes ctrlOrMetaKey for the condtion for ctrl and metaKey', function () {
      const dp = new Datepicker(input, {
        shortcutKeys: {exitEditMode: {key: 'F2', ctrlOrMetaKey: true}},
      });
      input.focus();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true, altKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true, shiftKey: true});
      expect(dp.editMode, 'to be true');

      dp.destroy();
    });

    it('treats ctrlKey, metaKey as synonyms of ctrlOrMetaKey', function () {
      const shortcutKeys = {exitEditMode: {key: 'F2', ctrlKey: true}};
      let dp = new Datepicker(input, {shortcutKeys});
      input.focus();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.destroy();

      shortcutKeys.exitEditMode = {key: 'F2', metaKey: true};
      dp = new Datepicker(input, {shortcutKeys});
      dp.show();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', ctrlKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'F2', metaKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.destroy();
    });

    it('ignores shiftKey, altKey conditions when key is printable characler', function () {
      const dp = new Datepicker(input, {
        shortcutKeys: {exitEditMode: {key: '/'}},
      });
      input.focus();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: '/'});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: '/', shiftKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: '/', altKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: '/', ctrlKey: true, shiftKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: '/', metaKey: true, altKey: true});
      expect(dp.editMode, 'to be true');

      dp.destroy();
    });

    it('disables shortcut key for prev button when falsy value other than undefined', function () {
      let dp = new Datepicker(input, {shortcutKeys: {exitEditMode: null}});
      input.focus();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'ArrowDown', ctrlKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.editMode, 'to be true');

      dp.destroy();

      dp = new Datepicker(input, {shortcutKeys: {exitEditMode: false}});
      dp.show();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'ArrowDown', ctrlKey: true});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.editMode, 'to be true');

      dp.destroy();

      // does nothing when undefined
      dp = new Datepicker(input, {shortcutKeys: {exitEditMode: undefined}});
      dp.show();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'ArrowDown', ctrlKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.destroy();
    });

    it('changes the target of keypress event cancelation (incl. bubbling) to new shortcut', function () {
      const spyInputKeydown = sinon.spy();
      const spyOuterKeydown = sinon.spy();
      input.addEventListener('keydown', spyInputKeydown);
      outer.addEventListener('keydown', spyOuterKeydown);

      const dp = new Datepicker(input, {
        shortcutKeys: {exitEditMode: {key: 'F2'}},
      });
      input.focus();
      dp.enterEditMode();

      simulant.fire(input, 'keydown', {key: 'ArrowDown', ctrlKey: true});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      spyInputKeydown.resetHistory();
      spyOuterKeydown.resetHistory();

      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be true');
      expect(spyOuterKeydown.called, 'to be false');

      spyInputKeydown.resetHistory();

      // the same key press while not in edit mode is not treated as shortcut
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(spyInputKeydown.called, 'to be true');
      expect(spyInputKeydown.args[0][0].defaultPrevented, 'to be false');
      expect(spyOuterKeydown.called, 'to be true');

      dp.destroy();
      input.removeEventListener('keydown', spyInputKeydown);
      outer.removeEventListener('keydown', spyOuterKeydown);
    });

    it('cannot be update with setOptions()', function () {
      const dp = new Datepicker(input);
      input.focus();
      dp.enterEditMode();

      dp.setOptions({shortcutKeys: {exitEditMode: {key: 'F2'}}});
      simulant.fire(input, 'keydown', {key: 'F2'});
      expect(dp.editMode, 'to be true');

      simulant.fire(input, 'keydown', {key: 'ArrowDown', ctrlKey: true});
      expect(dp.editMode, 'to be undefined');

      dp.destroy();
    });
  });
});
