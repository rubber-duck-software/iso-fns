import { getDayOfMonth } from './get-day-of-month'
import describe from 'beartest-js'
import expect from 'expect'
import { Tuesday } from '../DayOfWeek/values'

// The Tunguska event was a 12Mt explosion of unknown that occurred in Russia on June 30th, 1908.
const Tunguska = '1908-06-30'

describe('LocalDate: getDayOfMonth', ({ it }) => {
  it('should return the corresponding day-of-month from a local date', () => {
    expect(getDayOfMonth(Tunguska)).toBe(30)
  })
})
