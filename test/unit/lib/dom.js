import '../_setup.js';
import {
  parseHTML,
  isVisible,
  hideElement,
  showElement,
  emptyChildNodes,
  replaceChildNodes,
} from '../../../js/lib/dom.js';

describe('lib/dom', function () {
  let el;

  before(function () {
    testContainer.innerHTML = '<div class="test"></div>';
    el = testContainer.firstChild;
  });

  after(function () {
    testContainer.removeChild(el);
  });

  describe('parseHTML()', function () {
    it('parses an html fragment with Range.prototype.createContextualFragment()', function () {
      const spyFragment = sinon.spy(Range.prototype, 'createContextualFragment');
      const html = '<div>test</div>';
      const result = parseHTML(html);

      expect(spyFragment.calledWith(html), 'to be true');
      expect(spyFragment.returned(result), 'to be true');

      spyFragment.restore();
    });
  });

  describe('isVisible()', function () {
    it('returns true if either offsetHeight > 0, offsetWidth > 0 or getClientRects() has an item', function () {
      expect(isVisible(el), 'to be false');

      let stub = sinon.stub(el, "offsetHeight").get(() => 10);
      expect(isVisible(el), 'to be true');
      stub.restore();

      stub = sinon.stub(el, "offsetWidth").get(() => 10);
      expect(isVisible(el), 'to be true');
      stub.restore();

      stub = sinon.stub(el, 'getClientRects').callsFake(() => [{x: 10}, {x: 20}]);
      expect(isVisible(el), 'to be true');
      stub.restore();
    });
  });

  describe('hideElement()', function () {
    it('sets none to style.display', function () {
      hideElement(el);
      expect(el.style.display, 'to be', 'none');
      el.removeAttribute('style');
    });

    it('copies style.display to data-style-display attribute if other than none is set', function () {
      el.style.display = 'flex';
      hideElement(el);

      expect(el.style.display, 'to be', 'none');
      expect(el.getAttribute('data-style-display'), 'to be', 'flex');

      el.removeAttribute('data-style-display');
      el.style.display = 'none';
      hideElement(el);

      expect(el.hasAttribute('data-style-display'), 'to be false');

      el.removeAttribute('style');
    });
  });

  describe('showElement()', function () {
    it('clears style.display if none is set', function () {
      el.style.display = 'none';
      showElement(el);
      expect(el.style.display, 'to be', '');

      el.style.display = 'inline';
      showElement(el);
      expect(el.style.display, 'to be', 'inline');

      el.removeAttribute('style');
    });

    it('restores the value of data-style-display attribute to style.display if it exists', function () {
      el.style.display = 'none';
      el.setAttribute('data-style-display', 'flex');
      showElement(el);

      expect(el.style.display, 'to be', 'flex');
      expect(el.hasAttribute('data-style-display'), 'to be false');

      el.removeAttribute('style');
    });
  });

  describe('emptyChildNodes()', function () {
    it('removes all child nodes', function () {
      el.innerHTML = '<div>test</div><!-- comment--><div></div>';
      emptyChildNodes(el);

      expect(el.innerHTML, 'to be empty');
    });
  });

  describe('replaceChildNodes()', function () {
    it('replace all child nodes with given nodes', function () {
      const htmlBefore = '<div>test</div><!-- comment--><div></div>';
      const htmlAfter = '<div id="foo">foo</div><div id="bar">bar</div>';

      // with html
      el.innerHTML = htmlBefore;
      replaceChildNodes(el, htmlAfter);
      expect(el.innerHTML, 'to be', htmlAfter);

      // with DocumentFragment
      const fragment = document.createRange().createContextualFragment(htmlAfter);
      el.innerHTML = htmlBefore;
      replaceChildNodes(el, fragment);
      expect(el.innerHTML, 'to be', htmlAfter);

      // with NodeList
      const nodeList = el.querySelectorAll('div');
      el.innerHTML = htmlBefore;
      replaceChildNodes(el, nodeList);
      expect(el.innerHTML, 'to be', htmlAfter);

      // with array
      el.innerHTML = htmlBefore;
      replaceChildNodes(el, Array.from(nodeList));
      expect(el.innerHTML, 'to be', htmlAfter);

      el.innerHTML = '';
    });
  });
});
