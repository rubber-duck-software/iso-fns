import { getMonth } from './get-month'
import describe from 'beartest-js'
import expect from 'expect'
import { June } from '../Month/values'

// The 19th amendment was passed on June 4th, 1919
const Suffrage = '1919-06-04'

describe('LocalDate: getMonth', ({ it }) => {
  it('should return the correct month from a local date', () => {
    expect(getMonth(Suffrage)).toBe(June)
  })
})
