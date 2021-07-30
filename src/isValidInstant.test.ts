import describe from 'beartest-js'
import expect from 'expect'
import isValidInstant from './isValidInstant'

describe('isValidInstant', ({ it }) => {
  it('should match valid instants', () => {
    expect(isValidInstant('1970-01-01T00:00:00.000Z')).toBeTruthy()
    expect(isValidInstant('1999-12-31T23:59:59.999Z')).toBeTruthy()
    expect(isValidInstant('1950-06-01T14:45:21.245Z')).toBeTruthy()
    expect(isValidInstant('2016-02-29T00:00:00.000Z')).toBeTruthy()
  })

  it('should not match invalid instants', () => {
    expect(isValidInstant('1900-02-29T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1970-13-01T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1970-01-32T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1970-123-3T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1970-2-13T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1970-12-3T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('190-01-01T00:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1900-01-0100:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('1900-01-01T24:00:00.000Z')).toBeFalsy()
    expect(isValidInstant('invalid instant')).toBeFalsy()
    expect(isValidInstant(false)).toBeFalsy()
  })
})
