import describe from 'beartest-js'
import expect from 'expect'
import isoMonthDay from './isoMonthDay'

describe('isoMonthDay', ({ it }) => {
  it('should create valid monthDay', () => {
    expect(isoMonthDay()).toBeDefined()
    expect(isoMonthDay('2000-12-03')).toBe('--12-03')
    expect(isoMonthDay('2000-12-03T00:00:00.000')).toBe('--12-03')
    expect(isoMonthDay({ month: 12, day: 3 })).toBe('--12-03')
    expect(isoMonthDay('--12-03')).toBe('--12-03')
    expect(isoMonthDay(2, 29)).toBe('--02-29')
  })

  it('should throw error for invalid month day', () => {
    // @ts-ignore
    expect(() => isoMonthDay(2, 'invalid day')).toThrowError()
  })
})
