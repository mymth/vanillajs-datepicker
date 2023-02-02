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
      - <span class="muted">`enabled`: {`Boolean`} - whether the cell is selectable (deprecated)</span>
      - `classes`: {`String`} - space-separated additional CSS classes for the cell element
      - `content`: {`String`} - HTML for the cell element's child nodes
    - {`String`} - additional classes — same as returning `{ classes: additionalClasses }`
    - <span class="muted">{`Boolean`} - whether the cell is selectable — same as returning `{ enabled: isSelectable } (deprecated)`</span>

  > Support for boolean return value, `enabled` property of return object, and "disabled" class in `classes` property or return string will be removed. Use [`datesDisabled`](#datesDisabled) with callback function instead.

```javascript
function (date) {
    let additionalClasses, htmlFragment;
    //...your customization logic
    
    return {
        classes: additionalClasses,
        content: htmlFragment,
    };
    // Or
    return additionalClasses;
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

> This option should be changed to match the button element class of the CSS framework. (e.g. 'btn' for Bootstrap)
>
> For constructor only. Cannot be used with `setOptions()`.  

#### <span class="muted">calendarWeeks (deprecated)</span>
This option will be removed in favor of the [`weekNumbers`](#weekNumbers) option.

<div class="muted">

- Type: `Boolean`
- Default: `false`

Whether to show the week number ([ISO week](https://en.wikipedia.org/wiki/ISO_week_date)) on week rows.
</div>

#### <span class="muted">clearBtn (deprecated)</span>
Synonym of `clearButton` — this option will be removed.

#### clearButton
- Type: `Boolean`
- Default: `false`

Whether to show the clear button.

#### container
- Type: `String | HTMLElement`
- Default: `null`

The element or CSS selector for the element to append the date picker.  

> By default, date picker is inserted after the associated input field. This option is for changing where to add the date picker. (e.g. to prevent date picker from being clipped when the input field is inside an element styled with overflow: hidden)    
> On inline picker, this option is ignored and overwritten to the associated element.
>
> For constructor only. Cannot be used with `setOptions()`.  

#### dateDelimiter
- Type: `String`
- Default: `','`

Delimiter string to separate the dates in a multi-date string.

> The delimiter must not be included in date format string.

#### datesDisabled
- Type: `Array`|`Function`
- Default: `[]`

Dates to disable. Array of date strings, Date objects, time values or mix of those.

> Multi-date string cannot be used. Use multiple single-date strings instead.  
>
> Given dates are processed to match the [`pickLevel`](#pickLevel) at the time.    
> If [`pickLevel`](#pickLevel) is changed dynamically and independently, the array will be reset to empty. Therefore, this option should be changed together when changing [`pickLevel`](#pickLevel) dynamically.

Alternatively, a function that returns whether the passed date is disabled can be used.

- **function**
  - Arguments:
    - `date`: {`Date`} - Date to examine. When the function is used...
      - to render the picker element, the date associated with the cell to render
      - for `setDate()`/`update()` to validate the date(s) passed/entered by the user, the given date
    - `viewId`: {`Number`} - When the function is used...
      - to render the picker element, the ID of the view currently rendering (`0`:_days_ – `3`:_decades_ )
      - for `setDate()`/`update()` to validate the passed/entered date(s), [`pickLevel`](#pickLevel)
    - `rangeEnd`: {`Boolean`} - Whether the date picker is the end-date picker of date range picker 
  - Return:
    - {`Boolean`} - Whether the date is disabled

```javascript
function (date, viewId, rangeEnd) {
  let isDateDisabled;
  // ...your evaluation logic
  return isDateDisabled;
}
```

> When view ID > `0`, the 1st of the month or the 1st of January of the year is passed to the `date` argument, and if the date picker is the end-date picker of a date range picker, the last day of the month or the 31st of December of the year is passed, instead. (The same rules as [`pickLevel`](#pickLevel))
>
> Note: because of the above, to disable the 1st of a month (the last day if `rangeEnd` is `true`), the `viewId` argument has to be evaluated along with `date`.<br>
> (e.g. `date.getDate() == 1 && date.getMonth() == 0 && viewId == 0`)<br>
> Otherwise, that month will be unclickable in the months view (if the month is January, so will its year in the years view).
>
> When a function is set, this option will not be reset by changing [`pickLevel`](#pickLevel) dynamically.  
> The need of changing together with `pickLevel` is only applied when an array is used, but not when a function is used.

#### daysOfWeekDisabled
- Type: `Number[]`
- Default: `[]`

Days of the week to disable. `0`:_Sunday_ – `6`:_Saturday_, up to 6 items.

> ignored when [`pickLevel`](#pickLevel) is not `0`:_date_

#### daysOfWeekHighlighted
- Type: `Number[]`
- Default: `[]`

Days of the week to highlight. `0`:_Sunday_ – `6`:_Saturday_, up to 6 items.

#### defaultViewDate
- Type: `String`|`Date`|`Number`
- Default: current date

The date to be focused when the date picker opens with no selected date(s).

#### <span class="muted">disableTouchKeyboard (deprecated)</span>
This option will be removed. Use the attribute: `inputmode="none"` on the `<input>` element instead.

<div class="muted">

- Type: `Boolean`
- Default: `false`

Whether to prevent on-screen keyboard on mobile devices from showing up when the associated input field receives focus.

> Not available on inline picker.
</div>

#### enableOnReadonly
- Type: `Boolean`
- Default: `true`

Whether to show the date picker when the associated input filed has the `readonly` attribute.

#### format
- Type: `String`|`Object`
- Default: `'mm/dd/yyyy'`

[Date format](date-string+format?id=date-format) string.

> The format string must not include the [dateDelimiter](options?id=datedelimiter) string.
>
> This option is used to override the one set in the locale specified by [`language`](#language)

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

> Given date is processed to match the [`pickLevel`](#pickLevel) at the time.  
> If [`pickLevel`](#pickLevel) is changed dynamically to higher level independently, this option will be adjusted automatically to the last day of the month or December 31st of the year.  
> This option should be changed together when changing [`pickLevel`](#pickLevel) to lower level dynamically.

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

> Given date is processed to match the [`pickLevel`](#pickLevel) at the time.  
> If [`pickLevel`](#pickLevel) is changed dynamically to higher level independently, this option will be adjusted automatically to the 1st of the month or January 1st of the year.  
> This option should be changed together when changing [`pickLevel`](#pickLevel) to lower level dynamically.

#### nextArrow
- Type: `String`
- Default: `'»'`

HTML (or plain text) for the button label of the "Next" button.

> See the note in [i18n ≻ Text Direction](i18n?id=text-direction) when using with RTL languages.

#### orientation
- Type: `String`
- Default: `'auto'`

Space-separated string for date picker's horizontal and vertical placement to the associated input field. `left`|`right`|`auto` for horizontal and `top`|`bottom`|`auto` for vertical.

> The default picker placement of `auto` is the start of the input field's text direction for horizontal and bottom for vertical.  
>   
> The order can be random.  
> If one direction is omitted, it falls back to `auto`. (e.g. `'top'` == `'top auto'`)  
> Not available on inline picker.

#### pickLevel
- Type: `Number`
- Default: `0`

The level that the date picker allows to pick. `0`:_date_,`1`: _month_ &nbsp;or `2`:_year_.

> When this option is `1`, the selected date becomes the 1st of the month or, if the date picker is the end-date picker of a date range picker, the last day of the month.  
> When this option is `2`, the selected date becomes January 1st of the year or, if the date picker is the end-date picker of a date range picker, December 31st of the year.
>
> Changing this option dynamically affects existing [`datesDisabled`](#datesDisabled) (except when a function is set), [`maxDate`](#maxdate) and [`minDate`](#minDate). This option should be updated together with those options when they are customized.

#### prevArrow
- Type: `String`
- Default: `'«'`

HTML (or plain text) for the button label of the "Prev" button.

> See the note in [i18n ≻ Text Direction](i18n?id=text-direction) when using with RTL languages.

#### shortcutKeys
- Type: `Objrct`
- Default: <span><code>{
    show: {key: 'ArrowDown'},
    hide: null,
    toggle: {key: 'Escape'},
    prevButton: {key: 'ArrowLeft', ctrlOrMetaKey: true},
    nextButton: {key: 'ArrowRight', ctrlOrMetaKey: true},
    viewSwitch: {key: 'ArrowUp', ctrlOrMetaKey: true},
    clearButton: {key: 'Backspace', ctrlOrMetaKey: true},
    todayButton: {key: '.', ctrlOrMetaKey: true},
    exitEditMode: {key: 'ArrowDown', ctrlOrMetaKey: true},
  }</code></span>

Object to assign or unset shortcut keys, where the keys of the object are the name of actions to assign/unset shortcut key, and each value is either an object to define the key combination of the shortcut key (key definition object) or, when unsetting the default shortcut, a falsy value except `undefined`.

> <kbd>Enter</kbd> and <kbd>Tab</kbd> keys cannot be used as shortcut key.
>
> Keys assigned to the actions function as shortcut key only under the condition the action takes effect. (e.g. show → only when the picker is hidden, clearButton → only when [`clearButton`](#clearButton) is `true`) 
>
> For constructor only. Cannot be used with setOptions().
 
- **Actions**  
  Available actions:
  Name | Default shortcut key | Description
  ---|---|---
  `show` | <kbd>↓</kbd> _(ArrowDown)_ | Show the picker 
  `hide` | N/A | Hide the picker 
  `toggle` | <kbd>Esc</kbd> _(Escape)_ | Toggle the deisplay of the picker 
  `prevButton` | <kbd>Ctrl</kbd>/<kbd>Meta</kbd> + <kbd>←</kbd> _(ArrowLeft)_ | Perform the Prev button action 
  `nextButton` | <kbd>Ctrl</kbd>/<kbd>Meta</kbd> + <kbd>→</kbd> _(ArrowRight)_ | Perform the Next button action 
  `viewSwitch` | <kbd>Ctrl</kbd>/<kbd>Meta</kbd> + <kbd>↑</kbd> _(ArrowUp)_ | Perform the View switch action 
  `clearButton` | <kbd>Ctrl</kbd>/<kbd>Meta</kbd> + <kbd>Backspace</kbd> | Perform the Clear button action 
  `todayButton` | <kbd>Ctrl</kbd>/<kbd>Meta</kbd> + <kbd>.</kbd> | Perform the Today button action 
  `exitEditMode` | <kbd>Ctrl</kbd>/<kbd>Meta</kbd> + <kbd>↓</kbd> _(ArrowDown)_ | Exit edit mode 
  - Unknown actions and the actions whose value is `undefined` are ignored.
  - Actions not to change the default shortcut key can be omitted.

- **key definition object**  
  The object's keys and values are basically the properties/values to match against the [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) object of `keydown` event.
  Key (property) | Type | Description
  ---|---|---
  `key` | `String` | What the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) propery's value is<br>&bull; Required
  `ctrlOrMetaKey`  | `Boolean` | Whether the `ctrlKey` or `metaKey` property is `true`<br>&bull; Default: `false`
  `ctrlKey` | | Alias of `ctrlOrMetaKey`
  `metaKey` | | Alias of `ctrlOrMetaKey`
  `altKey` | `Boolean` | Whether the `altKey` property is `true`<br>&bull; Default: `false`<br>&bull; Ignored when `key` is a printable character
  `shiftKey` | `Boolean` | Whether the `shiftKey` property is `true`<br>&bull; Default: `false`<br>&bull; Ignored when `key` is a printable character
  - [See a full list of key values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) for available values for  `key`.
  - For simplicity, <kbd>Ctrl</kbd> and <kbd>Meta</kbd> keys are not distinguished.
  - When omitted, `ctrlOrMetaKey`, `altKey`, and `shiftKey` are complemented with `false` and  treated as a criterion for "not pressed".  
    e.g.
    - `{key: 'Enter'}` does not match any modifier key + <kbd>Enter</kbd>
    - `{key: 'Enter', altKey: true}` does not match <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd>, <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Enter</kbd>
  - If a printable character is set to `key`, `altKey` and `shiftKey` are not evaluated because when `KeyboardEvent.key` is a printable character, the key(s) the user pressed can differ depending on keyboard layout and the state of the <kbd>Shift</kbd> and <kbd>Alt</kbd> keys is reflected in `key`'s value.<br>
    e.g.<br>
    When a `keydown` event with `key: '#'` is triggered, the event's `altKey` and `shiftKey` properties are...
    keyboard layout | key(s) pressed | event's properties
    ---|---|---
    US keyboard | <kbd>Shift</kbd> + <kbd>3</kbd> | `altKey: false`, `shftKey: true`
    German keyboard | <kbd>#</kbd> | `altKey: false`, `shftKey: false`
    UK Apple keyboard (on Mac) | <kbd>Option</kbd> + <kbd>3</kbd> | `altKey: true`, `shftKey: false`

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

#### <span class="muted">todayBtn (deprecated)</span>
Synonym of `todayButton` – this option will be removed.

#### <span class="muted">todayBtnMode (deprecated)</span>
Synonym of `todayButtonMode` – this option will be removed.

#### todayButton
- Type: `Boolean`
- Default: `false`

Whether to show the today button.

#### todayButtonMode
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

#### weekNumbers
- Type: `Number`|`Function`
- Default: `0`

Week numbers to display

<table>
  <tr>
    <th>Option</th>
    <th>Week numbers to display</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>0</code></td>
    <td>None</td>
    <td></td>
  </tr>
  <tr>
    <td><code>1</code></td>
    <td>ISO 8601</td>
    <td>First day of week is Monday<br>
      First week of year is the week that contains the 4th of January</td>
  </tr>
  <tr>
    <td><code>2</code></td>
    <td>Western traditional</td>
    <td>First day of week is Sunday<br>
      First week of year is the week that contains the 1st of January</td>
  </tr>
  <tr>
    <td><code>3</code></td>
    <td>Middle Eastern</td>
    <td>First day of week is Saturday<br>
      First week of year is the week that contains the 1st of January</td>
  </tr>
  <tr>
    <td><code>4</code></td>
    <td>Guess from <code>weekStart</code></td>
    <td>
      If the start of the week determined by the chosen <a href="#/options?id=language"><code>language</code></a>'s locale or the <a href="#/options?id=weekStart"><code>weekStart</code></a> option is:<br>
      &bull; <code>0</code>:<em>Sunday</em>, Western traditional week numbers are shown<br>
      &bull; <code>6</code>:<em>Saturday</em>, Middle Eastern week numbers are shown<br>
      Otherwise, ISO 8601 week numbers are shown
    </td>
  </tr>
  <tr>
    <td>function</td>
    <td>User-defined week numbers</td>
    <td>
      Week numbers calculated by the given function are shown
      <ul>
        <li>Function
          <ul>
            <li>Arguments
              <ul>
                <li><code>date</code> : [<code>Date</code>] - Date to calcurate the week number</li>
                <li><code>weekStart</code> ; [<code>Number</code>] - The first day of the week<br>
                  <em>(see <a href="#/options?id=weekStart"><code>weekStart</code></a>)</em></li>
              </ul>
            </li>
            <li>Retuen
              <ul>
                <li>[<code>Number</code>] - The week number of the date</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <pre data-lang="javascript" style="margin-bottom: 0;"><code class="lang-javascript"><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">date</span>, <span class="token parameter">weekStart</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> weekNumber<span class="token punctuation">;</span>
    <span class="token comment">//...your calculation algorithm</span>
    <span class="token keyword">return</span> weekNumber<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>
    </td>
  </tr>
</table>

> Date picker displays the week number of the leftmost (if the direction is RTL, rightmost) date of each week. To prevent confusing week numbers from being shown, be sure to use the week numbering system whose first day of the week matches the start day of the week determined by the chosen [`language`](#language)'s locale or the [`weekStart`](#weekStart) option.
>
> See [https://en.wikipedia.org/wiki/Week#Numbering](https://en.wikipedia.org/wiki/Week#Numbering) for more about week numbering systems.


#### weekStart
- Type: `Number`
- Default: `0`

Start day of the week. `0`:_Sunday_ – `6`:_Saturday_.

> This option is used to override the one set in the locale specified by [`language`](#language)


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
