# API

## Datepicker

### Static Properties

#### Datepicker.locales
- Type: `Object`

Installed locales in `[languageCode]: localeObject` format. `en`:_English (US)_ is pre-installed.

> See [i18n](i18n) for the details.

### Static Methods

#### Datepicker.formatDate()

Format a Date object or a time value using given format and language

```javascript
Datepicker.formatDate( date , format [, lang ] )
```
- **Arguments:**
  - `date`: {`Date`|`Number`} - Date or time value to format
  - `format`: {`String`|`Object`} - Format string or object that contains `toDisplay()` custom formatter  
    See [Options ≻ format](options?id=format)
  - [`lang`] : {`String`} - Language code for the locale to use  
    – Default: `'en'`
- **Return:**
  - {`String`} - Formatted date

#### Datepicker.parseDate()

Parse date string (or Date/time value) using given format and language

```javascript
Datepicker.parseDate( dateStr , format [, lang ] )
```
- **Arguments:**
  - `dateStr`: {`String`|`Date`|`Number`} - Date string, Date object or time value to parse
  - `format`: {`String`|`Object`} - Format string or object that contains `toValue()` custom parser  
    See [Options ≻ format](options?id=format)
  - [`lang`] : {`String`} - Language code for the locale to use  
    – Default: `'en'`
- **Return:**
  - {`Number`} - Time value of parsed date


### Instance Properties

#### datepicker.active
- Type: `Boolean`

Whether the picker element is shown  

#### datepicker.element
- Type: `HTMLElement`

DOM object of the element the datepicker is bound to

#### datepicker.pickerElement
- Type: `HTMLDivElement`

DOM object of picker element  

#### datepicker.rangepicker
- Type: `DateRangePicker`

DateRangePicker instance that the datepicker belongs to  
Only avalable when the datepicker is a part of date range picker  

#### datepicker.rangeSideIndex
- Type: `Number`

Index number that represents which side of DateRangePicker the datepicker is for. Either `0`:_start side_ or `1`:_end side_  
Only avalable when the datepicker is a part of date range picker  


### Instance Methods

#### datepicker.destroy()

Destroy the Datepicker instance

```javascript
datepicker.destroy()
```
- **Return:**
  - {`Detepicker`} - The instance destroyed

#### datepicker.getDate()

Get selected date(s)

The method returns a Date object of selected date by default, and returns an array of selected dates in multidate mode. If a format string is passed, it returns a date string(s) formatted in the given format.

```javascript
datepicker.getDate( [ format ] )
```
- **Arguments:**
  - [`format`] : {`String`} - Format string to stringify the date(s)
- **Return:**
  - {`Date`|`String`} - Selected date (or `undefined` if none is selected)
  - {`Date[]`|`String[]`} - Array of selected dates (or empty array if none is selected)

#### datepicker.getFocusedDate()

Get the focused date

The method returns a Date object of focused date by default. If format string is passed, it returns date string formatted in given format.

```javascript
datepicker.getFocusedDate( [ format ] )
```
- **Arguments:**
  - [`format`] : {`String`} - Format string to stringify the date
- **Return:**
  - {`Date`|`String`} - Focused date (viewDate)

#### datepicker.hide()

Hide the picker element  
Not available on inline picker

```javascript
datepicker.hide()
```

#### datepicker.refresh()

Refresh the picker element and the associated input field

```javascript
datepicker.refresh( [ target ], [ forceRender ] )
```
- **Arguments:**
  - [`target`] : {`String`} - Target item when refreshing one item only. `'picker'` or `'input'`
  - [`forceRender`] : {`Boolean`} - Whether to re-render the picker element regardless of its state instead of optimized refresh  
    – Default: `'false'`

#### datepicker.setDate()

Set selected date(s)

In multidate mode, you can pass multiple dates as a series of arguments or an array. (Since each date is parsed individually, the type of the dates doesn't have to be the same.)  
The given dates are used to toggle the select status of each date. The number of selected dates is kept from exceeding the length set to `maxNumberOfDates`. See [Multidate Mode](overview?id=multidate-mode) for more details.

With `clear: true` option, the method can be used to clear the selection and to replace the selection instead of toggling in multidate mode. If the option is passed with no date arguments or an empty dates array, it works as "clear" (clear the selection then set nothing), and if the option is passed with new dates to select, it works as "replace" (clear the selection then set the given dates)

When `render: false` option is used, the method omits re-rendering the picker element. In this case, you need to call [`refresh()`](api?id=datepickerrefresh) method later in order for the picker element to reflect the changes. The input field is refreshed always regardless of this option.

When invalid (unparsable, repeated, disabled or out-of-range) dates are passed, the method ignores them and applies only valid ones. In the case that all the given dates are invalid, which is distinguished from passing no dates, the method considers it as an error and leaves the selection untouched. (The input field also remains untouched unless `revert: true` option is used.)  
Replacing the selection with the same date(s) also causes a similar situation. In both cases, the method does not refresh the picker element unless `forceRefresh: true` option is used.

If `viewDate` option is used, the method changes the focused date to the specified date instead of the last item of the selection.

```javascript
datepicker.setDate( date1 [, date2 [, ... dateN ]][, options ] )
datepicker.setDate( dates [, options ] )
datepicker.setDate( [ options ] )
```
- **Arguments:**
  - [`...dates`] : {...(`String`|`Date`|`Number`)|`Array`} - Date strings, Date objects, time values or mix of those for new selection
  - [`options`] : {`Object`} - Function options:
    - `clear`: {`Boolean`} - Whether to clear the existing selection  
      – Default: `false`
    - `render`: {`Boolean`} - Whether to re-render the picker element  
      – Default: `true`
    - `autohide`: {`Boolean`} - Whether to hide the picker element after re-render  
      Ignored when used with `render: false`  
      – Default: the value of `autohide` config option
    - `revert`: {`Boolean`} - Whether to refresh the input field when all the passed dates are invalid  
      – Default: `false`
    - `forceRefresh`: {`Boolean`} - Whether to refresh the picker element when passed dates don't change the existing selection  
      – Default: `false`
    - `viewDate`: {`Date`|`Number`|`String`} - Date to be focused after setiing date(s)  
      – Default: The last item of the resulting selection, or `defaultViewDate` config option if none is selected

#### datepicker.setFocusedDate()

Set focused date

By default, the method updates the focus on the view shown at the time, or the one set to the [`startView`](options?id=startview) config option if the picker is hidden.  
When resetView: `true` is passed, the view displayed is changed to the [`pickLevel`](options?id=pickLevel) config option's if the picker is shown.

```javascript
datepicker.setFocusedDate( viewDate [, resetView ] )
```
- **Arguments:**
  - `viewDate` : {`Date`|`Number`|`String`} - Date string, Date object, time values of the date to focus
  - [`resetView`] : {`Boolean`} - Whether to change the view to `pickLevel` config option's when the picker is shown. Ignored when the picker is hidden  
    – Default: `'false'`

#### datepicker.setOptions()

Set new values to the config options

```javascript
datepicker.setOptions( options )
```
- **Arguments:**
  - `options`: {`Object`} - Config options to update

#### datepicker.show()

Show the picker element

```javascript
datepicker.show()
```

#### datepicker.toggle()

Toggle the display of the picker element  
Not available on inline picker

Unlike [`hide()`](api?id=datepickerhide), the picker does not return to the start view when hiding.

```javascript
datepicker.toggle()
```

#### datepicker.update()

Update the selected date(s) with input field's value  
Not available on inline picker

The input field will be refreshed with properly formatted date string.

In the case that all the entered dates are invalid (unparsable, repeated, disabled or out-of-range), which is distinguished from empty input field, the method leaves the input field untouched as well as the selection by default. If `revert: true` option is used in this case, the input field is refreshed with the existing selection.  
The method also doesn't refresh the picker element in this case and when the entered dates are the same as the existing selection. If `forceRefresh: true` option is used, the picker element is refreshed in these cases too.

```javascript
datepicker.update( [ options ] )
```
- **Arguments:**
  - [`options`] : {`Object`} - Function options:
    - `autohide`: {`Boolean`} - Whether to hide the picker element after update  
       – Default: `false`
    - `revert`: {`Boolean`} - Whether to refresh the input field when all the passed dates are invalid  
      – Default: `false`
    - `forceRefresh`: {`Boolean`} - Whether to refresh the picker element when input field's value doesn't change the existing selection  
      – Default: `false`


### Events

All Datepicker-event objects are `CustomEvent` instances and dispatched to the associated `<input>` element (for inline picker, the block element).  
They include the following extra data in the `detail` property.

- `date`: {`Date`} - Selected date(s) (see [getDate()](api?id=datepickergetdate))
- `viewDate`: {`Date`} - Focused date
- `viewId`: {`Number`} - ID of the current view
- `datepicker`: {`Datepicker`} - Datepicker instance

#### changeDate

Fired when the selected dates are changed.

#### changeMonth

Fired when the focused date is changed to a different month's date. 

#### changeView

Fired when the current view is changed.

#### changeYear

Fired when the focused date is changed to a different year's date. 

#### hide

Fired when the date picker becomes hidden.

#### show

Fired when the date picker becomes visible.


## DateRangePicker

### Instance Properties

#### rangepicker.datepickers
- Type: `Array`

Array of associated Datepicker instances  

#### rangepicker.element
- Type: `HTMLElement`

DOM object of the element the date-range picker is bound to

#### rangepicker.inputs
- Type: `Array`

Array of the DOM objects of the 2 `<input>` elements used by the date-range picker  
The first item is the start side, the second is the end side


### Instance Methods

#### rangepicker.destroy()

Destroy the DateRangePicker instance

```javascript
rangepicker.destroy()
```
- **Return:**
  - {`DateRangePicker`} - The instance destroyed

#### rangepicker.getDates()

Get the start and end dates of the date-range

The method returns Date objects by default. If format string is passed, it returns date strings formatted in given format.  
The result array always contains 2 items (start date/end date) and `undefined` is used for unselected side. (e.g. If none is selected, the result will be `[undefined, undefined]`. If only the end date is set when `allowOneSidedRange` config option is `true`, `[undefined, endDate]` will be returned.)

```javascript
rangepicker.getDates( [ format ] )
```
- **Arguments:**
  - [`format`] : {`String`} - Format string to stringify the dates
- **Return:**
  - {`Date[]`|`String[]`} - Start and end dates

#### rangepicker.setDates()

Set the start and end dates of the date range

The method calls [`datepicker.setDate()`](api?id=datepickersetdate) internally using each of the arguments in start→end order.

When a `clear: true` option object is passed instead of a date, the method clears the date.

If an invalid date, the same date as the current one or an option object without `clear: true` is passed, the method considers that argument as an "ineffective" argument because calling [`datepicker.setDate()`](api?id=datepickersetdate) with those values makes no changes to the date selection.

When the [`allowOneSidedRange`](options?id=allowonesidedrange) config option is `false`, passing `{clear: true}` to clear the range works only when it is done to the last effective argument (in other words, passed to `rangeEnd` or to `rangeStart` along with ineffective `rangeEnd`). This is because when the date range is changed, it gets normalized based on the last change at the end of the changing process.

```javascript
rangepicker.setDates( rangeStart , rangeEnd )
```
- **Arguments:**
  - `rangeStart` : {`Date`|`Number`|`String)`|`Object`} - Start date of the range or `{clear: true}` to clear the date
  - `rangeEnd` : {`Date`|`Number`|`String)`|`Object`} - End date of the range or `{clear: true}` to clear the date

#### rangepicker.setOptions()

Set new values to the config options

```javascript
rangepicker.setOptions( options )
```
- **Arguments:**
  - `options`: {`Object`} - Config options to update


