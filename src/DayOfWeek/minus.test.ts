import { Friday } from './values'
import { minus } from './minus'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: minus', ({ it }) => {
  it('should subtract an amount of days from a day-of-week value', () => {
    expect(minus(Friday, 3)).toStrictEqual('Tuesday')
    expect(minus(Friday, 5)).toStrictEqual('Sunday')
  })
})
