describe('options - orientation', function () {
  const getIntSize = px => Math.round(parseFloat(px));
  const getTopPos = (el, wrap) => el.offsetTop + (wrap ? wrap.offsetTop : 0) + window.scrollY;
  const getLeftPos = (el, wrap) => el.offsetLeft + (wrap ? wrap.offsetLeft : 0) + window.scrollX;
  const getBottomPos = (el, wrap) => getTopPos(el, wrap) + el.offsetHeight;
  const getRightPos = (el, wrap) => getLeftPos(el, wrap) + el.offsetWidth;
  let wrapper;
  let input;

  beforeEach(function () {
    wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      boxSizing: 'border-box',
      position: 'fixed',
      top: '50px',
      left: '50px',
      width: '300px',
      paddingTop: '300px',
    });
    input = document.createElement('input');
    wrapper.appendChild(input);
    testContainer.appendChild(wrapper);
  });

  afterEach(function () {
    domUtils.emptyChildNodes(testContainer);
  });

  it('"auto" makes the picker show on top left of the input by default', function () {
    const {dp, picker} = createDP(input);
    dp.show();

    expect(getIntSize(picker.style.top), 'to be close to', getTopPos(input, wrapper) - picker.offsetHeight, 1);
    expect(getIntSize(picker.style.left), 'to be close to', getLeftPos(input, wrapper), 1);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
  });

  it('"auto" makes the picker show on top right of the input if computed style of the input has direction: rrl', function () {
    const {dp, picker} = createDP(input);
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(getIntSize(picker.style.top), 'to be close to', getTopPos(input, wrapper) - picker.offsetHeight, 1);
    expect(getIntSize(picker.style.left), 'to be close to', getRightPos(input, wrapper) - picker.offsetWidth, 1);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"auto" makes the picker show on bottom of the input if visible space above the input < picker height', function () {
    const {dp, picker} = createDP(input);
    wrapper.style.paddingTop = '0';
    dp.show();

    expect(getIntSize(picker.style.top), 'to be close to', getBottomPos(input, wrapper), 1);
    expect(getIntSize(picker.style.left), 'to be close to', getLeftPos(input, wrapper), 1);
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(getIntSize(picker.style.top), 'to be close to', getBottomPos(input, wrapper), 1);
    expect(getIntSize(picker.style.left), 'to be close to', getRightPos(input, wrapper) - picker.offsetWidth, 1);
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"auto" makes the picker move to 10px from document\'s left if picker\'s left < document\'s', function () {
    const {dp, picker} = createDP(input);
    wrapper.style.left = '-40px';
    dp.show();

    expect(getIntSize(picker.style.left), 'to be', 10);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
  });

  it('"auto" makes the picker show on right if picker\'s right edge > document\'s', function () {
    const {dp, picker} = createDP(input);
    Object.assign(wrapper.style, {left: 'auto', right: 0, width: '150px'});
    dp.show();

    expect(getIntSize(picker.style.left), 'to be close to', getRightPos(input, wrapper) - picker.offsetWidth, 1);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"top" makes the picker show on top of the input regardless of the size of the space above', function () {
    const {dp, picker} = createDP(input, {orientation: 'top'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.style.paddingTop = '0';
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"bottom" makes the picker show on bottom of the input regardless of the size of the space below', function () {
    wrapper.style.paddingTop = '0';

    const {dp, picker} = createDP(input, {orientation: 'bottom'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: 'auto', bottom: '0'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"left" makes the picker show on left of the input regardless of the direction of the input', function () {
    const {dp, picker} = createDP(input, {orientation: 'left'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
  });

  it('"right" makes the picker show on right of the input regardless of the direction of the input', function () {
    const {dp, picker} = createDP(input, {orientation: 'right'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"top left" makes the picker always show on top left of the input', function () {
    wrapper.style.paddingTop = '0';

    const {dp, picker} = createDP(input, {orientation: 'top left'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: 'auto', bottom: '0'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: '0', bottom: ''});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
  });

  it('"top right" makes the picker always show on top right of the input', function () {
    wrapper.style.paddingTop = '0';

    const {dp, picker} = createDP(input, {orientation: 'top right'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: 'auto', bottom: '0'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: '0', bottom: ''});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('"bottom left" makes the picker always show on bottom left of the input', function () {
    wrapper.style.paddingTop = '0';

    const {dp, picker} = createDP(input, {orientation: 'bottom left'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: 'auto', bottom: '0'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: '0', bottom: ''});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
  });

  it('"bottom right" makes the picker always show on bottom right of the input', function () {
    wrapper.style.paddingTop = '0';

    const {dp, picker} = createDP(input, {orientation: 'bottom right'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: 'auto', bottom: '0'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    Object.assign(wrapper.style, {top: '0', bottom: ''});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
  });

  it('can be updated with setOptions()', function () {
    const {dp, picker} = createDP(input);
    dp.setOptions({orientation: 'right bottom'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    dp.setOptions({orientation: 'bottom auto'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    dp.setOptions({orientation: 'auto right'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    dp.setOptions({orientation: 'auto'});
    dp.show();

    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
  });

  describe('with custom container', function () {
    let foo;

    beforeEach(function () {
      foo = parseHTML('<div id="foo"></div>').firstChild;
      Object.assign(foo.style, {
        boxSizing: 'border-box',
        position: 'fixed',
        top: '20px',
        left: '20px',
        height: '360px',
        overflow: 'auto',
      });
      Object.assign(wrapper.style, {position: '', top: '', left: ''});
      testContainer.replaceChild(foo, wrapper);
      foo.appendChild(wrapper);
    });

    it('makes the picker\'s position relative to the container', function () {
      const {dp, picker} = createDP(input, {container: '#foo'});
      dp.show();

      expect(getIntSize(picker.style.top), 'to be', input.offsetTop - picker.offsetHeight);
      expect(getIntSize(picker.style.left), 'to be', input.offsetLeft);
      expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
      expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

      dp.hide();
      wrapper.style.paddingBottom = '200px';
      foo.scrollTop = 100;
      dp.show();

      expect(getIntSize(picker.style.top), 'to be', input.offsetTop + input.offsetHeight);
      expect(getIntSize(picker.style.left), 'to be', input.offsetLeft);
      expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');
      expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

      foo.scrollTop = 0;
      wrapper.style.paddingBottom = '';
      dp.destroy();
    });

    it('"auto" makes the picker move to 10px from container\'s left if picker\'s left < container\'s', function () {
      const {dp, picker} = createDP(input, {container: '#foo'});
      wrapper.style.marginLeft = '-40px';
      dp.show();

      expect(getIntSize(picker.style.left), 'to be', 10);
      expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

      dp.destroy();
    });

    it('"auto" makes the picker show on right if picker\'s right edge < container\'s', function () {
      const {dp, picker} = createDP(input, {container: '#foo'});
      wrapper.style.width = '150px';
      dp.show();

      expect(getIntSize(picker.style.left), 'to be', input.offsetLeft + input.offsetWidth - picker.offsetWidth);
      expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

      dp.destroy();
    });
  });
});
