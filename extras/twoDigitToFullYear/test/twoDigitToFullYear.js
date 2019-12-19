import {twoDigitToFullYear} from '../twoDigitToFullYear.js';

const expect = require('unexpected');
const sinon = require('sinon');

describe('twoDigitToFullYear()', function () {
  it('converts 2-digit year to full year using 50 for the future years range by default', function () {
    let clock = sinon.useFakeTimers({now: new Date().setFullYear(2020)});

    expect(twoDigitToFullYear(0), 'to be', 2000);
    expect(twoDigitToFullYear(20), 'to be', 2020);
    expect(twoDigitToFullYear(70), 'to be', 2070);
    expect(twoDigitToFullYear(71), 'to be', 1971);

    clock.restore();
    clock = sinon.useFakeTimers({now: new Date().setFullYear(2080)});

    expect(twoDigitToFullYear(0), 'to be', 2100);
    expect(twoDigitToFullYear(30), 'to be', 2130);
    expect(twoDigitToFullYear(31), 'to be', 2031);
    expect(twoDigitToFullYear(80), 'to be', 2080);

    clock.restore();
  });

  it('uses sepecified future year range if it is given', function () {
    let clock = sinon.useFakeTimers({now: new Date().setFullYear(2020)});

    expect(twoDigitToFullYear(40, 20), 'to be', 2040);
    expect(twoDigitToFullYear(40, 19), 'to be', 1940);
    expect(twoDigitToFullYear(95, 75), 'to be', 2095);
    expect(twoDigitToFullYear(95, 74), 'to be', 1995);

    clock.restore();
    clock = sinon.useFakeTimers({now: new Date().setFullYear(2080)});

    expect(twoDigitToFullYear(0, 20), 'to be', 2100);
    expect(twoDigitToFullYear(0, 19), 'to be', 2000);
    expect(twoDigitToFullYear(55, 75), 'to be', 2155);
    expect(twoDigitToFullYear(55, 74), 'to be', 2055);

    clock.restore();
  });

  it('uses the century of baseDate for conversion if it is given', function () {
    const year2020 = new Date(2020, 0, 1);
    expect(twoDigitToFullYear(40, 20, year2020), 'to be', 2040);
    expect(twoDigitToFullYear(40, 19, year2020), 'to be', 1940);
    expect(twoDigitToFullYear(95, 75, year2020), 'to be', 2095);
    expect(twoDigitToFullYear(95, 74, year2020), 'to be', 1995);

    const year2280 = new Date(2280, 0, 1);
    expect(twoDigitToFullYear(0, 20, year2280), 'to be', 2300);
    expect(twoDigitToFullYear(0, 19, year2280), 'to be', 2200);
    expect(twoDigitToFullYear(55, 75, year2280), 'to be', 2355);
    expect(twoDigitToFullYear(55, 74, year2280), 'to be', 2255);
  });
});
