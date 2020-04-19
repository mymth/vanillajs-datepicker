# API

## Datepicker

### Static Properties

#### Datepicker.active
- Type: `Boolean`

Whether the picker element is shown. `true` when shown.

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

Pasre date string (or Date/time value) using given format and language

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

Whether the picker element is shown.


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

The method returns a Date object of selected date by default, and returns an array of selected dates in multidate mode. If format string is passed, it returns date string(s) formatted in given format.

```javascript
datepicker.getDate( [ format ] )
```
- **Arguments:**
  - [`format`] : {`String`} - Format string to stringify the date(s)
- **Return:**
  - {`Date`|`String`} - Selected date (or `undifined` if none is selected)
  - {`Date[]`|`String[]`} - Array of selected dates (or empty array if none is selected)

#### datepicker.hide()

Hide the picker element  
Not avilable on inline picker

```javascript
datepicker.hide()
```

#### datepicker.refresh()

Refresh the picker element and the associated input field

```javascript
datepicker.refresh( [ target ] )
```
- **Arguments:**
  - [`target`] : {`String`} - target item when refreshing one item only. `'picker'` or `'input'`

#### datepicker.setDate()

Set selected date(s)

In multidate mode, you can pass multiple dates as a series of arguments or an array. (Since each date is parsed individually, the type of the dates doesn't have to be the same.)  
The given dates are used to toggle the select status of each date. The number of selected dates is kept from exceeding the length set to `maxNumberOfDates`. See [Multidate Mode](overview?id=multidate-mode) for more details.

With `clear: true` option, the method can be used to clear the selection and to replace the selection instead of toggling in multidate mode. If the option is passed with no date arguments or an empty dates array, it works as "clear" (clear the selection then set nothing), and if the option is passed with new dates to select, it works as "replace" (clear the selection then set the given dates)

When `render: false` option is used, the method omits re-rendering the picker element. In this case, you need to call [`refresh()`](api?id=datepickerrefresh) method later in order for the picker element to reflect the changes. The input field is refreshed always regardless of this option.

When invalid (unparsable, repeated, disabled or out-of-range) dates are passed, the method ignores them and applies only valid ones. In the case that all the given dates are invalid, which is distiguished from passing no dates, the method considers it as an error and leaves the selection untouched.

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

#### datepicker.update()

Update the selected date(s) with input field's value  
Not avilable on inline picker

The input field will be refreshed with properly formatted date string.

```javascript
datepicker.update( [ options ] )
```
- **Arguments:**
  - [`options`] : {`Object`} - Function options:
    - `autohide`: {`Boolean`} - Whether to hide the picker element after update  
       – Default: `false`


### Events

All Datepicker-event objects are `CustomEvent` instances and dispached to the associated `<input>` element (for inline picker, the block element).  
They include the following extra data in the `details` property.

- `date`: {`Date`} - Selected date(s) (see [getDate()](api?id=datepickergetdate))
- `viewDate`: {`Date`} - Focused date
- `viewMode`: {`Number`} - ID of the current view
- `datepicker`: {`Datepicker`} - Datepicker instance

#### changeDate

Fired when the selcted dates are changed.

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

### Instance Methods

#### rangepicker.destroy()

Destroy the DateRangePicker instance

```javascript
rangepicker.destory()
```
- **Return:**
  - {`DateRangePicker`} - The instance destroyed

#### rangepicker.getDates()

Get the start and end dates of the date-range

The method returns Date objects by default. If format string is passed, it returns date strings formatted in given format.  
The result array always contains 2 items (start date/end date) and `undifined` is used for unselected side. (e.g. If none is selected, the result will be `[undifined, undifined]`. If only the end date is set when `allowOneSidedRange` config option is `true`, `[undifined, endDate]` will be returned.)

```javascript
rangepicker.getDates( [ format ] )
```
- **Arguments:**
  - [`format`] : {`String`} - Format string to stringify the dates
- **Return:**
  - {`Date[]`|`String[]`} - Start and end dates

#### rangepicker.setOptions()

Set new values to the config options

```javascript
rangepicker.setOptions( options )
```
- **Arguments:**
  - `options`: {`Object`} - Config options to update


