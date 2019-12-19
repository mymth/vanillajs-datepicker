# Date String & Format

## Date format

Date format must be declared using the combination of the predefined tokens and separators.

**– Tokens:**

Token | Description | Example
--|--|--
`d` | day of the month without leading zero | 1, 2, ..., 31
`dd` |  day of the month with leading zero | 01, 02, ..., 31
`D` | shortened day name of the week | Sum, Mon, ..., Sat
`DD` | full day name of the week | Sunday, Monday, ..., Saturday
`m` | numeric month without leading zero | 1, 2, ..., 12
`mm` | numeric month with leading zero | 01, 02, ..., 12
`M` | shortened month name | Jan, Feb, ..., Dec
`MM` | full month name | January, February, ..., December
`y` | year without leading zero | 1, 645, 1900, 2020
`yy` | 2-digit year with leading zero | 01, 45, 00, 20
`yyyy` | 4-digit year with leading zero | 0001, 0645, 1900, 2020

**– Separators:**

All printable ASCII characters other than numbers and alphabets, `年`, `月` and `日`

**Notes**

- Since the built-in parser extracts the parts of the date by splitting the string with the separators, formats without separators (e.g. `yyyymmdd`) are not supported.
- 2-digit year (`yy`) is only supported by the built-in formatter; the built-in parser doesn't.

> You can write your custom parser/formatter to handle arbitrary format including the above. See [`format` config option](options?id=format) for the details.

- Date format must not include the string set in the [`dateDelimiter`](options?id=datedelimiter) config option.

## Date string

Date strings are expected to be formatted in the date format set in the [`format`](options?id=format) config option (default: `mm/dd/yyyy`), but it isn't necessary to match the format strictly.

##### How Built-in Parser parses

The built-in parser uses the format string only to determine the sequence in which the date parts (year/month/day/day-of-the-week) and separators appear in the date string. The differences in separator characters, whether to have leading zeros and whether month name (full or short) or month number is used are ignored. Therefore, as long as the parts of a date string appear in the same order as the format's, the variations of the same date's date string are equally parsed to the same date. 

There are some cases the parser treats the parts in specific way:
- year is treated as full year _(1-/2-digit years are not mapped to nearby century's)_
- month number not between 1 and 12 is treated in the similar way to [`Date.prototype.setMonth()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth)
- month name is evaluated in case-insensitive begin-with match
- day not between 1 and last-day-of-the-month is treated in the same way as [`Date.prototype.setDate()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate)
- day-of-the-week is not evaluated _(not totally ignored, the existance is respected)_
- if a part is omitted from the format, missing in the date string or parsed unsuccessfully, current date's value is used to compplement.

Here are some examples of how irregular date strings are parsed.

- Differnet separators from the format:  
  - if format is `yyyy-mm-dd`, `2020/04/22` ⟹ _April 22nd, 2020_
  - if format is `m.d.y`, `1/15 (2018)` ⟹ _January 15th, 2018_
- With/without leading zeros:  
  - if format is `d/m/y`, `05/06/07` ⟹ _June 5th, 0007_
  - if format is `yyyy-mm-dd`, `20-5-4` ⟹ _May 4th, 0020_
- Number for the month name:  
  - if format is `M-d-y`, `7-14-2020` ⟹ _July 14th, 2020_
- Incomplete month name/full name for short name:  
  - if format is `M-d-y`,
    - `ap-22-2020` ⟹ _April 22nd, 2020_
    - `sept-22-2020` ⟹ _September 22nd, 2020_
    - `Ju-4-2020` ⟹ _June 4th, 2020_
    - `July-4-2020` ⟹ _July 4th, 2020_
- Month/day outside the normal range:  
  - if format is `mm/dd/yyyy`,
    - `14/31/2019` ⟹ _March 2nd, 2020_
    - `0/0/2020` ⟹ _November 30th, 2019_
- Omitted/missing/invalid parts:  
  - if format is `mm/yyyy` and current date is _January 15th, 2020_,
    - `04/2022` ⟹ _April 15th, 2022_
  - if format is `m/d/y` and current date is _January 15th, 2020_,
    - `4/22` ⟹ _April 22nd, 2020_
    - `/22/2016` ⟹ _January 22nd, 2016_
    - `7/xx/2016` ⟹ _July 15th, 2016_
- Day-of-the-week:
  - if format is `D m/d y` and current date is _January 15th, 2020_,
    - `xx 5/4 2022` ⟹ _May 4th, 2022_
    - `5/4 2022` ⟹ _October 13th, 2025 (= April 2022nd, 2020)_

##### 'Today' shortcut

You can use `'today'` as a shortcut to the current date.

##### Multiple dates

You can combine multiple dates into a single date string by joining the dates with the delimiter set in the [dateDelimiter](options?id=datedelimiter) config option.
