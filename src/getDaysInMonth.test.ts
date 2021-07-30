import getDaysInMonth from './getDaysInMonth'
import describe from 'beartest-js'
import expect from 'expect'

describe('getDaysInMonth', ({ it }) => {
  it('should return the length of a month in a given date', () => {
    expect(getDaysInMonth('1937-07-02')).toBe(31)
    expect(getDaysInMonth('2020-02-01T00:00:00.000')).toBe(29)
    expect(getDaysInMonth('2020-05')).toBe(31)
    expect(getDaysInMonth(2, true)).toBe(29)
    expect(getDaysInMonth(1)).toBe(31)
    expect(getDaysInMonth(2, false)).toBe(28)

    // @ts-ignore
    expect(() => getDaysInMonth()).toThrowError()
    // @ts-ignore
    expect(() => getDaysInMonth(1, 2, 3)).toThrowError()
  })
})
