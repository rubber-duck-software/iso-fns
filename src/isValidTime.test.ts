import describe from 'beartest-js'
import expect from 'expect'
import isValidTime from './isValidTime'

describe('isValidTime', ({ it }) => {
  it('should match valid times', () => {
    expect(isValidTime('00:00:00.000')).toBeTruthy()
    expect(isValidTime('23:59:59.999')).toBeTruthy()
    expect(isValidTime('14:45:21.245')).toBeTruthy()
    expect(isValidTime('00:00:00.000')).toBeTruthy()

    expect(isValidTime('14:30')).toBeTruthy()
    expect(isValidTime('00:00')).toBeTruthy()
    expect(isValidTime('01:24')).toBeTruthy()
    expect(isValidTime('11:59')).toBeTruthy()
    expect(isValidTime('23:59')).toBeTruthy()

    expect(isValidTime('14:30:12')).toBeTruthy()
    expect(isValidTime('00:00:00')).toBeTruthy()
    expect(isValidTime('01:24:45')).toBeTruthy()
    expect(isValidTime('11:59:59')).toBeTruthy()
    expect(isValidTime('23:59:59')).toBeTruthy()
  })

  it('should not match invalid times', () => {
    expect(isValidTime('T00:00:00.000')).toBeFalsy()
    expect(isValidTime('24:00:00.000')).toBeFalsy()
    expect(isValidTime('invalid time')).toBeFalsy()
    expect(isValidTime(false)).toBeFalsy()
  })
})
