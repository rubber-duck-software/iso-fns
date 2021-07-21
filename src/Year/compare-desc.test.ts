import { compareDesc } from './compare-desc'
import describe from 'beartest-js'
import expect from 'expect'

// Segregation was ended in 1948. Later in 1955, Rosa Parks refused to give up her seat on a Montgomery bus.
const Segregation = 1948
const RosaParks = 1955

describe('Year: compareDesc', ({ it }) => {
  it('should determine that two years are in descending order', () => {
    expect(compareDesc(RosaParks, Segregation)).toBe(-1)
  })

  it('should determine that two years are in ascending order', () => {
    expect(compareDesc(Segregation, RosaParks)).toBe(1)
  })

  it('should determines that two years are the same year', () => {
    expect(compareDesc(RosaParks, RosaParks)).toBe(0)
  })
})
