import describe from 'beartest-js'
import expect from 'expect'
import getDayOfWeek from './getDayOfWeek'

describe('getDayOfWeek', ({ it }) => {
  it('should get day of week', () => {
    expect(getDayOfWeek('2021-01-01')).toBe(5)
    expect(getDayOfWeek('2019-02-02T00:00')).toBe(6)
    expect(getDayOfWeek('2021-08-01T00:00')).toBe(7)
  })
})
