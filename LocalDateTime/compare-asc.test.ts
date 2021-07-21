import { compareAsc } from './compare-asc'
import describe from 'beartest-js'
import expect from 'expect'

// The Beatles were formed in 1962, whereas the Monkees were not formed until 1966.

const Beatles = '1962-01-01T00:00:00.000'
const Monkees = '1966-01-01T00:00:00.000'

describe('LocalDateTime: compare-asc', ({ it }) => {
  it('should determine that two LocalDateTimes are in ascending order', () => {
    expect(compareAsc(Beatles, Monkees)).toBe(-1)
  })

  it('should determine that two LocalDateTimes are not in ascending order', () => {
    expect(compareAsc(Monkees, Beatles)).toBe(1)
  })

  it('should determine that two LocalDateTimes are the same instants', () => {
    expect(compareAsc(Beatles, Beatles)).toBe(0)
  })
})
