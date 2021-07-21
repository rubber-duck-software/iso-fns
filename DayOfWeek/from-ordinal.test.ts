import { fromOrdinal, fromOrdinal_1 } from './from-ordinal'
import describe from 'beartest-js'
import expect from 'expect'

// Because from-ordinal-1 relies on the underlying from-ordinal function, we only need one test file to test both functions

describe('DayOfWeek: from-ordinal-1', ({ it }) => {
  it('should return the correct day-of-week from ordinal assuming 0-indexing', () => {
    expect(fromOrdinal(0)).toStrictEqual('Sunday')
    expect(fromOrdinal(1)).toStrictEqual('Monday')
    expect(fromOrdinal(2)).toStrictEqual('Tuesday')
    expect(fromOrdinal(3)).toStrictEqual('Wednesday')
    expect(fromOrdinal(4)).toStrictEqual('Thursday')
    expect(fromOrdinal(5)).toStrictEqual('Friday')
    expect(fromOrdinal(6)).toStrictEqual('Saturday')
  })

  it('should return the correct day-of-week from ordinal assuming 1-indexing', () => {
    expect(fromOrdinal_1(1)).toStrictEqual('Sunday')
    expect(fromOrdinal_1(2)).toStrictEqual('Monday')
    expect(fromOrdinal_1(3)).toStrictEqual('Tuesday')
    expect(fromOrdinal_1(4)).toStrictEqual('Wednesday')
    expect(fromOrdinal_1(5)).toStrictEqual('Thursday')
    expect(fromOrdinal_1(6)).toStrictEqual('Friday')
    expect(fromOrdinal_1(7)).toStrictEqual('Saturday')
  })

  it('should throw error when invalid ordinal is passed', () => {
    expect(() => {
      fromOrdinal_1(9)
    }).toThrow()
  })
})
