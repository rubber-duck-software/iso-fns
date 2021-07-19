import { ofYearMonthDay } from './of-year-month-day'
import describe from 'beartest-js'
import expect from 'expect'
import { October } from '../Month/values'

// The Soviet Union launched Sputnik on October 4th, 1957
const Sputnik = '1957-10-04'

describe('LocalDate: ofYearMonthDay', ({ it }) =>
  it('should return the correct day of month', () => {
    expect(ofYearMonthDay(1957, October, 4)).toBe(Sputnik)
  }))
