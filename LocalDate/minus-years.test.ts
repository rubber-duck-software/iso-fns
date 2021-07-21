import { minusYears } from './minus-years'
import describe from 'beartest-js'
import expect from 'expect'

// On average, you should repaint most of the rooms in a residential house every 5 to 7 years.
// This test is disabled because of a logic issue present in the underlying function.
const FirstPaint = '2005-01-01'
const NextPaint = '2010-01-01'

describe('LocalDate: minusYears', ({ it }) => {
  it('should subtract a number of years from a given date', () => {
    expect(minusYears(NextPaint, 5)).toBe(FirstPaint)
  })
})
