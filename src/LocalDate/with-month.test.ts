import { withMonth } from './with-month'
import describe from 'beartest-js'
import expect from 'expect'
import { March } from '../Month/values'

// The first orbital solar observatory was deployed on March 7th, 1962.
const IncorrectMonth = '1962-01-07'
const CorrectMonth = '1962-03-07'

describe('LocalDate: withMonth', ({ it }) => {
  it('should set the month of a given date', () => {
    expect(withMonth(IncorrectMonth, March)).toStrictEqual(CorrectMonth)
  })
})
