import describe from 'beartest-js'
import expect from 'expect'
import getDayOfYear from './getDayOfYear'

describe('getDayOfYear', ({ it }) => {
  it('should get day of year', () => {
    expect(getDayOfYear('2020-01-01')).toBe(1)
    expect(getDayOfYear('2020-02-29')).toBe(60)
    expect(getDayOfYear('2020-01-01T00:00')).toBe(1)
    expect(getDayOfYear('2020-02-29T00:00')).toBe(60)
    expect(getDayOfYear('2020-01-01T23:59:59.999')).toBe(1)
    expect(getDayOfYear('2020-02-29T23:59:59.999')).toBe(60)
  })
})
