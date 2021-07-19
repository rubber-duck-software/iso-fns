import { withDayOfYear } from './with-day-of-year'
import describe from 'beartest-js'
import expect from 'expect'

// John Glen was put into orbit on February 10th, 1962.
const Year = '1962-01-01'
const Glen = '1962-02-10'

describe('LocalDate: withDayOfYear', ({ it }) => {
  it('should set the date using the day of the year', () => {
    expect(withDayOfYear(Year, 41)).toStrictEqual(Glen)
  })
})
