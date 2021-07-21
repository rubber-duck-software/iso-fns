import { compareDesc } from './compare-desc'
import describe from 'beartest-js'
import expect from 'expect'

const DayOne = '02-15'
const DayTwo = '02-20'

describe('MonthDay: monthDay', ({ it }) => {
  it('should determine that two days are in descending order', () => {
    expect(compareDesc(DayTwo, DayOne)).toBe(-1)
  })

  it('should determine that two days are in ascending order', () => {
    expect(compareDesc(DayOne, DayTwo)).toBe(1)
  })

  it('should determine that two days are the same day', () => {
    expect(compareDesc(DayOne, DayOne)).toBe(0)
  })
})
