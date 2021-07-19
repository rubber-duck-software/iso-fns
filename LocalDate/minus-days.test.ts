import { minusDays } from './minus-days'
import describe from 'beartest-js'
import expect from 'expect'

// Belka and Strelka were the first animals that safely returned from space on August 19th, 1960.
// One day earlier, the first successful recovery of film from space took place on August 18th, 1960.
const Animals = '1960-08-19'
const Film = '1960-08-18'

describe('LocalDate: minusDays', ({ it }) => {
  it('should remove a number of days from a date', () => {
    expect(minusDays(Animals, 1)).toBe(Film)
  })
})
