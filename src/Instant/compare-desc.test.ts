import { compareDesc } from './compare-desc'
import describe from 'beartest-js'
import expect from 'expect'

// The Jackson 5 was formed in 1969, but the New Kids weren't on the block until 1986

const Jackson5 = '1969-01-01T00:00:00.000Z'
const TheNewKids = '1986-01-01T00:00:00.000Z'

describe('Instant: compare-desc', ({ it }) => {
  it('should determine that two instants are in descending order', () => {
    expect(compareDesc(TheNewKids, Jackson5)).toBe(-1)
  })

  it('should determine that two instants are not in descending order', () => {
    expect(compareDesc(Jackson5, TheNewKids)).toBe(1)
  })

  it('should determine that two instants are the same instant', () => {
    expect(compareDesc(Jackson5, Jackson5)).toBe(0)
  })
})
