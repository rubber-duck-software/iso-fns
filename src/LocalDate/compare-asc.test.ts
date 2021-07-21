import { compareAsc } from './compare-asc'
import describe from 'beartest-js'
import expect from 'expect'

// The titanic set sail on April 11th, and on sunk on April 15th, 1912
const SetSail = '1912-04-11'
const Sank = '1912-04-15'

describe('LocalDate: compareAsc', ({ it }) => {
  it('should determine that two dates are in ascending order', () => {
    expect(compareAsc(SetSail, Sank)).toBe(-1)
  })

  it('should determine that two dates are not in ascending order', () => {
    expect(compareAsc(Sank, SetSail)).toBe(1)
  })

  it('should determine that two dates are the same date', () => {
    expect(compareAsc(Sank, Sank)).toBe(0)
  })
})
