import { getDayOfMonth } from './get-day-of-month'
import describe from 'beartest-js'
import expect from 'expect'

const MonthDay = '02-05'

describe('MonthDay: getDayOfMonth', ({ it }) => {
  it('should return the day of month', () => {
    expect(getDayOfMonth(MonthDay)).toBe(5)
  })
})
