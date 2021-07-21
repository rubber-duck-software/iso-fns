import { compareAsc } from './compare-asc'
import describe from 'beartest-js'
import expect from 'expect'

const DayOne = '02-15'
const DayTwo = '02-20'

describe('MonthDay: compareAsc', ({ it }) => {
  it('should determine that two monthDays are in ascending order', () => {
    expect(compareAsc(DayOne, DayTwo)).toBe(-1)
  })

  it('should determine that two monthDays are in descending order', () => {
    expect(compareAsc(DayTwo, DayOne)).toBe(1)
  })

  it('should determine that two monthDays are the same day', () => {
    expect(compareAsc(DayOne, DayOne)).toBe(0)
  })
})
