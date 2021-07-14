import { compareAsc } from './compare-asc'
import describe from 'beartest-js'
import expect from 'expect'

// The Beatles were formed in 1962, whereas the Monkees were not formed until 1966.

const Beatles = '1962-01-01T00:00:00.000Z'
const Monkees = '1966-01-01T00:00:00.000Z'

describe('Instant: compare-asc', ({ it }) => {
  it('should determine that two instants in time are in ascending order', () => {
    expect(compareAsc(Beatles, Monkees)).toBe(-1)
  })

  it('should determine that two instants in time are not in ascending order', () => {
    expect(compareAsc(Monkees, Beatles)).toBe(1)
  })

  it('should determine that two instants in time are the same instants', () => {
    expect(compareAsc(Beatles, Beatles)).toBe(0)
  })
})
