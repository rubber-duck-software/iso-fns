import { getDayOfMonth } from './get-day-of-month'
import describe from 'beartest-js'
import expect from 'expect'

const LocalDateTime = '1986-01-01T00:00:00.000'

describe('LocalDateTime: getDayOfMonth', ({ it }) => {
  it('get the correct day of the month from a LocalDateTime', () => {
    expect(getDayOfMonth(LocalDateTime)).toBe(1)
  })
})
