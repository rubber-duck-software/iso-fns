import { compareDesc } from './compare-desc'
import { Tuesday, Wednesday, Thursday } from './values'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: compare-desc', ({ it }) => {
  it('should determine that two days are in descending order', () => {
    expect(compareDesc(Wednesday, Tuesday)).toBe(-1)
  })

  it('should determine that two days are not in descending order', () => {
    expect(compareDesc(Tuesday, Wednesday)).toBe(1)
  })

  it('should determine that two days are the same day', () => {
    expect(compareDesc(Tuesday, Tuesday)).toBe(0)
  })

  it('should sort an array of weekdays in descending order', () => {
    const dates = [Thursday, Tuesday, Wednesday].sort(compareDesc)

    expect(dates).toStrictEqual([Thursday, Wednesday, Tuesday])
  })
})
