import { minus } from './minus'
import describe from 'beartest-js'
import { Friday, Sunday, Tuesday } from './values'
import expect from 'expect'

describe('DayOfWeek minus', ({ it }) => {
  it('should subtract the correct amount of days from a day-of-week value', () => {
    expect(minus(Friday, 3)).toBe(Tuesday)
    expect(minus(Friday, 5)).toBe(Sunday)
  })
})
