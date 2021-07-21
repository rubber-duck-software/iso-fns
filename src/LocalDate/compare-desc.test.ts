import { compareDesc } from './compare-desc'
import describe from 'beartest-js'
import expect from 'expect'

// The Lumiere brothers showed their first film on March 22nd, 1895.
// Georges Melies' 400th film, "A Trip to the Moon" was filmed in 1903.

const Lumiere = '1895-03-22'
const Moon = '1902-01-01'

describe('LocalDate: compareDesc', ({ it }) => {
  it('should determine that two local dates are in descending order', () => {
    expect(compareDesc(Moon, Lumiere)).toBe(-1)
  })

  it('should determine that two local dates are not in descending order', () => {
    expect(compareDesc(Lumiere, Moon)).toBe(1)
  })

  it('should determine that two local dates are the same date', () => {
    expect(compareDesc(Lumiere, Lumiere)).toBe(0)
  })
})
