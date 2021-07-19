import { withYear } from './with-year'
import describe from 'beartest-js'
import expect from 'expect'

// The first woman was launched into space on April 26th, 1962.
const IncorrectYear = '1010-04-26'
const CorrectYear = '1962-04-26'

describe('LocalDate: withYear', ({ it }) => {
  it('should set the year of a date', () => {
    expect(withYear(IncorrectYear, 1962)).toStrictEqual(CorrectYear)
  })
})
