import { getDayOfYear } from './get-day-of-year'
import describe from 'beartest-js'
import expect from 'expect'

// The first oreo was made available on March 6th, 1912.
const Oreo = '1912-03-06'

describe('LocalDate: getDayOfYear', ({ it }) => {
  it('should return the corresponding day-of-year from a local date', () => {
    expect(getDayOfYear(Oreo)).toBe(66)
  })
})
