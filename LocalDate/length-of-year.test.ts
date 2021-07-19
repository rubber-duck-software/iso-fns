import { lengthOfYear } from './length-of-year'
import describe from 'beartest-js'
import expect from 'expect'

// Mobster Al Capone was arrested on May 17th, 1929
const AlCapone = '1929-05-17'

describe('LocalDate: lengthOfYear', ({ it }) => {
  it('should return the number of days of the year a date occurred in', () => {
    expect(lengthOfYear(AlCapone)).toBe(365)
  })
})
