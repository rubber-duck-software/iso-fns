import describe from 'beartest-js'
import expect from 'expect'
import isValidDate from './isValidDate'

describe('isValidDate', ({ it }) => {
  it('should match valid dates', () => {
    expect(isValidDate('1970-01-01')).toBeTruthy()
    expect(isValidDate('1999-12-31')).toBeTruthy()
    expect(isValidDate('1950-06-01')).toBeTruthy()
    expect(isValidDate('2016-02-29')).toBeTruthy()
  })

  it('should not match invalid dates', () => {
    expect(isValidDate('1900-02-29')).toBeFalsy()
    expect(isValidDate('1970-13-01')).toBeFalsy()
    expect(isValidDate('1970-01-32')).toBeFalsy()
    expect(isValidDate('1970-123-3')).toBeFalsy()
    expect(isValidDate('1970-2-13')).toBeFalsy()
    expect(isValidDate('1970-12-3')).toBeFalsy()
    expect(isValidDate('190-01-01')).toBeFalsy()
    expect(isValidDate('invalid date')).toBeFalsy()
    expect(isValidDate(false)).toBeFalsy()
  })
})
