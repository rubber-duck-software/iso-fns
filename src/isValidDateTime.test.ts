import describe from 'beartest-js'
import expect from 'expect'
import isValidDateTime from './isValidDateTime'

describe('isValidDateTime', ({ it }) => {
  it('should match valid dateTimes', () => {
    expect(isValidDateTime('1970-01-01T00:00:00.000')).toBeTruthy()
    expect(isValidDateTime('1999-12-31T23:59:59.999')).toBeTruthy()
    expect(isValidDateTime('1950-06-01T14:45:21.245')).toBeTruthy()
    expect(isValidDateTime('2016-02-29T00:00:00.000')).toBeTruthy()

    expect(isValidDateTime('1970-01-01T00:00:00')).toBeTruthy()
    expect(isValidDateTime('1999-12-31T23:59:59')).toBeTruthy()
    expect(isValidDateTime('1950-06-01T14:45:21')).toBeTruthy()
    expect(isValidDateTime('2016-02-29T00:00:00')).toBeTruthy()

    expect(isValidDateTime('1970-01-01T00:00')).toBeTruthy()
    expect(isValidDateTime('1999-12-31T23:59')).toBeTruthy()
    expect(isValidDateTime('1950-06-01T14:45')).toBeTruthy()
    expect(isValidDateTime('2016-02-29T00:00')).toBeTruthy()
  })

  it('should not match invalid dateTimes', () => {
    expect(isValidDateTime('1900-02-29T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1970-13-01T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1970-01-32T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1970-123-3T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1970-2-13T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1970-12-3T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('190-01-01T00:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1900-01-0100:00:00.000')).toBeFalsy()
    expect(isValidDateTime('1900-01-01T24:00:00.000')).toBeFalsy()
    expect(isValidDateTime('invalid dateTime')).toBeFalsy()
    expect(isValidDateTime(false)).toBeFalsy()
  })
})
