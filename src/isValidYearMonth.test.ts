import describe from 'beartest-js'
import expect from 'expect'
import isValidYearMonth from './isValidYearMonth'

describe('isValidYearMonth', ({ it }) => {
  it('should match valid yearMonths', () => {
    expect(isValidYearMonth('1970-01')).toBeTruthy()
    expect(isValidYearMonth('1999-12')).toBeTruthy()
    expect(isValidYearMonth('1950-06')).toBeTruthy()
    expect(isValidYearMonth('2016-02')).toBeTruthy()
  })

  it('should not match invalid yearMonths', () => {
    expect(isValidYearMonth('1970-13')).toBeFalsy()
    expect(isValidYearMonth('1970-123')).toBeFalsy()
    expect(isValidYearMonth('1970-2')).toBeFalsy()
    expect(isValidYearMonth('190-01')).toBeFalsy()
    expect(isValidYearMonth('invalid yearMonth')).toBeFalsy()
    expect(isValidYearMonth(false)).toBeFalsy()
  })
})
