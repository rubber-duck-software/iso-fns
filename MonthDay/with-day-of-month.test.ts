import { withDayOfMonth } from './with-day-of-month'
import describe from 'beartest-js'
import expect from 'expect'

const MonthDay = '02-05'
const day = 10

describe('MonthDay: withDayOfMonth', ({ it }) => {
  it('should change the day of the month', () => {
    expect(withDayOfMonth(MonthDay, day)).toBe('02-10')
  })
})
