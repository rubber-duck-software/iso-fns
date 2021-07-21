import { getMonthOrdinal } from './get-month-ordinal'
import describe from 'beartest-js'
import expect from 'expect'

// King Tut's tomb was discovered on November 4th, 1922
const Tut = '1922-11-04'

describe('LocalDate: getMonthOrdinal', ({ it }) => {
  it('should return the correct ordinal month from a local date assuming 0-indexing', () => {
    expect(getMonthOrdinal(Tut)).toBe(10)
  })
})
