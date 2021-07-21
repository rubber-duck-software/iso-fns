import { withDayOfMonth } from './with-day-of-month'
import describe from 'beartest-js'
import expect from 'expect'

// The first flyby of Venus took place on May 19th, 1961.
const Venus = '1961-04-19'
const AfterVenus = '1961-04-02'

describe('LocalDate: withDayOfMonth', ({ it }) => {
  it('should set the day of the month to the correct date', () => {
    expect(withDayOfMonth(Venus, 2)).toStrictEqual(AfterVenus)
  })
})
