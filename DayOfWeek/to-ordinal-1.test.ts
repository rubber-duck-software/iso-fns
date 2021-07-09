import { toOrdinal_1 } from './to-ordinal-1'
import { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday } from './values'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: to-ordinal-1', ({ it }) => {
  it('should return the correct ordinal from day-of-week assuming 1-indexing', () => {
    expect(toOrdinal_1(Sunday)).toBe(1)
    expect(toOrdinal_1(Monday)).toBe(2)
    expect(toOrdinal_1(Tuesday)).toBe(3)
    expect(toOrdinal_1(Wednesday)).toBe(4)
    expect(toOrdinal_1(Thursday)).toBe(5)
    expect(toOrdinal_1(Friday)).toBe(6)
    expect(toOrdinal_1(Saturday)).toBe(7)
  })
})
