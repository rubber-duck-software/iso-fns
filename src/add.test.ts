import describe from 'beartest-js'
import expect from 'expect'
import add from './add'

describe('add', ({ it }) => {
  it('should add instants', () => {
    expect(add('2000-12-03T00:00:00.000Z', { hours: 12, minutes: 30, seconds: 15, milliseconds: 123 })).toBe(
      '2000-12-03T12:30:15.123Z'
    )
    expect(add('2000-12-03T00:00:00.000Z', 'PT12H30M15.123S')).toBe('2000-12-03T12:30:15.123Z')
  })

  it('should not add days-years to instant', () => {
    expect(() => add('2000-12-03T00:00:00.000Z', 'P1D')).toThrowError()
    expect(() => add('2000-12-03T00:00:00.000Z', 'P1W')).toThrowError()
    expect(() => add('2000-12-03T00:00:00.000Z', 'P1M')).toThrowError()
    expect(() => add('2000-12-03T00:00:00.000Z', 'P1Y')).toThrowError()
  })

  it('should add dateTimes', () => {
    expect(add('2020-01-01T00:00:00.000', 'P2MT6H')).toBe('2020-03-01T06:00:00.000')
    expect(add('2020-01-01T00:00:00.000', { months: 2, hours: 6 })).toBe('2020-03-01T06:00:00.000')

    expect(
      add('1990-10-01T00:00:00.000', {
        years: 10,
        months: 2,
        days: 2,
        hours: 12,
        minutes: 30,
        seconds: 15,
        milliseconds: 123
      })
    ).toBe('2000-12-03T12:30:15.123')
    expect(add('1990-10-01T00:00:00.000', 'P10Y2M2DT12H30M15.123S')).toBe('2000-12-03T12:30:15.123')

    expect(add('2020-03-01T00:00:00.000', '-P1D')).toBe('2020-02-29T00:00:00.000')
    expect(add('2020-03-01T00:00:00.000', { days: -1 })).toBe('2020-02-29T00:00:00.000')

    expect(() => add('2020-01-31T00:00:00.000', { months: 1 }, { overflow: 'reject' })).toThrowError()
    expect(() => add('2020-03-31T00:00:00.000', { months: 1 }, { overflow: 'reject' })).toThrowError()
  })

  it('should add dates', () => {
    expect(
      add('1990-10-01', {
        years: 10,
        months: 2,
        days: 2
      })
    ).toBe('2000-12-03')
    expect(add('1990-10-01', 'P10Y2M2D')).toBe('2000-12-03')

    expect(add('2020-03-01', '-P1D')).toBe('2020-02-29')
    expect(add('2020-03-01', { days: -1 })).toBe('2020-02-29')

    expect(add('2020-01-31', 'P1M')).toBe('2020-02-29')
    expect(add('2020-01-31', { months: 1 })).toBe('2020-02-29')
    expect(() => add('2020-01-31', { months: 1 }, { overflow: 'reject' })).toThrowError()

    expect(add('2020-03-31', '-P1M')).toBe('2020-02-29')
    expect(add('2020-03-31', { months: -1 })).toBe('2020-02-29')
    expect(() => add('2020-03-31', { months: -1 }, { overflow: 'reject' })).toThrowError()
  })

  it('should add times', () => {
    expect(
      add('00:00:00.000', {
        hours: 12,
        minutes: 30,
        seconds: 15,
        milliseconds: 123
      })
    ).toBe('12:30:15.123')
    expect(add('00:00:00.000', 'PT12H30M15.123S')).toBe('12:30:15.123')

    expect(
      add('00:00:00.000', {
        hours: -12,
        minutes: -30,
        seconds: -15,
        milliseconds: -123
      })
    ).toBe('11:29:44.877')
    expect(add('00:00:00.000', '-PT12H30M15.123S')).toBe('11:29:44.877')
  })

  it('should add yearMonths', () => {
    expect(
      add('1990-10', {
        years: 10,
        months: 2
      })
    ).toBe('2000-12')
    expect(add('1990-10', 'P10Y2M')).toBe('2000-12')
  })

  it('should add durations', () => {
    expect(add('P3Y2M3D', 'P1Y5M', { relativeTo: '2020-01-01' })).toBe('P4Y7M3D')
    expect(add('PT60M', 'PT90M')).toBe('PT150M')
    expect(add('PT1H', 'PT90M')).toBe('PT2H30M')

    expect(add('P12M', 'P6M', { relativeTo: '2020-01-01' })).toBe('P18M')
    expect(add('PT0.001S', 'PT0.001S')).toBe('PT0.002S')
  })
})
