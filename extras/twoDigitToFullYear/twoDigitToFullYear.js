/**
 * Convert 2-digit year to 4-digit year
 * By default, 2-digit year will be converted to a year in the 100-year
 * period ending 50 years after the current year. The target 100-year period
 * can be changed by specifying base date and the length of the future side.
 * @param  {Number} year - 2-digit year
 * @param  {Number} [futureSideSpan] - number of yeas in the future side of
 * the target 100-year period. Default: 50
 * @param  {Date} [baseDate] - base date to caliculate the target 100-year
 * period. if omitted, the current date is used.
 * @return {Number} 4-digit year
 */
export function twoDigitToFullYear(year, futureSideSpan = 50, baseDate = undefined) {
  if (isNaN(year) || year > 99 || year < 0) {
    return year;
  }

  const date = baseDate instanceof Date && !isNaN(baseDate) ? baseDate : new Date();
  const currentYear = date.getFullYear();
  const endOfCurrent = currentYear + futureSideSpan;
  let century = Math.floor(endOfCurrent / 100) * 100;
  if (year > endOfCurrent % 100) {
    century -= 100;
  }
  return year + century;
}
