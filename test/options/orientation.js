describe('options - orientation', function () {
  const docElem = document.documentElement;
  const scrollToElem = (el, useBottom = false) => {
    const rect = el.getBoundingClientRect();
    let newY = rect.top + window.scrollY;
    if (useBottom) {
      newY += Math.abs(docElem.clientHeight - rect.height);
    }
    window.scrollTo(window.scrollX, newY);
  };
  const pushToBottom = (el) => {
    const gap = docElem.clientHeight - document.body.clientHeight;
    if (gap > 0) {
      el.style.marginTop = `${gap}px`;
    }
  };
  const getRectsOf = (...elems) => new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      resolve(elems.map(el => el.getBoundingClientRect()));
    });
  });
  const defaultWrapperStyle = {
    paddingTop: '300px',
    paddingRight: '20px',
    paddingBottom: '320px',
    paddingLeft: '20px',
  };
  const resetPositioning = () => {
    outer.removeAttribute('style');
    wrapper.removeAttribute('dir');
    wrapper.removeAttribute('style');
    Object.assign(wrapper.style, defaultWrapperStyle);
  };
  let options;
  let outer;
  let wrapper;
  let input;

  beforeEach(function () {
    options = {};

    outer = document.createElement('div');
    outer.id = 'outer';
    wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    Object.assign(wrapper.style, defaultWrapperStyle);
    input = document.createElement('input');
    input.style.width = '160px';
    wrapper.appendChild(input);
    outer.appendChild(wrapper);
    testContainer.appendChild(outer);
  });

  afterEach(function () {
    if (input.datepicker) {
      input.datepicker.destroy();
    }
    testContainer.removeChild(outer);
  });

  const testAutoDefault = async function () {
    const {dp, picker} = createDP(input, options);
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '300px',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker show on left bottom of the input by default', testAutoDefault);

  const testAutoRtl = async function () {
    wrapper.setAttribute('dir', 'rtl');
    const {dp, picker} = createDP(input, options);
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '300px',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker show on bottom right of the input if the computed style of the input has direction: rrl', testAutoRtl);

  const testAutoNoBottomSpace = async function () {
    const {dp, picker} = createDP(input, options);
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    const bottom = docElem.clientHeight > 659 ? 300 : docElem.clientHeight - 360;
    Object.assign(outer.style, {
      height: '360px',
      marginBottom: `${bottom}px`,
      overflow: 'auto',
    });
    wrapper.style.paddingBottom = '320px';
    wrapper.setAttribute('dir', 'ltr');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    outer.removeAttribute('style');
    Object.assign(outer.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '300px',
    });
    wrapper.style.paddingBottom = '';
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      bottom:  `${bottom}px`,
      height: '360px',
      overflow: 'auto',
    });
    wrapper.style.paddingBottom = '320px';
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker show on top of the input if the visible space below the input < picker height', testAutoNoBottomSpace);

  const testAutoAlsoNoTopSpace = async function () {
    const {dp, picker} = createDP(input, options);
    Object.assign(outer.style, {
      height: '360px',
      overflow: 'auto',
    });
    pushToBottom(outer);
    scrollToElem(outer, true);
    outer.scrollTo(0, 150);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '300px',
      marginTop: '',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker show on bottom if the visible space both above and below the input < picker height', testAutoAlsoNoTopSpace);

  const testAutoNoRighSpace = async function () {
    const {dp, picker} = createDP(input, options);
    outer.style.marginLeft = 'calc(100vw - 220px)';
    scrollToElem(outer, true);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.marginLeft = '';
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      right: '-100px',
      width: '300px',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker show on right if the visible space on the right of the input < picker width', testAutoNoRighSpace);

  const testAutoNoLeftSpaneWhenRtl = async function () {
    const {dp, picker} = createDP(input, options);
    outer.style.width = '200px';
    wrapper.style.direction = 'rtl';
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.marginLeft = '';
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker show on left if the input\'s direction = rtl and the visible space on the left of the input < picker width', testAutoNoLeftSpaneWhenRtl);

  const testAutoInputExceedsLeftEdge = async function () {
    const {dp, picker} = createDP(input, options);
    outer.style.marginLeft = '-40px';
    scrollToElem(outer, true);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', 0);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', 0);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      marginLeft: '40px',
      width: '300px',
      overflow: 'auto',
    });
    wrapper.style.width = '340px';
    outer.scrollTo(40, 0);
    dp.show();

    pickerRect = picker.getBoundingClientRect();
    expect(pickerRect.left, 'to be', 40);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '30px',
      marginLeft: '',
    });
    scrollToElem(outer);
    outer.scrollTo(40, 0);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', 30);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.left = '-30px';
    outer.scrollTo(0, 0);
    dp.show();

    pickerRect = picker.getBoundingClientRect();
    expect(pickerRect.left, 'to be', 0);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker move to the left edge of visible area if picker\'s left < visible area\'s', testAutoInputExceedsLeftEdge);

  const testAutoInputExceedsRightEdge = async function () {
    const {dp, picker} = createDP(input, options);
    outer.style.marginLeft = 'calc(100vw - 100px)';
    scrollToElem(outer, true);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', docElem.clientWidth - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', docElem.clientWidth - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      marginLeft: 'calc(100vw - 340px)',
      width: '300px',
      overflow: 'auto',
    });
    wrapper.style.marginLeft = '130px';
    dp.show();

    let outerRect;
    ([pickerRect, outerRect] = await getRectsOf(picker, outer));
    expect(pickerRect.left, 'to be', outerRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      right: '40px',
    });
    scrollToElem(outer);

    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', docElem.clientWidth - 40 - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    wrapper.style.marginLeft = '';
    outer.style.right = '-150px';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', docElem.clientWidth - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
    resetPositioning();

    return Promise.resolve();
  };
  it('"auto" makes the picker move to the right edge of visible area if picker\'s right < visible area\'s', testAutoInputExceedsRightEdge);

  it('"top" makes the picker show on top of the input regardless of the size of the space above', async function () {
    let {dp, picker} = createDP(input, {orientation: 'top'});
    // bottom-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();

    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();
    resetPositioning();

    // top-left when auto
    // bottom space of window < picker height
    ({dp, picker} = createDP(input, {orientation: 'top'}));
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.destroy();
    resetPositioning();

    // bottom-left when auto
    // both top/bottom spaces of scroll parent < picker height
    ({dp, picker} = createDP(input, {orientation: 'top'}));
    Object.assign(outer.style, {
      height: '360px',
      overflow: 'auto',
    });
    pushToBottom(outer);
    scrollToElem(outer);
    outer.scrollTo(0, 150);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    // both top/bottom spaces of scroll parent (relative) < picker height
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.hide();
    // both top/bottom spaces of scroll parent (fixed) < picker height
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '300px',
      marginTop: '',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.destroy();

    return Promise.resolve();
  });

  it('"bottom" makes the picker show on bottom of the input regardless of the size of the space above', async function () {
    let {dp, picker} = createDP(input, {orientation: 'bottom'});
    // bottom-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();

    // top-left when auto
    // bottom space of window < picker height
    ({dp, picker} = createDP(input, {orientation: 'bottom'}));
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();

    // top-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    // top-left when auto
    // bottom space of scroll parent < picker height
    ({dp, picker} = createDP(input, {orientation: 'bottom'}));
    Object.assign(outer.style, {
      height: '360px',
      overflow: 'auto',
    });
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();

    // top-left when auto
    // bottom space of scroll parent (relative) < picker height
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    // bottom spave of scroll parent (fixed) < picker height
    Object.assign(outer.style, {
      position: 'fixed',
      left: '0',
      bottom: '300px',
      height: '360px',
      width: '300px',
      overflow: 'auto',
      marginTop: '',
    });
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();

    return Promise.resolve();
  });

  it('"left" makes the picker show on left of the input regardless of the text direction or picker\'s right edge position', async function () {
    let {dp, picker} = createDP(input, {orientation: 'left'});
    // bottom-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();

    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    // top-right when auto
    // bottom space of window < picker height
    ({dp, picker} = createDP(input, {orientation: 'left'}));
    wrapper.setAttribute('dir', 'rtl');
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.destroy();
    resetPositioning();

    // bottom-right when auto
    // right space of window < picker's right - input's right
    ({dp, picker} = createDP(input, {orientation: 'left'}));
    Object.assign(outer.style, {
      marginTop: '',
      marginLeft: 'calc(100vw - 200px)',
    });
    wrapper.style.paddingBottom = '320px';
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    // right space of window < picker's right - input's right
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    // right space of window < picker's right - input's right
    outer.style.marginLeft = '';
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      right: '-100px',
      width: '300px',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    outer.removeAttribute('style');
    outer.style.marginLeft = 'calc(100vw - 100px)';
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    // input's right > right side of window
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    // input's right > right side of scroll parent (relative)
    Object.assign(outer.style, {
      marginLeft: 'calc(100vw - 340px)',
      width: '300px',
      overflow: 'auto',
    });
    wrapper.style.marginLeft = '150px';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    // input's right > right side of scroll parent (fixed)
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      right: '40px',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.hide();
    // input's right > right side of window
    wrapper.style.marginLeft = '';
    outer.style.right = '-150px';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');

    dp.destroy();

    return Promise.resolve();
  });

  it('"right" makes the picker show on right of the input regardless of the text direction or picker\'s left edge position', async function () {
    let {dp, picker} = createDP(input, {orientation: 'right'});
    // bottom-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.destroy();
    resetPositioning();

    // top-left when auto
    // bottom space of window < picker height
    ({dp, picker} = createDP(input, {orientation: 'right'}));
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-top'), 'to be true');

    dp.destroy();
    resetPositioning();

    // bottom-left when auto
    // left space of window < picker's left - input's left (direcion = rtl)
    ({dp, picker} = createDP(input, {orientation: 'right'}));
    outer.style.width = '200px';
    wrapper.style.direction = 'rtl';
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // left space of window < picker's left - input's left (direcion = rtl)
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // left space of window < picker's left - input's left (direcion = rtl)
    outer.style.marginLeft = '';
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
    });
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // input's left < left side of window (direcion = rtl)
    outer.removeAttribute('style');
    outer.style.marginLeft = '-40px';
    scrollToElem(outer);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // input's left < left side of window (direcion = rtl)
    outer.style.position = 'relative';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // left space of scroll parent (relative) < picker's left - input's left (direcion = rtl)
    Object.assign(outer.style, {
      marginLeft: '40px',
      width: '300px',
      overflow: 'auto',
    });
    wrapper.style.width = '340px';
    outer.scrollTo(40, 0);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // left space of scroll parent (fixed) < picker's left - input's left (direcion = rtl)
    Object.assign(outer.style, {
      position: 'fixed',
      top: '0',
      left: '30px',
      marginLeft: '',
    });
    scrollToElem(outer);
    outer.scrollTo(40, 0);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.hide();
    // input's left < left side of window (direcion = rtl)
    Object.assign(outer.style, {
      left: '-40px',
      width: '200px',
      overflow: '',
    });
    wrapper.style.width = '';
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');

    dp.destroy();

    return Promise.resolve();
  });

  it('"top left" makes the picker always show on top left of the input', async function () {
    let {dp, picker} = createDP(input, {orientation: 'top left'});
    // bottom-left when auto
    wrapper.style.marginTop = '300px';
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.hide();

    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.destroy();
    resetPositioning();

    // top-left when auto
    ({dp, picker} = createDP(input, {orientation: 'top left'}));
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.hide();

    // top-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.destroy();

    return Promise.resolve();
  });

  it('"top right" makes the picker always show on top right of the input', async function () {
    const {dp, picker} = createDP(input, {orientation: 'top right'});
    // bottom-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.hide();

    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.hide();
    // top-left when auto
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.hide();

    // top-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.top - pickerRect.height);

    dp.destroy();

    return Promise.resolve();
  });

  it('"bottom left" makes the picker always show on bottom left of the input', async function () {
    let {dp, picker} = createDP(input, {orientation: 'bottom left'});
    // bottom-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.hide();

    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.destroy();
    resetPositioning();

    // top-left when auto
    ({dp, picker} = createDP(input, {orientation: 'bottom left'}));
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.hide();

    // top-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.destroy();

    return Promise.resolve();
  });

  it('"bottom right" makes the picker always show on bottom right of the input', async function () {
    let {dp, picker} = createDP(input, {orientation: 'bottom right'});
    // top-left when auto
    scrollToElem(outer);
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.hide();

    // bottom-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.destroy();
    resetPositioning();

    // top-left when auto
    ({dp, picker} = createDP(input, {orientation: 'bottom right'}));
    wrapper.style.paddingBottom = '';
    pushToBottom(outer);
    scrollToElem(outer, true);
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.hide();

    // top-right when auto
    wrapper.setAttribute('dir', 'rtl');
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);

    dp.destroy();

    return Promise.resolve();
  });

  it('can be updated with setOptions()', async function () {
    const {dp, picker} = createDP(input);
    scrollToElem(outer);
    dp.setOptions({orientation: 'right bottom'});
    dp.show();

    let [pickerRect, inputRect] = await getRectsOf(picker, input);
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    dp.setOptions({orientation: 'bottom auto'});
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    dp.setOptions({orientation: 'auto right'});
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.right - pickerRect.width);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-right'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    dp.hide();
    dp.setOptions({orientation: 'auto'});
    dp.show();

    ([pickerRect, inputRect] = await getRectsOf(picker, input));
    expect(pickerRect.left, 'to be', inputRect.left);
    expect(pickerRect.top, 'to be', inputRect.bottom);
    expect(picker.classList.contains('datepicker-orient-left'), 'to be true');
    expect(picker.classList.contains('datepicker-orient-bottom'), 'to be true');

    return Promise.resolve();
  });

  const doCommonTests = async (container = undefined) => {
      options = container ? {container} : {};

      await testAutoDefault();
      await testAutoRtl();
      await testAutoNoBottomSpace();
      await testAutoAlsoNoTopSpace();
      await testAutoNoRighSpace();
      await testAutoNoLeftSpaneWhenRtl();
      await testAutoInputExceedsLeftEdge();
      await testAutoInputExceedsRightEdge();

      return Promise.resolve();
  };

  describe('with container option', function () {
    it('works the same when input and container are in the same scrolling area', function () {
      return doCommonTests(wrapper);
    });

    it('works the same when container is the scroll parent of input', function () {
      return doCommonTests('#outer');
    });
  });

  describe('with custom element', function () {
    const prepareCustomWrapper = (useSlot = false) => {
      const testWrapper =  document.createElement('test-wrapper');
      testWrapper.id = wrapper.id;
      testWrapper.setAttribute('style', wrapper.getAttribute('style'));
      (useSlot ? testWrapper : testWrapper.shadowRoot).appendChild(input);
      outer.replaceChild(testWrapper, wrapper);
      wrapper = testWrapper;
    };
    const prepareCustomOuter = (useSlot = false) => {
      const testWrapper =  document.createElement('test-wrapper');
      testWrapper.id = outer.id;
      (useSlot ? testWrapper : testWrapper.shadowRoot).appendChild(wrapper);
      testContainer.replaceChild(testWrapper, outer);
      outer = testWrapper;
    };

    describe('and default container', function () {
      it('works the same when input is inside custom element\'s shadow DOM', function () {
        prepareCustomWrapper();
        return doCommonTests();
      });

      it('works the same when input is slotted into custom element', function () {
        prepareCustomWrapper(true);
        return doCommonTests();
      });

      it('works the same when custom element is scroll parent and input is inside its shadow DOM', function () {
        prepareCustomOuter();
        return doCommonTests();
      });

      it('works the same when custom element is scroll parent and input is inside its slot', function () {
        prepareCustomOuter(true);
        return doCommonTests();
      });
    });

    describe('and container inside the scrolling area', function () {
      it('works the same when input is inside custom element\'s shadow DOM', function () {
        prepareCustomWrapper();
        return doCommonTests(wrapper);
      });

      it('works the same when input is slotted into custom element', function () {
        prepareCustomWrapper(true);
        return doCommonTests(wrapper);
      });

      it('works the same when custom element is scroll parent and input is inside its shadow DOM', function () {
        prepareCustomOuter();
        return doCommonTests(wrapper);
      });

      it('works the same when custom element is scroll parent and input is inside its slot', function () {
        prepareCustomOuter(true);
        return doCommonTests(wrapper);
      });
    });

    describe('and container that is also scroll parent', function () {
      it('works the same when input is inside custom element\'s shadow DOM', function () {
        prepareCustomWrapper();
        return doCommonTests(outer);
      });

      it('works the same when input is slotted into custom element', function () {
        prepareCustomWrapper(true);
        return doCommonTests(outer);
      });

      it('works the same when custom element is scroll parent and input is inside its shadow DOM', function () {
        prepareCustomOuter();
        return doCommonTests(outer);
      });

      it('works the same when custom element is scroll parent and input is inside its slot', function () {
        prepareCustomOuter(true);
        return doCommonTests(outer);
      });
    });
  });
});
