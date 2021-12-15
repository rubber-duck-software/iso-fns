export module Iso {
  type Offset = `${'+' | '-'}${number}:${number}`

  type DateFormat = `${number}-${number}-${number}`
  type TimeFormat = `${number}:${number}` | `${number}:${number}:${number}` | `${number}:${number}:${number}.${number}`
  type InstantFormat = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
  type DateTimeFormat = `${DateFormat}T${TimeFormat}`
  type ZonedDateTimeFormat = `${DateFormat}T${TimeFormat}${Offset}[${string}]`

  type YearMonthFormat = `${number}-${number}`
  type MonthDayFormat = `--${number}-${number}`

  type DurationFormat = `${'' | '-'}P${string}`

  interface Format {
    'YYYY-MM-DD': DateFormat
    'hh:mm:ss.sss': TimeFormat
    'YYYY-MM-DDThh:mm-ss.sssZ': InstantFormat
    'YYYY-MM-DDThh:mm-ss.sss': DateTimeFormat
    'YYYY-MM-DDThh:mm-ss.sss+00:00[TimeZoneName]': ZonedDateTimeFormat
    'YYYY-MM': YearMonthFormat
    '--MM-DD': MonthDayFormat
    'P(n)Y(n)M(n)DT(n)H(n)M(n)S': DurationFormat
  }

  /**
   * An `Iso.Instant` is a single point in time (called "exact time"), with a precision in milliseconds. No time zone is present. As such `Iso.Instant` has no concept of days, months or even hours.
   *
   * For convenience of interoperability, instants are represented as an ISO8601 string in Zulu time (UTC). The format looks like `1970-01-01T00:00:00.000Z`.
   *
   * If you have a legacy Date instance, you can use its toISOString() method to convert to an `Iso.Instant`.
   *
   * Since `Iso.Instant` doesn't contain any information about time zones, a `Iso.TimeZone` is needed in order to convert it into a `Iso.DateTime` (and from there into any of the other `Iso` types.)
   *
   * Like Unix time, Instant ignores leap seconds.
   */
  export type Instant = Format['YYYY-MM-DDThh:mm-ss.sssZ'] & string

  /**
   * An `Iso.ZonedDateTime` is a timezone-aware date/time type that represents a real event that has happened (or will happen) at a particular instant from the perspective of a particular region on Earth. As the broadest `Iso` type, `Iso.ZonedDateTime` can be considered a combination of a `Iso.TimeZone`, `Iso.Instant`, and `Iso.DateTime`.
   *
   * As the only `Iso` type that persists a time zone, `Iso.ZonedDateTime` is optimized for use cases that require a time zone:
   *
   * - Arithmetic automatically adjusts for Daylight Saving Time, using the rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545) and adopted in other libraries like moment.js.
   * - Creating derived values (e.g. change time to 2:30AM) can avoid worrying that the result will be invalid due to the time zone's DST rules.
   * - Functions are available to easily measure attributes like "length of day" or "starting time of day" which may not be the same on all days in all time zones due to DST transitions or political changes to the definitions of time zones.
   * - It's easy to flip back and forth between a human-readable representation (like `Iso.DateTime`) and the UTC timeline (like `Iso.Instant`) without having to do any work to keep the two in sync.
   * - A date/time, an offset, and a time zone are represented in a single string that can be sorted alphabetically by the exact time they happened. This behavior is also helpful for developers who are not sure which of those components will be needed by later readers of this data.
   * - Multiple time-zone-sensitive operations can be performed in a chain without having to repeatedly provide the same time zone.
   *
   * An `Iso.ZonedDateTime` can be losslessly converted into every other `Iso` type except `Iso.Duration`. `Iso.Instant`, `Iso.DateTime`, `Iso.Date`, `Iso.Time`, `Iso.YearMonth`, and `Iso.MonthDay` all carry less information and can be used when complete information is not required.
   *
   * The `Iso.ZonedDateTime` functions are a superset of `Iso.DateTime` functions, which makes it easy to port code back and forth between the two types as needed. Because `Iso.DateTime` is not aware of time zones, in use cases where the time zone is known it's recommended to use `Iso.ZonedDateTime` which will automatically adjust for DST and can convert easily to `Iso.Instant` without having to re-specify the time zone.
   */
  export type ZonedDateTime = Format['YYYY-MM-DDThh:mm-ss.sss+00:00[TimeZoneName]'] & string

  /**
   * An `Iso.Date` represents a calendar date. "Calendar date" refers to the concept of a date as expressed in everyday usage, independent of any time zone. For example, it could be used to represent an event on a calendar which happens during the whole day no matter which time zone it's happening in.
   *
   * `Iso.Date` refers to the whole of a specific day; if you need to refer to a specific time on that day, use `Iso.DateTime`. An `Iso.Date` can be converted into a `Iso.ZonedDateTime` by combining it with a `Iso.Time` and `Iso.TimeZone` using the `toZonedDateTime()` function. It can also be combined with a `Iso.Time` to yield a "zoneless" `Iso.DateTime` using the `toDateTime()` method.
   *
   * `Iso.YearMonth` and `Iso.MonthDay` carry less information than `Iso.Date` and should be used when complete information is not required.
   */
  export type Date = Format['YYYY-MM-DD'] & string

  /**
   * An `Iso.Time` represents a wall-clock time, with a precision in milliseconds, and without any time zone. "Wall-clock time" refers to the concept of a time as expressed in everyday usage — the time that you read off the clock on the wall. For example, it could be used to represent an event that happens daily at a certain time, no matter what time zone.
   *
   * `Iso.Time` refers to a time with no associated calendar date; if you need to refer to a specific time on a specific day, use `Iso.DateTime`. A `Iso.Time` can be converted into a `Iso.ZonedDateTime` by combining it with a `Iso.Date` and `Iso.TimeZone` using the `toZonedDateTime()` function. It can also be combined with a `Iso.Date` to yield a "zoneless" `Iso.DateTime` using the `toDateTime()` function.
   */
  export type Time = Format['hh:mm:ss.sss'] & string

  /**
   * An `Iso.DateTime` represents a calendar date and wall-clock time, with a precision in milliseconds, and without any time zone.
   *
   * For use cases that require a time zone, especially using arithmetic or other derived values, consider using `Iso.ZonedDateTime` instead because that type automatically adjusts for Daylight Saving Time. A `Iso.DateTime` can be converted to a `Iso.ZonedDateTime` using a `Iso.TimeZone`.
   *
   * `Iso.Date`, `Iso.Time`, `Iso.YearMonth`, and `Iso.MonthDay` all carry less information and should be used when complete information is not required.
   *
   * A `Iso.DateTime` can be converted into any of the types mentioned above using conversion methods like `toZonedDateTime` or `toDate`.
   *
   * Because `Iso.DateTime` does not represent an exact point in time, most date/time use cases are better handled using exact time types like `Iso.ZonedDateTime` and `Iso.Instant`. But there are cases where `Iso.DateTime` is the correct type to use:
   *
   * - Representing timezone-specific events where the time zone is not stored together with the date/time data. In this case, `Iso.DateTime` is an intermediate step before converting to/from `Iso.ZonedDateTime` or `Iso.Instant` using the separate time zone. Examples:
   *    - When the time zone is stored separately in a separate database column or a per-user setting.
   *    - Implicit time zones, e.g. stock exchange data that is always `America/New_York`
   *    - Interacting with poorly-designed legacy systems that record data in the server's non-UTC time zone.
   * - Passing data to/from a component that is unaware of time zones, e.g. a UI date/time picker.
   * - Modeling events that happen at the same local time in every time zone. For example, the British Commonwealth observes a [two minute silence](https://en.wikipedia.org/wiki/Two-minute_silence) every November 11th at 11:00AM in local time.
   * - When time zone is irrelevant, e.g. a sleep tracking device that only cares about the local time you went to sleep and woke up, regardless of where in the world you are.
   * - Parsing local time from ISO 8601 strings like `2020-04-09T16:08-08:00` that have a numeric offset without an IANA time zone like `America/Los_Angeles`. These strings can also be parsed by `Iso.Instant`, but to parse the local date and time then `dateTimeFns.from` is required.
   * - Performing arithmetic that deliberately ignores DST. Example: in a day-planner UI, the visual height of a meeting may be the same even if DST skips or repeats an hour.
   * To learn more about time zones and DST best practices, visit [Time Zones and Resolving Ambiguity](https://iso-fns.org/docs/timezones-and-ambiguity).
   */
  export type DateTime = Format['YYYY-MM-DDThh:mm-ss.sss'] & string

  /**
   * A `Iso.YearMonth` represents a particular month on the calendar. For example, it could be used to represent a particular instance of a monthly recurring event, like "the June 2019 meeting".
   *
   * `Iso.YearMonth` refers to the whole of a specific month; if you need to refer to a calendar event on a certain day, use `Iso.Date` or even `Iso.DateTime`. A `Iso.YearMonth` can be converted into a `Iso.Date` by combining it with a day of the month, using the `toDate()` function.
   */
  export type YearMonth = Format['YYYY-MM'] & string

  /**
   * A `Iso.MonthDay` represents a particular day on the calendar, but without a year. For example, it could be used to represent a yearly recurring event, like "Bastille Day is on the 14th of July."
   *
   * If you need to refer to a certain instance of a calendar event, in a particular year, use `Iso.Date` or even `Iso.DateTime`. A `Iso.MonthDay` can be converted into a `Iso.Date` by combining it with a year, using the `toDate()` method.
   */
  export type MonthDay = Format['--MM-DD'] & string

  /**
   * A `Iso.Duration` represents a duration of time which can be used in date/time arithmetic.
   *
   * `Iso.Duration` can be constructed directly or returned from `durationFns.from()`. It can also be obtained from the `since()` function of any other `Iso` type that supports arithmetic, and is used in those types' `add()` and `subtract()` functions.
   *
   * An `Iso.Duration` is a string according to the ISO 8601 notation for durations. The examples in this page use this notation extensively.
   *
   * Briefly, the ISO 8601 notation consists of a P character, followed by years, months, weeks, and days, followed by a T character, followed by hours, minutes, and seconds with a decimal part, each with a single-letter suffix that indicates the unit. Any zero components may be omitted. For more detailed information, see the ISO 8601 standard or the [Wikipedia page](https://en.wikipedia.org/wiki/ISO_8601#Durations).
   *
   * | ISO 8601 | Meaning |
   * |:--|:--|
   * | P1Y1M1DT1H1M1.1S | One year, one month, one day, one hour, one minute, one second, and 100 milliseconds |
   * | P40D | Forty days |
   * | P1Y1D | A year and a day |
   * | P3DT4H59M | Three days, four hours and 59 minutes |
   * | PT2H30M | Two and a half hours |
   * | P1M | One month |
   * | PT1M | One minute |
   * | PT0.021S | 21 milliseconds  |
   * | PT0S | Zero |
   * | P0D | Zero |
   *
   * :::note
   *
   * According to the ISO 8601-1 standard, weeks are not allowed to appear together with any other units, and durations can only be positive. As extensions to the standard, ISO 8601-2 allows a sign character at the start of the string, and allows combining weeks with other units. If you intend to use a string such as P3W1D, +P1M, or -P1M for interoperability, note that other programs may not accept it.
   *
   * :::
   */
  export type Duration = Format['P(n)Y(n)M(n)DT(n)H(n)M(n)S'] & string
}
