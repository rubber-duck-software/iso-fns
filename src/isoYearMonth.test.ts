import describe from 'beartest-js'
import expect from 'expect'
import isoYearMonth from './isoYearMonth'

describe('isoYearMonth', ({ it }) => {
  it('should create valid yearMonth', () => {
    expect(isoYearMonth()).toBeDefined()
    expect(isoYearMonth('2000-12-03')).toBe('2000-12')
    expect(isoYearMonth('2000-12-03T00:00:00.000')).toBe('2000-12')
    expect(isoYearMonth({ month: 12, year: 2000 })).toBe('2000-12')
    expect(isoYearMonth(2000, 12)).toBe('2000-12')
  })

  it('should throw on invalid yearMonths', () => {
    // @ts-ignore
    expect(() => isoYearMonth(1, 2, 3, 4)).toThrowError()
    expect(() => isoYearMonth('invalid yearMonth')).toThrowError()
    // @ts-ignore
    expect(() => isoYearMonth('invalid yearMonth', 3)).toThrowError()
  })
})
