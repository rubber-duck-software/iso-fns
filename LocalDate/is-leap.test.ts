import { isLeap } from './is-leap'
import describe from 'beartest-js'
import expect from 'expect'

// 1920 is not that special, but it is a leap year
const leapYear = '1920-01-01'
const nonLeapYear = '1921-01-01'

describe('LocalDate: isLeap', ({ it }) => {
  it('should return true if the year is a leap year', () => {
    expect(isLeap(leapYear)).toBeTruthy()
  })

  it('should return false since the year is not a leap year', () => {
    expect(isLeap(nonLeapYear)).toBeFalsy()
  })
})
