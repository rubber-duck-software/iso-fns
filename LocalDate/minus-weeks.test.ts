import { minusWeeks } from './minus-weeks'
import describe from 'beartest-js'
import expect from 'expect'

// The average fly lives between two and three weeks
// The underlying function is broken so test is skipped
const Birth = '2001-02-06'
const Death = '2001-02-20'

describe('LocalDate: minusWeeks', ({ it }) => {
  it('should remove the given number of weeks from a LocalDate', () => {
    expect(minusWeeks(Death, 2)).toStrictEqual(Birth)
  })
})
