import '../_setup.js';
import DateRangePicker from '../../../js/DateRangePicker.js';
import {parseHTML} from '../../../js/lib/dom.js';
// to spy constructor with sinon, import entire module
// @see: https://github.com/sinonjs/sinon/issues/1358#issuecomment-391643741
import * as DP from '../../../js/Datepicker.js';
const Datepicker = DP.default;

describe('DateRangePicker', function () {
  let elem;
  let input0;
  let input1;

  beforeEach(function () {
    elem = parseHTML('<div><input><input></div>').firstChild;
    [input0, input1] = elem.children;
    testContainer.appendChild(elem);
  });

  afterEach(function () {
    document.querySelectorAll('.datepicker').forEach((el) => {
      el.parentElement.removeChild(el);
    });
    delete input0.datepicker;
    delete input1.datepicker;
    delete elem.rangepicker;
    testContainer.removeChild(elem);
  });

  describe('constructor', function () {
    it('attachs the created instance to the bound element', function () {
      const drp = new DateRangePicker(elem);
      expect(elem.rangepicker, 'to be', drp);
    });

    it('configures the instance with the default values', function () {
      let drp = new DateRangePicker(elem);
      expect(drp.allowOneSidedRange, 'to be false');
    });

    it('creates datepicker for the inputs passing rangepicker and given options expect', function () {
      let drp = new DateRangePicker(elem);

      expect(input0.datepicker, 'to be a', Datepicker);
      expect(input1.datepicker, 'to be a', Datepicker);
      expect(input0.datepicker._options, 'to equal', {});
      expect(input1.datepicker._options, 'to equal', {});
      expect(input0.datepicker.rangepicker, 'to be', drp);
      expect(input1.datepicker.rangepicker, 'to be', drp);

      expect(drp.inputs, 'to equal', [input0, input1]);
      expect(drp.datepickers, 'to equal', [input0.datepicker, input1.datepicker]);

      delete input0.datepicker;
      delete input1.datepicker;
      delete elem.rangepicker;

      const fakeOptions = {foo: 123, bar: 456};
      drp = new DateRangePicker(elem, fakeOptions);

      expect(input0.datepicker._options, 'to equal', fakeOptions);
      expect(input1.datepicker._options, 'to equal', fakeOptions);
    });

    it('makes inputs, datepickers properties immutable', function () {
      const drp = new DateRangePicker(elem);

      expect(() => { drp.inputs[0] = null; }, 'to throw a', TypeError);
      expect(() => { drp.inputs[2] = {}; }, 'to throw a', TypeError);

      expect(() => { drp.datepickers[0] = null; }, 'to throw a', TypeError);
      expect(() => { drp.datepickers[2] = {}; }, 'to throw a', TypeError);
    });

    it('excludes inputs, allowOneSidedRange and maxNumberOfDates from options to pass Datepicker container', function () {
      new DateRangePicker(elem, {
        inputs: [input0, input1],
        allowOneSidedRange: false,
        maxNumberOfDates: 2,
        foo: 123,
      });

      expect(input0.datepicker._options, 'to equal', {foo: 123});
    });

    it('works with arbitrary input elements if they are provided in the inputs option', function () {
      const outsideEl = document.createElement('div');
      const drp = new DateRangePicker(outsideEl, {inputs: [input0, input1]});

      expect(outsideEl.rangepicker, 'to be', drp);
      expect(input0.datepicker.rangepicker, 'to be', drp);
      expect(input1.datepicker.rangepicker, 'to be', drp);
      expect([input0.datepicker, input1.datepicker], 'to equal', drp.datepickers);
    });

    it('inserts datepicker elements after the associated input elements)', function () {
      new DateRangePicker(elem);

      const dpElems = document.querySelectorAll('.datepicker');
      expect(dpElems.length, 'to be', 2);

      const index = [input0, input1].indexOf(dpElems[0].previousElementSibling);
      expect(index, 'to be one of', [0, 1]);
      expect(dpElems[1].previousElementSibling, 'to be', index === 1 ? input0 : input1);
    });

    it('does not add the active class to the picker elements', function () {
      new DateRangePicker(elem);

      const dpElems = Array.from(document.querySelectorAll('.datepicker'));
      expect(dpElems.filter(el => el.classList.contains('active')), 'to be empty');
    });

    it('does nothing but creating an instance if number of inputs < 2', function () {
      elem.removeChild(input1);

      let drp = new DateRangePicker(elem);
      expect(elem, 'not to have property', 'rangepicker');
      expect(drp, 'not to have properties', ['inputs', 'datepickers']);
      expect(input0, 'not to have property', 'datepicker');
      expect(document.querySelectorAll('.datepicker').length, 'to be', 0);

      const outsideEl = document.createElement('div');
      drp = new DateRangePicker(outsideEl, {inputs: [input0]});
      expect(outsideEl, 'not to have property', 'rangepicker');
      expect(input0, 'not to have property', 'datepicker');
      expect(document.querySelectorAll('.datepicker').length, 'to be', 0);
    });
  });

  describe('destroy()', function () {
    let drp;
    let spyDestroy0;
    let spyDestroy1;

    beforeEach(function () {
      drp = new DateRangePicker(elem);
      spyDestroy0 = sinon.spy(input0.datepicker, 'destroy');
      spyDestroy1 = sinon.spy(input1.datepicker, 'destroy');
    });

    afterEach(function () {
      spyDestroy0.restore();
      spyDestroy1.restore();
    });

    it('calls destroy() of each datepickers', function () {
      drp.destroy();
      expect(spyDestroy0.called, 'to be true');
      expect(spyDestroy1.called, 'to be true');
    });

    it('removes the instance from the bound element', function () {
      drp.destroy();
      expect(Object.prototype.hasOwnProperty.call(elem, 'rangepicker'), 'to be false');
    });
  });

  describe('dates property', function () {
    it('contains the array of the inputs\' selected dates', function () {
      const drp = new DateRangePicker(elem);
      expect(drp.dates, 'to equal', [undefined, undefined]);

      const date0 = new Date(2020, 3, 20).setHours(0, 0, 0, 0);
      const date1 = new Date(2020, 3, 22).setHours(0, 0, 0, 0);
      drp.datepickers[0].dates = [date0];
      drp.datepickers[1].dates = [date1];
      expect(drp.dates, 'to equal', [date0, date1]);
    });
  });

  describe('setOptions()', function () {
    it('updates allowOneSidedRange but ignores inputs if they are in the given options', function () {
      const input2 = document.createElement('input');
      const drp = new DateRangePicker(elem);

      drp.setOptions({allowOneSidedRange: true, inputs: [input2, input0]});
      expect(drp.allowOneSidedRange, 'to be true');
      expect(drp.inputs, 'to equal', [input0, input1]);
    });

    it('calls each datepicker\'s setOptions() with given options except inputs, allowOneSidedRange and maxNumberOfDates', function () {
      const drp = new DateRangePicker(elem);
      const stubDP0SetOptions = sinon.stub(drp.datepickers[0], 'setOptions').callsFake(() => {});
      const stubDP1SetOptions = sinon.stub(drp.datepickers[1], 'setOptions').callsFake(() => {});

      drp.setOptions({inputs: [], allowOneSidedRange: true, maxNumberOfDates: 2, foo: 123, bar: 456});
      expect(stubDP0SetOptions.args, 'to equal', [[{foo: 123, bar: 456}]]);
      expect(stubDP1SetOptions.args, 'to equal', [[{foo: 123, bar: 456}]]);
    });
  });
});
