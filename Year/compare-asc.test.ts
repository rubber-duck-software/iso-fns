import { compareAsc } from './compare-asc'
import describe from 'beartest-js'
import expect from 'expect'

// The first mission to leave the inner solar system took place in 1972.
// Exactly three years later, in 1975, the first multinational human-crewed mission took place.
const Inner = 1972
const Multinational = 1975

describe('Year: compareAsc', ({ it }) => {
  it('should determine that two years are in ascending order', () => {
    expect(compareAsc(Inner, Multinational)).toBe(-1)
  })

  it('should determines that two years are in descending order', () => {
    expect(compareAsc(Multinational, Inner)).toBe(1)
  })

  it('should determine that two years are the same year', () => {
    expect(compareAsc(Inner, Inner))
  })
})
