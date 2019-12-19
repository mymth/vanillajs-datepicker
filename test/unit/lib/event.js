import '../_setup.js';

describe('lib/evnet', function () {
  let listenerRegistry;
  let spyAEL;
  let spyREL;
  //
  let registerListeners;
  let unregisterListeners;
  let findElementInEventPath;

  before(function () {
    spyAEL = sinon.spy(EventTarget.prototype, 'addEventListener');
    spyREL = sinon.spy(EventTarget.prototype, 'removeEventListener');

    const origWeakMap = global.WeakMap;
    global.WeakMap = function (...args) {
      return listenerRegistry = new origWeakMap(...args);
    };
    return import('../../../js/lib/event.js')
      .then((module) => {
        global.WeakMap = origWeakMap;

        registerListeners = module.registerListeners;
        unregisterListeners = module.unregisterListeners;
        findElementInEventPath = module.findElementInEventPath;
      });
  });

  after(function () {
    spyAEL.restore();
    spyREL.restore();
  });

  afterEach(function () {
    spyAEL.resetHistory();
    spyREL.resetHistory();
  });

  describe('registerListeners()', function () {
    let target;

    before(function () {
      target = document.createElement('input');
      testContainer.appendChild(target);
    });

    after(function () {
      testContainer.removeChild(target);
    });

    it('registers event listeres with key object calling addEventListener()', function () {
      const keyObj = {};
      const onClick = sinon.spy();
      const onKeydown = sinon.spy();
      const onMounseEnter = () => {};
      const listeners = [
        [document, 'click', onClick],
        [target, 'keydown', onKeydown, {capture: false}],
        [target, 'mouseenter', onMounseEnter, true],
      ];

      registerListeners(keyObj, listeners);
      expect(listenerRegistry.get(keyObj), 'to equal', listeners);
      expect(spyAEL.args, 'to equal', listeners.map(listener => listener.slice(1)));

      testContainer.click();
      expect(onClick.called, 'to be true');
      simulant.fire(target, 'keydown', {key: 'enter'});
      expect(onKeydown.called, 'to be true');

      listeners.forEach((listener) => {
        EventTarget.prototype.removeEventListener.call(...listener);
      });
      listenerRegistry.delete(keyObj);
    });

    it('appends listeners if registration for key object already exists', function () {
      const keyObj = {};
      const onClick = () => {};
      const onKeydown = () => {};
      const onMounseEnter = () => {};
      const listeners = [
        [document, 'click', onClick],
      ];
      const listenersToAdd = [
        [target, 'keydown', onKeydown, {capture: false}],
        [target, 'mouseenter', onMounseEnter, true],
      ];
      listenerRegistry.set(keyObj, listeners);

      registerListeners(keyObj, listenersToAdd);
      expect(listeners.length, 'to be', 3);
      expect(listenerRegistry.get(keyObj), 'to equal', listeners);
      expect(spyAEL.args, 'to equal', listenersToAdd.map(listener => listener.slice(1)));

      listenersToAdd.forEach((listener) => {
        EventTarget.prototype.removeEventListener.call(...listener);
      });
      listenerRegistry.delete(keyObj);
    });
  });

  describe('unregisterListeners()', function () {
    let target;

    before(function () {
      target = document.createElement('input');
      testContainer.appendChild(target);
    });

    after(function () {
      testContainer.removeChild(target);
    });

    it('unregisters all event listeres for key object calling removeEventListener()', function () {
      const keyObj = {};
      const onClick = sinon.spy();
      const onKeydown = sinon.spy();
      const onMounseEnter = () => {};
      const listeners = [
        [document, 'click', onClick],
        [target, 'keydown', onKeydown, {capture: false}],
        [target, 'mouseenter', onMounseEnter, true],
      ];
      listeners.forEach((listener) => {
        EventTarget.prototype.addEventListener.call(...listener);
      });
      listenerRegistry.set(keyObj, listeners);

      unregisterListeners(keyObj);
      expect(listenerRegistry.get(keyObj), 'to be undefined');
      expect(spyREL.args, 'to equal', listeners.map(listener => listener.slice(1)));

      testContainer.click();
      expect(onClick.called, 'to be false');
      simulant.fire(target, 'keydown', {key: 'enter'});
      expect(onKeydown.called, 'to be false');
    });
  });

  describe('findElementInEventPath()', function () {
    let field;
    let control;
    let input;

    before(function () {
      input = document.createElement('input');
      control = document.createElement('div');
      control.className = 'control';
      control.appendChild(input);
      field = document.createElement('div');
      field.className = 'field';
      field.appendChild(control);
      testContainer.appendChild(field);
    });

    after(function () {
      testContainer.removeChild(field);
    });

    it('returns the first element in event\'s path that matches given selector', function () {
      const test = (ev) => {
        expect(findElementInEventPath(ev, '.control'), 'to be', control);
        expect(findElementInEventPath(ev, '.field'), 'to be', field);
        expect(findElementInEventPath(ev, 'div'), 'to be', control);
      };

      document.addEventListener('click', test);
      simulant.fire(input, 'click');
      document.removeEventListener('click', test);
    });

    it('returns undefined if no matched element is in event\'s path', function () {
      const test = (ev) => {
        expect(findElementInEventPath(ev, '.foo'), 'to be undefined',);
      };

      document.addEventListener('click', test);
      simulant.fire(input, 'click');
      document.removeEventListener('click', test);
    });

    it('stops searching when it reaches event\'s currentTarget', function () {
      const test = (ev) => {
        expect(findElementInEventPath(ev, '.control'), 'to be', control);
        expect(findElementInEventPath(ev, '.field'), 'to be undefined',);
      };

      control.addEventListener('click', test);
      simulant.fire(input, 'click');
      control.removeEventListener('click', test);
    });

    it('function can be used to evaluate the condition instead of css selector', function () {
      const test = (ev) => {
        expect(findElementInEventPath(ev, target => [field, control].includes(target)), 'to be', control);
        expect(findElementInEventPath(ev, target => target === field), 'to be', field);
        expect(findElementInEventPath(ev, target => target.tagName === 'DIV'), 'to be', control);
      };

      document.addEventListener('click', test);
      simulant.fire(input, 'click');
      document.removeEventListener('click', test);
    });
  });
});
