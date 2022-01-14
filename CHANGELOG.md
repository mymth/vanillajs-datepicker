# changelog

## 1.2.0

### Potentially breaking changes

- __Edge Legacy (non-Chromium Edge) is no longer supported.__
  - Since Microsoft no longer supports it already and its market share is lower than IE, I decided not to add fallback code for Shadow DOM API.
  - If your program needs to support Edge Legacy, please use [Web Components polyfill](https://www.npmjs.com/package/@webcomponents/webcomponentsjs).
- __Date picker element is now inserted after the associated input element by default.__
  - The default value of the `container` option is changed to `null`.
  - If your program has the input element inside an element styled with `overflow` other than `visible` and the element doesn't have enough space, the picker will be clipped.
  - If you need the previous version's behavior to avoid it, please set `'body'` to the container option,
  - The purpose of this change is to make z-index adjustment in cases like #50 basically unneeded.
  - This change doesn't apply for inline picker.

### New features

- Add Bootstrap 5 support (#37, #73)
- Add Web Components support (#83)
  - `container` option now accepts HTMLElement instance.

### Bug fix

- Fix #56 — `minDate`/`maxDate` aren't set to the start/end of month/year when pickLevel > 0 and either format or passed date string doesn't contain the date part.
  - The same fix is applied to `datesDisabled` as well
- Fix — picker doesn't hide on unfocus if a date outside the minDate/maxDate range is entered to the input field.
- Fix — `disableTouchKeyboard` doesn't work
- Fix — picker doesn't hide on click outside after input is unfocused by closing mobile keyboard (maybe related to #72?)
- Fix — picker is placed incorrectly when container is user-specified element. (related to #81)

### Changes

- Change the default placement of `orientation: 'auto'` to bottom-left (#54, #82)
- Replace out-of-date dev dependencies: node-sass, uglyfy-es → dart-sass, terser (#76)
- Deprecate `disableTouchKeyboard` option. (#78)
- Change the way to Keep input element focused when clicking picker in order to prevent flicker (#85)
  - The change also adds capability for users to extend the picker (see #4 in [this comment](https://github.com/mymth/vanillajs-datepicker/issues/85#issuecomment-966604223) - Thank you, @xdev1)  
- Remove keydown event cancellation except arrow keys' preventDefault (#88)
- Apply the bootstrap-datepicker's locale updates
- Revise container's functionality
  - Not used internally for position calculation, only for users to control stacking context.
  - No changes for inline picker

## 1.1.4

### Changes

- Chnage `datepicer.show()` to move the focus to the input field if it's not focused
  - Fix #52 — picker shown by calling show() doesn't hide by clicking outside

## 1.1.3

### Bug fixes

- Fix #51 - TypeError occurs when initial dates are set in the input filed in multidate mode

## 1.1.2

### Bug fixes

- Fix #48 — inline picker submits form by click on prev/next buttons
- Fix — date with the name of 30-day month is parsed incorrectly if the current date is the 31st

## 1.1.1

### Bug fixes

- Fix #46 — date range picker cannot be created when using datepicker-full.min.js
- Fix #45 - onClickOutside listener calls unfocus() when the input field is not focused

## 1.1.0

### New features

- Add `updateOnBlur` option (#13)
- Add `showOnClick` option (#21)
    - Along with this, picker element's click handler is changed to keep the focus on input field after auto-hiding on date selection
- Add `pickLevel` option (#22, #23)
    - minView feature + comprehensive control on date picking level that works with edit on input field and `setDate()` call as well
- Add optional `forceRender` argument to `refresh()`API
- Add `setDates()` API to DateRangePicker (#27)
- Add support for package entry points 

### Bug fixes

- Fix #33 — the view doesn't go back to the days view after changing the selection by other than mouse operation

### Changes

- Change the edit mode so that it no longer discards unparsed changes when exiting
- Add shift + arrow key to the key patterns to enter the edit mode
- Make range highlight between range-start and -end available on all views as well as the days view
- Revise the cross reference between DateRangePicker and Datepicker instances to make it securely usable in custom event handler, etc.
- Improve readability of selected date in previous/next month area in the calendar


## 1.0.3

- Fix #24 — change event was fired inappropriately through setDate() API call 

## 1.0.2

- Fix #11, #17, #19 — calendar wasn't redrawn properly in some conditions
- Fix #3 — keyboard showed up by clicking on a calendar element when disableTouchKeyboard = true

## 1.0.1

- Add stylesheet for Foundation
- Add support for importing js by package name (For rollup, webpack)

## 1.0

First release
