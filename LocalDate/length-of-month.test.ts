import { lengthOfMonth } from './length-of-month'
import describe from 'beartest-js'
import expect from 'expect'

// Amelia Earhart was reported missing on July 2nd, 1937
const Amelia = '1937-07-02'

describe('LocalDate: lengthOfMonth', ({ it }) => {
  it('should return the length of a month in a given date', () => {
    expect(lengthOfMonth(Amelia)).toBe(31)
  })
})
