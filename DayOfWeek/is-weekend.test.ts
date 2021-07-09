import { Sunday, Monday } from './values'
import { isWeekend } from './is-weekend'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: is-weekend', ({ it }) => {
  it('should determine if a day-of-week value is a weekend', () => {
    expect(isWeekend(Sunday)).toBeTruthy
    expect(isWeekend(Monday)).toBeFalsy
  })
})
