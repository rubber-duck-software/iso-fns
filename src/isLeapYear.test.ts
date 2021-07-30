import isLeapYear from './isLeapYear'
import describe from 'beartest-js'
import expect from 'expect'

describe('isLeapYear', ({ it }) => {
  it('should determine if date is leap year', () => {
    expect(isLeapYear('1920-01-01')).toBeTruthy()
    expect(isLeapYear('1921-01-01')).toBeFalsy()
  })

  it('should determine if dateTime is leap year', () => {
    expect(isLeapYear('1920-01-01T00:00:00.000')).toBeTruthy()
    expect(isLeapYear('1921-01-01T00:00:00.000')).toBeFalsy()
  })

  it('should determine if yearMonth is leap year', () => {
    expect(isLeapYear('2020-01')).toBeTruthy()
    expect(isLeapYear('2019-01')).toBeFalsy()
    expect(isLeapYear('2000-01')).toBeTruthy()
    expect(isLeapYear('1900-01')).toBeFalsy()
  })

  it('should determine if year is leap year ', () => {
    expect(isLeapYear(2020)).toBeTruthy()
    expect(isLeapYear(2019)).toBeFalsy()
    expect(isLeapYear(2000)).toBeTruthy()
    expect(isLeapYear(1900)).toBeFalsy()
  })

  it('should throw on invalid input', () => {
    // @ts-ignore
    expect(() => isLeapYear('invalid input')).toThrowError()
  })
})
