export interface DateSlots {
  year: number
  month: number
  day: number
}

export interface TimeSlots {
  hour: number
  minute: number
  second: number
  millisecond: number
}

export interface DateTimeSlots extends DateSlots, TimeSlots {}

export interface ZonedDateTimeSlots extends DateTimeSlots {
  epochMilliseconds: number
  timeZone: string
  offset: string
}

export interface InstantSlots {
  epochMilliseconds: number
}

export interface YearMonthSlots {
  year: number
  month: number
}

export interface MonthDaySlots {
  month: number
  day: number
}

export interface DurationSlots {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}
