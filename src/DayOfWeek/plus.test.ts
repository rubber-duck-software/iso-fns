import { plus } from './plus'
import { Sunday } from './values'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: plus', ({ it }) => {
  it('should add an amount of days from a day-of-week value', () => {
    expect(plus(Sunday, 3)).toStrictEqual('Wednesday')
    expect(plus(Sunday, 11)).toStrictEqual('Thursday')
  })
})
