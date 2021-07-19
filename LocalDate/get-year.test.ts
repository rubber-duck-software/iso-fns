import { getYear } from './get-year'
import describe from 'beartest-js'
import expect from 'expect'

// Black Tuesday was on October 29th, 1929
const Tuesday = '1929-10-29'

describe('LocalDate: getYear', ({ it }) => {
  it('should get the corresponding year from a local date', () => {
    expect(getYear(Tuesday)).toBe(1929)
  })
})
