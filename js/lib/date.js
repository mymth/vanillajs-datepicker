export function stripTime(timeValue) {
  return new Date(timeValue).setHours(0, 0, 0, 0);
}

export function today() {
  return new Date().setHours(0, 0, 0, 0);
}

// Get the time value of the start of given date or year, month and day
export function dateValue(...args) {
  switch (args.length) {
    case 0:
      return today();
    case 1:
      return stripTime(args[0]);
  }

  // use setFullYear() to keep 2-digit year from being mapped to 1900-1999
  const newDate = new Date(0);
  newDate.setFullYear(...args);
  return newDate.setHours(0, 0, 0, 0);
}

export function addDays(date, amount) {
  const newDate = new Date(date);
  return newDate.setDate(newDate.getDate() + amount);
}

export function addWeeks(date, amount) {
  return addDays(date, amount * 7);
}

export function addMonths(date, amount) {
  // If the day of the date is not in the new month, the last day of the new
  // month will be returned. e.g. Jan 31 + 1 month → Feb 28 (not Mar 03)
  const newDate = new Date(date);
  const monthsToSet = newDate.getMonth() + amount;
  let expectedMonth = monthsToSet % 12;
  if (expectedMonth < 0) {
    expectedMonth += 12;
  }

  const time = newDate.setMonth(monthsToSet);
  return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
}

export function addYears(date, amount) {
  // If the date is Feb 29 and the new year is not a leap year, Feb 28 of the
  // new year will be returned.
  const newDate = new Date(date);
  const expectedMonth = newDate.getMonth();
  const time = newDate.setFullYear(newDate.getFullYear() + amount);
  return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
}

// Calculate the distance bettwen 2 days of the week
function dayDiff(day, from) {
  return (day - from + 7) % 7;
}

// Get the date of the specified day of the week of given base date
export function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
  const baseDay = new Date(baseDate).getDay();
  return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
}

function calcWeekNum(dayOfTheWeek, sameDayOfFirstWeek) {
  return Math.round((dayOfTheWeek - sameDayOfFirstWeek) / 604800000) + 1;
}

// Get the ISO week number of a date
export function getIsoWeek(date) {
  // - Start of ISO week is Monday
  // - Use Thursday for culculation because the first Thursday of ISO week is
  //   always in January
  const thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
  // - Week 1 in ISO week is the week including Jan 04
  // - Use the Thu of given date's week (instead of given date itself) to
  //   calculate week 1 of the year so that Jan 01 - 03 won't be miscalculated
  //   as week 0 when Jan 04 is Mon - Wed
  const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
  // return Math.round((thuOfTheWeek - firstThu) / 604800000) + 1;
  return calcWeekNum(thuOfTheWeek, firstThu);
}

// Calculate week number in traditional week number system
// @see https://en.wikipedia.org/wiki/Week#Other_week_numbering_systems
function calcTraditionalWeekNumber(date, weekStart) {
  // - Week 1 of traditional week is the week including the Jan 01
  // - Use Jan 01 of given date's year to calculate the start of week 1
  const startOfFirstWeek = dayOfTheWeekOf(new Date(date).setMonth(0, 1), weekStart, weekStart);
  const startOfTheWeek = dayOfTheWeekOf(date, weekStart, weekStart);
  const weekNum = calcWeekNum(startOfTheWeek, startOfFirstWeek);
  if (weekNum < 53) {
    return weekNum;
  }
  // If the 53rd week includes Jan 01, it's actually next year's week 1
  const weekOneOfNextYear = dayOfTheWeekOf(new Date(date).setDate(32), weekStart, weekStart);
  return startOfTheWeek === weekOneOfNextYear ? 1 : weekNum;
}

// Get the Western traditional week number of a date
export function getWesternTradWeek(date) {
  // Start of Western traditionl week is Sunday
  return calcTraditionalWeekNumber(date, 0);
}

// Get the Middle Eastern week number of a date
export function getMidEasternWeek(date) {
  // Start of Middle Eastern week is Saturday
  return calcTraditionalWeekNumber(date, 6);
}

// Get the start year of the period of years that includes given date
// years: length of the year period
export function startOfYearPeriod(date, years) {
  /* @see https://en.wikipedia.org/wiki/Year_zero#ISO_8601 */
  const year = new Date(date).getFullYear();
  return Math.floor(year / years) * years;
}

// Convert date to the first/last date of the month/year of the date
export function regularizeDate(date, timeSpan, useLastDate) {
  if (timeSpan !== 1 && timeSpan !== 2) {
    return date;
  }
  const newDate = new Date(date);
  if (timeSpan === 1) {
    useLastDate
      ? newDate.setMonth(newDate.getMonth() + 1, 0)
      : newDate.setDate(1);
  } else {
    useLastDate
      ? newDate.setFullYear(newDate.getFullYear() + 1, 0, 0)
      : newDate.setMonth(0, 1);
  }
  return newDate.setHours(0, 0, 0, 0);
}
