import describe from 'beartest-js'
import expect from 'expect'
import getWeekOfYear from './getWeekOfYear'

describe('getWeekOfYear', ({ it }) => {
  it('should get week of year', () => {
    expect(getWeekOfYear('1980-12-29')).toBe(1)
    expect(getWeekOfYear('1980-12-30')).toBe(1)
    expect(getWeekOfYear('1981-01-01T00:00')).toBe(1)

    expect(getWeekOfYear('1982-01-03T00:00')).toBe(53)
    expect(getWeekOfYear('1982-01-03T23:59:59.999')).toBe(53)

    expect(getWeekOfYear('2015-11-01')).toBe(44)
    expect(getWeekOfYear('2015-11-01T00:00')).toBe(44)
    expect(getWeekOfYear('2015-11-01T23:59:59.999')).toBe(44)
  })
})
