import { Sunday, Monday, Friday, Saturday } from './values'
import { compareAsc } from './compare-asc'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: compare-asc', ({ it }) => {
  it('should determine that two days are in ascending order', () => {
    expect(compareAsc(Monday, Saturday)).toBe(-1)
  })

  it('should determine that two days are not in ascending order', () => {
    expect(compareAsc(Saturday, Monday)).toBe(1)
  })

  it('should determine that two days are the same day', () => {
    expect(compareAsc(Monday, Monday)).toBe(0)
  })

  it('should sort an array of weekdays in ascending order', () => {
    const dates = [Monday, Friday, Sunday].sort(compareAsc)

    expect(dates).toStrictEqual([Sunday, Monday, Friday])
  })
})
