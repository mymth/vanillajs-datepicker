global.expect = require('unexpected');
global.sinon = require('sinon');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {window} = new JSDOM('<body><div id="test-container"></div></body>', {
  url: 'https://example.org',
  pretendToBeVisual: true
});
const document = window.document;

global.JSDOM = JSDOM;
global.window = window;
global.testContainer = document.getElementById('test-container');

const exposeToGlobal = [
  'document',
  'CustomEvent',
  'DocumentFragment',
  'Element',
  'Event',
  'EventTarget',
  'NodeList',
  'Range',
  'HTMLElement',
  'ShadowRoot',
];
exposeToGlobal.forEach((prop) => {
  global[prop] = window[prop];
});

global.simulant = require('simulant');

class CustomElement extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.append( document.createElement('slot'));
  }
}
window.customElements.define('custom-element', CustomElement);
