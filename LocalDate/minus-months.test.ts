import { minusMonths } from './minus-months'
import describe from 'beartest-js'
import expect from 'expect'

// Germany invaded Poland on September 1st, 1939. Six years and one day later, on September 2nd, 1945, the war ended.
// This test is covering a currently know bug, so it is disabled. It should error because it is removing one month and one day from the date.
const Beginning = '1939-09-02'
const End = '1945-09-02'

describe('LocalDate: minusMonths', ({ it }) => {
  it.skip('should return the correct date after removing the specified number of months', () => {
    expect(minusMonths(End, 72)).toBe(Beginning)
  })
})
