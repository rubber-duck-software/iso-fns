import { getDayOfWeek } from './get-day-of-week'
import describe from 'beartest-js'
import expect from 'expect'
import { Saturday } from '../DayOfWeek/values'

// On March 25th, 1911 The Triangle Tee-Shirt Factory fire in New York occurred.
const TTSFactory = '1911-03-25'

describe('LocalDate: getDayOfWeek', ({ it }) => {
  it('should return the corresponding day of week', () => {
    expect(getDayOfWeek(TTSFactory)).toBe(Saturday)
  })
})
