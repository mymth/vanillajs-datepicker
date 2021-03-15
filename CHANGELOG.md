# changelog

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
