import '../_setup.js';
import {
  lastItemOf,
  pushUnique,
  stringToArray,
  isInRange,
  limitToRange,
  createTagRepeat,
  optimizeTemplateHTML
} from '../../../js/lib/utils.js';

describe('lib/utils', function () {
  describe('lastItemOf()', function () {
    it('returns the last item of array', function () {
      expect(lastItemOf([1, 2, 3]), 'to be', 3);
      expect(lastItemOf(['foo']), 'to be', 'foo');
      expect(lastItemOf([]), 'to be undefined');
    });
  });

  describe('pushUnique()', function () {
    it('add items to an array if the item is not in the array', function () {
      let arr = ['foo', 'bar'];
      pushUnique(arr, 'foo');
      expect(arr, 'to equal', arr);

      pushUnique(arr, 'baz');
      expect(arr, 'to equal', ['foo', 'bar', 'baz']);

      arr = ['foo', 'bar'];
      pushUnique(arr, 'bar', 'baz', 'bam', 'baz');
      expect(arr, 'to equal', ['foo', 'bar', 'baz', 'bam']);
    });

    it('returns the given array', function () {
      let arr = ['foo', 'bar'];
      expect(pushUnique(arr, 'baz'), 'to be', arr);
    });
  });

  describe('stringToArray()', function () {
    it('converts a string to array by spliting it with given separator', function () {
      expect(stringToArray('foo,bar,baz', ','), 'to equal', ['foo', 'bar', 'baz']);
      expect(stringToArray('abc-def', '-'), 'to equal', ['abc', 'def']);
    });

    it('return an empty array if string is empty', function () {
      expect(stringToArray('', ','), 'to equal', []);
    });
  });

  describe('isInRange()', function () {
    it('returns whether a value is between given min & max values', function () {
      expect(isInRange(0, 1, 3), 'to be false');
      expect(isInRange(1, 1, 3), 'to be true');
      expect(isInRange(2, 1, 3), 'to be true');
      expect(isInRange(3, 1, 3), 'to be true');
      expect(isInRange(4, 1, 3), 'to be false');
      //
      expect(isInRange('abb', 'abc', 'ccc'), 'to be false');
      expect(isInRange('bbc', 'abc', 'ccc'), 'to be true');
      expect(isInRange('ccb', 'abc', 'ccc'), 'to be true');
      expect(isInRange('ccd', 'abc', 'ccc'), 'to be false');
    });

    it('omits minimum check if min = undefined', function () {
      expect(isInRange(0, undefined, 3), 'to be true');
      expect(isInRange(4, undefined, 3), 'to be false');
      expect(isInRange(-Infinity, undefined, 3), 'to be true');
    });

    it('omits maximum check if max = undefined', function () {
      expect(isInRange(0, 1, undefined), 'to be false');
      expect(isInRange(4, 1, undefined), 'to be true');
      expect(isInRange(Infinity, 1, undefined), 'to be true');
    });
  });

  describe('limitToRange()', function () {
    it('returns min value if it\'s specified and the value < min', function () {
      expect(limitToRange(0, 1, undefined), 'to be', 1);
      expect(limitToRange(0, 1, 3), 'to be', 1);
      expect(limitToRange('abb', 'abc', 'ccc'), 'to be', 'abc');
    });

    it('returns max value if it\'s specified and the value > max', function () {
      expect(limitToRange(4, undefined, 3), 'to be', 3);
      expect(limitToRange(4, 1, 3), 'to be', 3);
      expect(limitToRange('ccd', 'abc', 'ccc'), 'to be', 'ccc');
    });

    it('returns the given value if it is within the specified min/max', function () {
      expect(limitToRange(1, undefined, undefined), 'to be', 1);
      expect(limitToRange(1, undefined, 3), 'to be', 1);
      expect(limitToRange(3, 1, undefined), 'to be', 3);
      expect(limitToRange(1, 1, 3), 'to be', 1);
      expect(limitToRange(3, 1, 3), 'to be', 3);

      expect(limitToRange('abc', 'aaa', 'ccc'), 'to be', 'abc');
      expect(limitToRange('aaa', 'aaa', 'ccc'), 'to be', 'aaa');
      expect(limitToRange('ccc', 'aaa', 'ccc'), 'to be', 'ccc');
    });
  });

  describe('createTagRepeat()', function () {
    it('returns HTML of a tag repeated specified times', function () {
      expect(createTagRepeat('div', 3), 'to be', '<div></div><div></div><div></div>');
      expect(createTagRepeat('span', 2), 'to be', '<span></span><span></span>');

      // returns at least 1 tag
      expect(createTagRepeat('p', 0), 'to be', '<p></p>');
    });

    it('adds addributes if name:value pairs are given', function () {
      expect(createTagRepeat('p', 2, {class: 'foo bar'}), 'to be', '<p class="foo bar"></p><p class="foo bar"></p>');
      expect(createTagRepeat('p', 2, {'data-x': '0', 'data-y': '1'}), 'to be', '<p data-x="0" data-y="1"></p><p data-x="0" data-y="1"></p>');
    });

    it('accepts function that takes current index as the argument for attribute value', function () {
      expect(createTagRepeat('li', 3, {'data-cnt': ix => ix + 1}), 'to be', '<li data-cnt="1"></li><li data-cnt="2"></li><li data-cnt="3"></li>');
    });
  });

  describe('optimizeTemplateHTML()', function () {
    it('removes spacing before and after tags', function () {
      let text = `<div id="test">
  <div>
    test 123
  </div>
</div>`;
      expect(optimizeTemplateHTML(text), 'to be', '<div id="test"><div>test 123</div></div>');
      expect(optimizeTemplateHTML('foo'), 'to be', 'foo');
    });
  });
});
