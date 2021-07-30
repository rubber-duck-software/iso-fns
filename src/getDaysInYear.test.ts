import getDaysInYear from './getDaysInYear'
import describe from 'beartest-js'
import expect from 'expect'

describe('getDaysInYear', ({ it }) => {
  it('should return the number of days of the year a date occurred in', () => {
    expect(getDaysInYear('1929-05-17')).toBe(365)
    expect(getDaysInYear('1929-05-17T00:00:00.000')).toBe(365)
    expect(getDaysInYear('2020-01')).toBe(366)
    expect(getDaysInYear(2020)).toBe(366)
    expect(getDaysInYear(2019)).toBe(365)
  })
})
