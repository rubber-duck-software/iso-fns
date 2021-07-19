import { plusDays } from './plus-days'
import describe from 'beartest-js'
import expect from 'expect'

// The first photograph of Earth from space was taken on August 7th, 1959.
// The first photograph of the far side of the moon was taken on October 7th, 1959.
const Earth = '1959-08-07'
const Moon = '1959-10-07'

describe('LocalDate: plusDays', ({ it }) => {
  it('should add the correct number of days to a date', () => {
    expect(plusDays(Earth, 61)).toBe(Moon)
  })
})
