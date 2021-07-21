import { toOrdinal, toOrdinal_1 } from './to-ordinal'
import { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday } from './values'
import describe from 'beartest-js'
import expect from 'expect'

describe('DayOfWeek: to-ordinal-1', ({ it }) => {
  it('should return the correct ordinal from day-of-week assuming 0-indexing', () => {
    expect(toOrdinal(Sunday)).toBe(0)
    expect(toOrdinal(Saturday)).toBe(6)
  })

  it('should return the correct ordinal from day-of-week assuming 1-indexing', () => {
    expect(toOrdinal_1(Sunday)).toBe(1)
    expect(toOrdinal_1(Saturday)).toBe(7)
  })

  it('should throw a range error if an incorrect string is passed as a weekday', () => {
    expect(() => {
      toOrdinal('LaCroix')
    }).toThrow()
    expect(() => {
      toOrdinal_1('LaCroix')
    }).toThrow()
  })
})
