---
sidebar_position: 10
---

# Time Zones and Resolving Ambiguity

## Understanding Clock Time vs. Exact Time

The core concept in iso-fns is the distinction between **wall-clock time** (also called "local time" or "clock time") which depends on the time zone of the clock and **exact time** (also called "UTC time") which is the same everywhere.

Wall-clock time is controlled by local governmental authorities, so it can abruptly change. When Daylight Saving Time (DST) starts or if a country moves to another time zone, then local clocks will instantly change. Exact time however has a consistent global definition and is represented by a special time zone called [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (from Wikipedia):

> **Coordinated Universal Time (or UTC)** is the primary time standard by which the world regulates clocks and time. It is within about 1 second of mean solar time at 0° longitude, and is not adjusted for daylight saving time. It is effectively a successor to Greenwich Mean Time (GMT).

Every wall-clock time is defined using a **UTC Offset**: the amount of exact time that a particular clock is set ahead or behind UTC. For example, on January 19, 2020 in California, the UTC Offset (or "offset" for short) was -08:00 which means that wall-clock time in San Francisco was 8 hours behind UTC, so 10:00AM locally on that day was 18:00 UTC. However the same calendar date and wall-clock time India would have an offset of +05:30: 5½ hours later than UTC.

[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and [RFC 3339](https://tools.ietf.org/html/rfc3339) define standard representations for exact times as a date and time value, e.g. `2020-09-06T17:35:24.485Z`. The `Z` suffix indicates that this is an exact UTC time.

iso-fns has two types that represent exact time: `Iso.Instant` (which only represents exact time and no other information) and `Iso.ZonedDateTime` which represents exact time and a time zone.

Another way to represent exact time is using a single number representing the amount of time after or before [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) (midnight UTC on January 1, 1970). For example, `Iso.Instant` (an exact-time type) can be constructed using only a number value of milliseconds since epoch.

## Understanding Time Zones, Offset Changes, and DST

A **Time Zone** defines the rules that control how local wall-clock time relates to UTC. You can think of a time zone as a function that accepts an exact time and returns a UTC offset, and a corresponding function for conversions in the opposite direction. (See [below](timezones-and-ambiguity#ambiguity-due-to-dst-or-other-time-zone-offset-changes) for why exact → local conversions are 1:1, but local → exact conversions can be ambiguous.)

iso-fns uses the **IANA Time Zone Database** (or "TZ database"), which you can think of as a global repository of time zone functions. Each IANA time zone has:
- A **time zone ID** that usually refers to a geographic area anchored by a city (e.g. `Europe/Paris` or `Africa/Kampala`) but can also denote single-offset time zones like `UTC` (a consistent `+00:00` offset) or `Etc/GMT+5` (which for historical reasons is a negative offset `-05:00`).
- A **time zone definition** defines the offset for any UTC value since January 1, 1970. You can think of these definitions as a table that maps UTC date/time ranges (including future ranges) to specific offsets. In some time zones, temporary offset changes happen twice each year due to **Daylight Saving Time (DST)** starting in the Spring and ending each Fall. Offsets can also change permanently due to political changes, e.g. a country switching time zones.

The TZ database is updated several times per year in response to political changes around the world. Each update contains changes to time zone definitions. These changes usually affect only future date/time values, but occasionally fixes are made to past ranges too, for example when new historical sources are discovered about early-20th century timekeeping.

## Wall-Clock Time, Exact Time, and Time Zones in iso-fns

In iso-fns:
- The `Iso.Instant` type represents exact time only.
- The `Iso.DateTime` type represents calendar date and wall-clock time, as do other narrower types: `Iso.Date`, `Iso.Time`, `Iso.YearMonth`, and `Iso.MonthDay`. These types are all using the ISO 8601 calendar. 
- The `Iso.TimeZone` is a time zone ID. For each IANA time zone ID, iso-fns can convert an exact time into a wall-clock time and vice-versa. It also includes helper functions, e.g. to fetch the current time zone offset for a particular exact time.
- The `Iso.ZonedDateTime` type encapsulates all of the types above: an exact time (like a `Iso.Instant`), its wall-clock equivalent (like a `Iso.DateTime`), and the time zone that links the two (like a `Iso.TimeZone`).

There are two ways to get a human-readable calendar date and clock time from an` Iso` type that stores exact time.
- If the exact time is already represented by a `Iso.ZonedDateTime` instance then the wall-clock time values are trivially available either by inspection (the wall-clock time values are in the type) or by using the functions for that type, e.g. `getYear()`, `getHour()`, or `.format()`.
- However, if the exact time is represented by a `Iso.Instant`, use a time zone to create a `Iso.ZonedDateTime`. Example:
```js
instant = '2019-09-03T08:34:05Z'
formatOptions = {
  era: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

zdt = instantFns.toZonedDateTime(instant, 'Asia/Tokyo');
  // => 2019-09-03T17:34:05.000+09:00[Asia/Tokyo]
```

Conversions from calendar date and/or wall clock time to exact time are also supported:
```js
// Convert various local time types to an exact time type by providing a time zone
date = '2019-12-17'
// If time is omitted, local time defaults to start of day
zdt = dateFns.toZonedDateTime(date, 'Asia/Tokyo');
  // => 2019-12-17T00:00:00.000+09:00[Asia/Tokyo]
zdt = dateFns.toZonedDateTime(date, { timeZone: 'Asia/Tokyo', time: '10:00' });
  // => 2019-12-17T10:00:00.000+09:00[Asia/Tokyo]
time = '14:35:00.000'
zdt = timeFns.toZonedDateTime(time, { timeZone: 'Asia/Tokyo', date: '2020-08-27' });
  // => 2020-08-27T14:35:00.000+09:00[Asia/Tokyo]
dateTime = '2019-12-17T07:48:00.000'
zdt = dateTimeFns.toZonedDateTime(dateTime, 'Asia/Tokyo');
  // => 2019-12-17T07:48:00.000+09:00[Asia/Tokyo]

// Get the exact time in seconds or milliseconds since the UNIX epoch.
inst = zonedDateTimeFns.toInstant(zdt);
epochMilli = instantFns.getEpochMilliseconds(inst); // => 1576536480000
epochSecs = instantFns.getEpochSeconds(inst); // => 1576536480
```

## Ambiguity Due to DST or Other Time Zone Offset Changes
Usually, a time zone definition provides a bidirectional 1:1 mapping between any particular local date and clock time and its corresponding UTC date and time. However, near a time zone offset transition there can be time ambiguity where it's not clear what offset should be used to convert a wall-clock time into an exact time. This ambiguity leads to two possible clock times for one UTC time.
- When offsets change in a backward direction, the same clock time will be repeated. For example, 1:30AM happened twice on Sunday, 4 November 2018 in California. The "first" 1:30AM on that date was in Pacific Daylight Time (offset `-07:00`). 30 exact minutes later, DST ended and Pacific Standard Time (offset `-08:00`) became active. After 30 more exact minutes, the "second" 1:30AM happened. This means that "1:30AM on Sunday, 4 November 2018" is not sufficient to know which 1:30AM it is. The clock time is ambiguous.
- When offsets change in a forward direction, local clock times are skipped. For example, DST started on Sunday, 11 March 2018 in California. When the clock advanced from 1:59AM to 2:00AM, local time immediately skipped to 3:00AM. 2:30AM didn't happen! To avoid errors in this one-hour-per year case, most computing environments (including ECMAScript) will convert skipped clock times to exact times using either the offset before the transition or the offset after the transition.
In both cases, resolving the ambiguity when converting the local time into exact time requires choosing which of two possible offsets to use, or deciding to throw an exception.

## Resolving Time Ambiguity in iso-fns
In iso-fns, if the exact time or time zone offset is known, then there is no ambiguity possible. For example:

```js
// No ambiguity possible because source is exact time in UTC
inst = instantFns.from('2020-09-06T17:35:24.485Z');
  // => 2020-09-06T17:35:24.485Z
// An offset can make a local time "exact" with no ambiguity possible.
inst = instantFns.from('2020-09-06T10:35:24.485-07:00');
  // => 2020-09-06T17:35:24.485Z
zdt = zonedDateTimeFns.from('2020-09-06T10:35:24.485-07:00[America/Los_Angeles]');
  // => 2020-09-06T10:35:24.485-07:00[America/Los_Angeles]
// if the source is an exact Temporal object, then no ambiguity is possible.
zdt = instantFns.toZonedDateTime(inst, 'America/Los_Angeles');
  // => 2020-09-06T10:35:24.485-07:00[America/Los_Angeles]
inst2 = zonedDateTimeFns.toInstant(zdt);
  // => 2020-09-06T17:35:24.485Z
```
However, opportunities for ambiguity are present when creating an exact-time type (`Iso.ZonedDateTime` or `Iso.Instant`) from a non-exact source. For example:

TODO