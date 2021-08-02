import describe from 'beartest-js'
import expect from 'expect'
import getFields from './getFields'

describe('getFields', ({ it }) => {
  it('should get fields for yearMonth', () => {
    expect(getFields('1970-01')).toStrictEqual({ year: 1970, month: 1 })
    expect(getFields('2020-01')).toStrictEqual({ year: 2020, month: 1 })
    expect(getFields('2020-02')).toStrictEqual({ year: 2020, month: 2 })
    expect(getFields('2003-11')).toStrictEqual({ year: 2003, month: 11 })
    expect(getFields('1943-07')).toStrictEqual({ year: 1943, month: 7 })
    expect(getFields('1985-12')).toStrictEqual({ year: 1985, month: 12 })
  })

  it('should get fields for monthDay', () => {
    expect(getFields('--01-31')).toStrictEqual({ month: 1, day: 31 })
    expect(getFields('--02-29')).toStrictEqual({ month: 2, day: 29 })
    expect(getFields('--03-01')).toStrictEqual({ month: 3, day: 1 })
    expect(getFields('--04-15')).toStrictEqual({ month: 4, day: 15 })
    expect(getFields('--09-10')).toStrictEqual({ month: 9, day: 10 })
  })

  it('should get fields for date', () => {
    expect(getFields('1999-01-31')).toStrictEqual({ year: 1999, month: 1, day: 31 })
    expect(getFields('2020-02-29')).toStrictEqual({ year: 2020, month: 2, day: 29 })
    expect(getFields('2002-03-31')).toStrictEqual({ year: 2002, month: 3, day: 31 })
    expect(getFields('2000-05-13')).toStrictEqual({ year: 2000, month: 5, day: 13 })
    expect(getFields('1940-01-01')).toStrictEqual({ year: 1940, month: 1, day: 1 })
  })

  it('should get fields for time', () => {
    expect(getFields('12:30:15.124')).toStrictEqual({ hour: 12, minute: 30, second: 15, millisecond: 124 })
    expect(getFields('12:30')).toStrictEqual({ hour: 12, minute: 30, second: 0, millisecond: 0 })
    expect(getFields('00:00')).toStrictEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    expect(getFields('23:59:59')).toStrictEqual({ hour: 23, minute: 59, second: 59, millisecond: 0 })
    expect(getFields('17:53:12.542')).toStrictEqual({ hour: 17, minute: 53, second: 12, millisecond: 542 })
  })

  it('should get fields for dateTime', () => {
    expect(getFields('1999-01-31T12:30:15.124')).toStrictEqual({
      year: 1999,
      month: 1,
      day: 31,
      hour: 12,
      minute: 30,
      second: 15,
      millisecond: 124
    })
    expect(getFields('2023-05-12T00:30')).toStrictEqual({
      year: 2023,
      month: 5,
      day: 12,
      hour: 0,
      minute: 30,
      second: 0,
      millisecond: 0
    })
    expect(getFields('2010-10-01T07:30:59')).toStrictEqual({
      year: 2010,
      month: 10,
      day: 1,
      hour: 7,
      minute: 30,
      second: 59,
      millisecond: 0
    })
    expect(getFields('1970-01-01T00:00:00.000')).toStrictEqual({
      year: 1970,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    expect(getFields('1930-12-31T23:59:59.999')).toStrictEqual({
      year: 1930,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999
    })
  })

  it('should get fields for duration', () => {
    const fields = getFields('P1Y1M1DT1H1M1.1S')
    expect(fields).toStrictEqual({
      years: 1,
      months: 1,
      weeks: 0,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      milliseconds: 100
    })
    expect(getFields('P1Y2M3D')).toStrictEqual({
      years: 1,
      months: 2,
      weeks: 0,
      days: 3,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    })
    expect(getFields('P3M')).toStrictEqual({
      years: 0,
      months: 3,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    })
    expect(getFields('PT1000S')).toStrictEqual({
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1000,
      milliseconds: 0
    })
    expect(getFields('PT3H2M1S')).toStrictEqual({
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 3,
      minutes: 2,
      seconds: 1,
      milliseconds: 0
    })
  })
})
