# Options

There are 2 kinds of config options: the Datepicker options and the DateRangePicker options. The former are for `DatePicker` object and the latter are for `DateRangePicker` object.

Datepicker options can be used with date range picker. And when doing so, you can pass them mixing with DateRangePicker options into one "options" object.

> Datepicker options passed to date range picker are applied to its start- and end-date pickers.

Aside from a couple of exceptions, config options can be updated dynamically using the `setOptions()` method.

### Datepicker Options

#### autohide
- Type: `Boolean`
- Default: `false`

Whether to hide the date picker immediately after a date is selected.

> Not available on inline picker.

#### beforeShowDay
- Type: `Function`
- Default: `null`

Function to customize the day cells in the days view. The function is called when each day cell is rendered.

- **function**
  - Arguments:
    - `date`: {`Date`} - Date associated with the cell
  - Return:
    - {`Object`} - Things to customize. Available properties are:
      - `enabled`: {`Boolean`} - whether the cell is selectable
      - `classes`: {`String`} - space-separated additional CSS classes for the cell element
      - `content`: {`String`} - HTML for the cell element's child nodes
    - {`String`} - additional classes — same as returning `{ classes: additionalClasses }`
    - {`Boolean`} - whether the cell is selectable — same as returning `{ enabled: isSelectable }`

```javascript
function (date) {
    let isSelectable, additionalClasses, htmlFragment;
    //...your customization logic
    
    return {
        enabled: isSelectable,
        classes: additionalClasses,
        content: htmlFragment,
    };
    // Or
    return additionalClasses;
    // Or
    return isSelectable;
}
```

#### beforeShowDecade
- Type: `Function`
- Default: `null`

Function to customize the decade cells in the decades view. The function is called when each decade cell is rendered.
> See [`beforeShowDay`](#beforeShowDay) for the function details.

#### beforeShowMonth
- Type: `Function`
- Default: `null`

Function to customize the month cells in the months view. The function is called when each month cell is rendered.
> See [`beforeShowDay`](#beforeShowDay) for the function details.

#### beforeShowYear
- Type: `Function`
- Default: `null`

Function to customize the year cells in the years view. The function is called when each year cell is rendered.
> See [`beforeShowDay`](#beforeShowDay) for the function details.

#### buttonClass
- Type: `String`
- Default: `'button'`

CSS class for `<button>` elements. (view switch, prev/next buttons, clear and today buttons)

> For constructor only. Cannot be used with `setOptions()`.  

#### calendarWeeks
- Type: `Boolean`
- Default: `false`

Whether to show the week number ([ISO week](https://en.wikipedia.org/wiki/ISO_week_date)) on week rows.

#### clearBtn
- Type: `Boolean`
- Default: `false`

Whether to show the clear button.

#### container
- Type: `String`
- Default: `body`

CSS selector for the element to append the date picker.

> For constructor only. Cannot be used with `setOptions()`.  
> On inline picker, this option is ignored and overwritten to the associated element.

#### dateDelimiter
- Type: `String`
- Default: `','`

Delimiter string to separate the dates in a multi-date string.

> The delimiter must not be included in date format string.

#### datesDisabled
- Type: `Array`
- Default: `[]`

Dates to disable. Array of date strings, Date objects, time values or mix of those.

> Multi-date string cannot be used. Use multiple single-date strings instead.

#### daysOfWeekDisabled
- Type: `Number[]`
- Default: `[]`

Days of the week to disable. `0`:_Sunday_ – `6`:_Saturday_, up to 6 items.

#### daysOfWeekHighlighted
- Type: `Number[]`
- Default: `[]`

Days of the week to highlight. `0`:_Sunday_ – `6`:_Saturday_, up to 6 items.

#### defaultViewDate
- Type: `String`|`Date`|`Number`
- Default: current date

The date to be focused when the date picker opens with no selected date(s).

#### disableTouchKeyboard
- Type: `Boolean`
- Default: `false`

Whether to prevent on-screen keyboard on mobile devices from showing up when the associated input field receives focus.

> Not available on inline picker.

#### format
- Type: `String`|`Object`
- Default: `'mm/dd/yyyy'`

[Date format](date-string+format?id=date-format) string.

> The format string must not include the [dateDelimiter](options?id=datedelimiter) string.

Alternatively, object that contains custom parser and formatter functions can be used.

- **Parser**
  - Property \(function\) name: `toValue`
  - Arguments:
    - `date`: {`String`|`Date`|`Number`} - date string, Date object or time value to parse
    - `format`: {`Object`} - format object itself
    - `locale`: {`Object`} - locale of the current language
  - Return:
    - {`Date`} - parsed date object
- **Formatter**
  - Property \(function\) name: `toDisplay`
  - Arguments::
    - `date`: {`Date`} - date object to format
    - `format`: {`Object`} - format object itself
    - `locale`: {`Object`} - locale of the current language
  - Return:
    - {`String`} - formated date

```javascript
{
    format: {
        toValue(date, format, locale) {
            let dateObject;
            //...your custom parse logic
            return dateObject;
        },
        toDisplay(date, format, locale) {
            let dateString;
            //...your custom format logic
            return dateString;
        },
    },
}
```

#### language
- Type: `String`
- Default: `'en'`

The language code of the language used by the date picker.

> For languages other than `en` to work, their locales must be loaded into your project/program.  
> See [i18n](i18n) for the details.

#### maxDate
- Type: `String`|`Date`|`Number`
- Default: `null`

Maximum limit to selectable date. No limit is applied if `null` is set.

#### maxNumberOfDates
- Type: `Number`
- Default: `1`

Maximum number of dates users can select. No limit is applied if `0` is set.

> Not available for date range picker.

#### maxView
- Type: Number
- Default: `3`

Maximum limit to the view that the date picker displays. `0`:_days_ – `3`:_decades_.

#### minDate
- Type: `String`|`Date`|`Number`
- Default: `null`

Minimum limit to selectable date. No limit is applied if `null` is set.

#### nextArrow
- Type: `String`
- Default: `'»'`

HTML (or plain text) for the button label of the "Next" button.

> See the note in [i18n ≻ Text Direction](i18n?id=text-direction) when using with RTL languages.

#### orientation
- Type: `String`
- Default: `'auto'`

Space-separated string for date picker's horizontal and vertical placement to the associated input field. `left`|`right`|`auto` for horizontal and `top`|`bottom`|`auto` for vertical.

> The order can be random.  
> If one direction is omitted, it falls back to `auto`. (e.g. `'top'` == `'top auto'`)  
> Not available on inline picker.

#### pickLevel
- Type: `Number`
- Default: `0`

The level that the date picker allows to pick. `0`:_date_,`1`: _month_ &nbsp;or `2`:_year_.

> When this option is `1`, the selected date becomes the 1st of the month or, if the date picker is the end-date picker of date range picker, the last day of the month.  
> When this option is `2`, the selected date becomes January 1st of the year or, if the date picker is the end-date picker of date range picker, December 31st of the year.

#### prevArrow
- Type: `String`
- Default: `'«'`

HTML (or plain text) for the button label of the "Prev" button.

> See the note in [i18n ≻ Text Direction](i18n?id=text-direction) when using with RTL languages.

#### showDaysOfWeek
- Type: `Boolean`
- Default: `true`

Whether to show the day names of the week.

#### showOnClick
- Type: `Boolean`
- Default: `true`

Whether to show the date picker when the associated input filed is clicked.

> Not available on inline picker.

#### showOnFocus
- Type: `Boolean`
- Default: `true`

Whether to show the date picker automatically when the associated input filed receives focus.

> Not available on inline picker.

#### startView
- Type: `Number`
- Default: `0`

The view displayed when the date picker opens. `0`:_days_ – `3`:_decades_.

#### title
- Type: `String`
- Default: `''`

Title string shown in the date picker's title bar.

> The title bar is not displayed if the title is empty.

#### todayBtn
- Type: `Boolean`
- Default: `false`

Whether to show the today button.

#### todayBtnMode
- Type: `Number`
- Default: `0`

The mode how the today button behaves.

Mode | Name | Description
--|--|--
`0` | focus | Move the focused date to the current date without changing the selection  
`1` | select | Select (or toggle the selection of) the current date

#### todayHighlight
- Type: `Boolean`
- Default: `false`

Whether to highlight the current date.

#### updateOnBlur
- Type: `Boolean`
- Default: `true`

Whether to update the selected date(s) with the input field's value when the input field is losing focus.

> When this option is `false`, if the user edits the date string in input field, it will be parsed and applied only when the user presses the <kbd>Enter</kbd> key. If the edit is left unparsed, it will be discarded when input field becomes unfocused (by <kbd>Tab</kbd> key press or click outside the picker element/input field).
>
> Not available on inline picker.

#### weekStart
- Type: `Number`
- Default: `0`

Start day of the week. `0`:_Sunday_ – `6`:_Saturday_.


### DateRangePicker Options

#### allowOneSidedRange
- Type: `Boolean`
- Default: `false`

Whether to allow one side of the date-range to be blank.

> When this option is `false`, if the user selects a date on one side while the other side is blank, the date range picker complements the blank side with the same date as the selected side.  
> Similarly, if the user clears one side of the date-range, the date range picker also clears the other side automatically.

#### inputs
- Type: `Element[]`
- Default: `input` elements inside the associated block element

Input fields to attach start- and end-date pickers. Must contain 2 items.

> For constructor only. Cannot be used with `setOptions()`.
