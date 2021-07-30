import describe from 'beartest-js'
import expect from 'expect'
import isValidMonthDay from './isValidMonthDay'

describe('isValidMonthDay', ({ it }) => {
  it('should match valid monthDays', () => {
    expect(isValidMonthDay('01-01')).toBeTruthy()
    expect(isValidMonthDay('12-31')).toBeTruthy()
    expect(isValidMonthDay('06-01')).toBeTruthy()
    expect(isValidMonthDay('02-29')).toBeTruthy()
  })

  it('should not match invalid monthDays', () => {
    expect(isValidMonthDay('13-01')).toBeFalsy()
    expect(isValidMonthDay('01-32')).toBeFalsy()
    expect(isValidMonthDay('123-3')).toBeFalsy()
    expect(isValidMonthDay('2-13')).toBeFalsy()
    expect(isValidMonthDay('12-3')).toBeFalsy()
    expect(isValidMonthDay('invalid monthDay')).toBeFalsy()
    expect(isValidMonthDay(false)).toBeFalsy()
  })
})
