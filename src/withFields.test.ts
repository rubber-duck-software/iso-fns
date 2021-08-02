import describe from 'beartest-js'
import expect from 'expect'
import withFields from './withFields'

describe('withFields', ({ it }) => {
  it('should set fields for yearMonth', () => {
    expect(withFields('1970-01', { year: 1980, month: 3 })).toBe('1980-03')
    expect(withFields('1970-01', { year: 1980 })).toBe('1980-01')
    expect(withFields('1970-01', { month: 3 })).toBe('1970-03')
  })

  it('should set fields for monthDay', () => {
    expect(withFields('--01-01', { month: 3, day: 15 })).toBe('--03-15')
    expect(withFields('--01-01', { month: 3 })).toBe('--03-01')
    expect(withFields('--01-01', { day: 15 })).toBe('--01-15')
  })

  it('should set fields for date', () => {
    expect(withFields('1970-01-01', { year: 1980, month: 3, day: 15 })).toBe('1980-03-15')
    expect(withFields('1970-01-01', { year: 1980, month: 3 })).toBe('1980-03-01')
    expect(withFields('1970-01-01', { year: 1980 })).toBe('1980-01-01')
    expect(withFields('1970-01-01', { month: 3 })).toBe('1970-03-01')
    expect(withFields('1970-01-01', { day: 15 })).toBe('1970-01-15')
    expect(withFields('1970-01-01', { month: 3, day: 15 })).toBe('1970-03-15')
    expect(withFields('1970-01-01', { year: 1980, day: 15 })).toBe('1980-01-15')
  })

  it('should set fields for time', () => {
    expect(withFields('00:00:00.000', { hour: 12, minute: 30, second: 45, millisecond: 123 })).toBe('12:30:45.123')
    expect(withFields('00:00:00.000', { hour: 12 })).toBe('12:00:00.000')
    expect(withFields('00:00:00.000', { minute: 30 })).toBe('00:30:00.000')
    expect(withFields('00:00:00.000', { second: 45 })).toBe('00:00:45.000')
    expect(withFields('00:00:00.000', { millisecond: 123 })).toBe('00:00:00.123')
  })

  it('should set fields for dateTime', () => {
    expect(
      withFields('1970-01-01T00:00:00.000', {
        year: 1980,
        month: 3,
        day: 15,
        hour: 12,
        minute: 30,
        second: 45,
        millisecond: 123
      })
    ).toBe('1980-03-15T12:30:45.123')
    expect(withFields('1970-01-01T00:00:00.000', { year: 1980 })).toBe('1980-01-01T00:00:00.000')
    expect(withFields('1970-01-01T00:00:00.000', { month: 3 })).toBe('1970-03-01T00:00:00.000')
    expect(withFields('1970-01-01T00:00:00.000', { day: 15 })).toBe('1970-01-15T00:00:00.000')
    expect(withFields('1970-01-01T00:00:00.000', { hour: 12 })).toBe('1970-01-01T12:00:00.000')
    expect(withFields('1970-01-01T00:00:00.000', { minute: 30 })).toBe('1970-01-01T00:30:00.000')
    expect(withFields('1970-01-01T00:00:00.000', { second: 45 })).toBe('1970-01-01T00:00:45.000')
    expect(withFields('1970-01-01T00:00:00.000', { millisecond: 123 })).toBe('1970-01-01T00:00:00.123')
  })

  it('should set fields for duration', () => {
    expect(
      withFields('P0D', {
        years: 1,
        months: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        milliseconds: 100
      })
    ).toBe('P1Y1M1DT1H1M1.1S')
    expect(withFields('P0Y', { days: 40 })).toBe('P40D')
    expect(withFields('PT0.021S', { milliseconds: 22 })).toBe('PT0.022S')
    expect(withFields('P0Y', { days: -2, hours: -12 })).toBe('-P2DT12H')
  })
})
