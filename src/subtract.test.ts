import describe from 'beartest-js'
import expect from 'expect'
import subtract from './subtract'

describe('subtract', ({ it }) => {
  it('should subtract instants', () => {
    expect(subtract('2000-12-04T01:00:30.246Z', { hours: 12, minutes: 30, seconds: 15, milliseconds: 123 })).toBe(
      '2000-12-03T12:30:15.123Z'
    )
    expect(subtract('2000-12-04T01:00:30.246Z', 'PT12H30M15.123S')).toBe('2000-12-03T12:30:15.123Z')
  })

  it('should subtract dateTimes', () => {
    expect(
      subtract('2011-02-06T01:00:30.246', {
        years: 10,
        months: 2,
        days: 2,
        hours: 12,
        minutes: 30,
        seconds: 15,
        milliseconds: 123
      })
    ).toBe('2000-12-03T12:30:15.123')
    expect(subtract('2011-02-06T01:00:30.246', 'P10Y2M2DT12H30M15.123S')).toBe('2000-12-03T12:30:15.123')
  })

  it('should subtract dates', () => {
    expect(
      subtract('2011-02-05', {
        years: 10,
        months: 2,
        days: 2
      })
    ).toBe('2000-12-03')
    expect(subtract('2011-02-05', 'P10Y2M2D')).toBe('2000-12-03')
  })

  it('should subtract times', () => {
    expect(
      subtract('01:00:30.246', {
        hours: 12,
        minutes: 30,
        seconds: 15,
        milliseconds: 123
      })
    ).toBe('12:30:15.123')
    expect(subtract('01:00:30.246', 'PT12H30M15.123S')).toBe('12:30:15.123')
  })

  it('should add yearMonths', () => {
    expect(
      subtract('2011-02', {
        years: 10,
        months: 2
      })
    ).toBe('2000-12')
    expect(subtract('2011-02', 'P10Y2M')).toBe('2000-12')
  })
})
