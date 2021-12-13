---
sidebar_position: 1
---
# Intro
`iso-fns` is the only **multi-domain**, **immutable**, **functional** DateTime package for JavaScript. Its goal is to help you write **bug free** date/time logic without all the hassle. Inspired by [date-fns](https://date-fns.org), [js-joda](https://js-joda.github.io/js-joda/), and the [Temporal Proposal for EcmaScript](https://tc39.es/proposal-temporal/docs/), `iso-fns` seeks to be simple, feature-rich, and performant.

### Multi-domain
Dates and times are complicated. JavaScript's native `Date` object, while simple, does not have the functionality required by many modern web apps and so it is often painful to use. Because of this pain, there is now a popular Temporal Proposal which addresses many of the limitations of the `Date` object. `iso-fns` mirrors and builds upon the design of the Temporal Proposal. This means that `iso-fns` has **eight** date/time types.

1. **Instant:** a fixed point in time without regard to calendar or location, e.g. July 20, 1969, at 20:17 UTC.
2. **ZonedDateTime:** a timezone-aware date/time that represents a real event that has happened (or will happen) at a particular exact time from the perspective of a particular region on Earth, e.g. December 7th, 1995 at 3:24 AM in US Pacific time.
3. **DateTime:** represents a calendar date and wall-clock time that does not carry time zone information, e.g. December 7th, 1995 at 3:00 PM. 
4. **Date**: represents a calendar date that is not associated with a particular time or time zone, e.g. August 24th, 2006.
5. **Time:** represents a wall-clock time that is not associated with a particular date or time zone, e.g. 7:39 PM.
6. **YearMonth:** A date without a day component. This is useful to express things like "the October 2020 meeting".
7. **MonthDay**: A date without a year component. This is useful to express things like "Bastille Day is on the 14th of July".
8. **Duration:** expresses a length of time, e.g. 5 minutes and 30 seconds. This is used for date/time arithmetic and for measuring differences between two dates/times.

### Immutable

`iso-fns` is string based. This means that the data type for Instant, ZonedDateTime, Date, etc. is just a string, so naturally iso-types are immutable. Strings are portable, easy to inspect, easy to cache, and representable in JSON. Using strings also ensures compatibility with the Temporal Proposal when it becomes an approved part of EcmaScript.


### Functional

Each operation in `iso-fns` is a function which inputs an iso8601 formatted string. This is similar to the model adopted by `date-fns`. Lets take a look at an example.
```js
dateFns.subtract('2000-01-15', {days: 20}) // '1999-12-26'
```

Here, `dateFns` is a bag of functions used to operate on iso dates. We input a date (an ISO8601 formatted string) and what we want to subtract (20 days), and we receive `'1999-12-26'`. Another ISO8601 formatted string.


Below are several more examples of functions offered by `iso-fns`. 

```js
const instant1 = instantFns.fromEpochMilliseconds(0) // '1970-01-01T00:00:00.000Z'
const instant2 = instantFns.subtract(instant1, {hours: 3, minutes: 30}) // '1969-12-31T20:30:00.000Z'

const zDateTime1 = instantFns.toZonedDateTime(instant2, 'America/Chicago') // '1969-12-31T14:30:00.000-06:00[America/Chicago]'
const zDateTime2 = zonedDateTimeFns.withDate(zDateTime1, '2021-06-15') // '2021-06-15T14:30:00.000-05:00[America/Chicago]'
const zDateTime3 = zonedDateTimeFns.startOfDay(zDateTime2) // '2021-06-15T00:00:00.000-05:00[America/Chicago]'

const time1 = zonedDateTimeFns.toTime(zDateTime3) // '00:00:00.000'
const time2 = timeFns.add(time1, {hours: 6, minutes: 39, seconds: 30}) // '06:39:30.000'
const time3 = timeFns.round(time2, {smallestUnit: 'minute', roundingIncrement: 15}) // '06:45:00.000'

const dateTime1 = timeFns.toDateTime(time3, '2000-01-01') // '2000-01-01T06:45:00.000'
const dateTime2 = dateTimeFns.with(dateTime1, { year: 2010 }) // '2010-01-01T06:45:00.000'
const dateTime3 = dateTimeFns.withTime(dateTime2, '12:30:00.000') // '2010-01-01T12:30:00.000'

const monthDay1 = dateTimeFns.toMonthDay(dateTime3) // '--01-01' 
const monthDay2 = monthDayFns.with(monthDay1, {month: 8 }) // '--08-01'

const date1 = monthDayFns.toDate(monthDay2, 2010) // '2010-08-01'
const date2 = dateFns.with(date1, { month: 12 }) // '2010-12-01'
const date3 = dateFns.subtract(date2, {days: 20}) // '2010-11-11'

const yearMonth1 = dateFns.toYearMonth(date3) // '2010-11'
const yearMonth2 = yearMonthFns.add(yearMonth1, {years: 4}) // '2014-11'

const duration1 = yearMonthFns.until(yearMonth2, '2018-06') // 'P3Y7M'
const duration2 = durationFns.round(duration1, { relativeTo: '2014-11-01', largestUnit: 'days' }) // 'P1308D'
const totalDays = durationFns.getDays(duration2) // 1308
```


For method chaining, `iso-fns` using a similar strategy as [Lodash](https://lodash.com). Here is the above example, using chaining. 

```js
const instant = instantFns.fromEpochMilliseconds(0) // '1970-01-01T00:00:00.000Z'
const zonedDateTime = instantFns.chain(instant)
  .subtract({ hours: 3, minutes: 30 })
  .toZonedDateTime('America/Chicago')
  .value()
) // '1969-12-31T14:30:00.000-06:00[America/Chicago]'

const time = zonedDateTimeFns.chain(zonedDateTime)
  .withDate('2021-06-15')
  .startOfDay()
  .toTime()
  .value()
) // '00:00:00.000'

const dateTime = timeFns.chain(time)
  .add({ hours: 6, minutes: 39, seconds: 30 })
  .round({ smallestUnit: 'minute', roundingIncrement: 15 })
  .toDateTime('2000-01-01')
  .value()
) // '2000-01-01T06:45:00.000'

const monthDay = dateTimeFns.chain(dateTime)
  .with({ year: 2010 })
  .withTime('12:30:00.000')
  .toMonthDay()
  .value()
) // '--01-01' 

const date = monthDayFns.chain(monthDay)
  .with({month: 8 })
  .toDate(2010)
  .value()
) // '2010-08-01'

const yearMonth = dateFns.chain(date)
  .with({ month: 12 })
  .subtract({ days: 20 })
  .toYearMonth()
  .value()
) // '2010-11'

const duration = yearMonthFns.chain(yearMonth)
  .add({ years: 4 })
  .until('2018-06')
  .value()
) // 'P3Y7M'

const totalDays = durationFns.chain(duration)
  .round({ relativeTo: '2014-11-01', largestUnit: 'days' })
  .getDays()
  .value()
) // 1308
```

