import describe from 'beartest-js'
import expect from 'expect'
import isoDate from './isoDate'

describe('isoDate', ({ it }) => {
  it('should create valid date', () => {
    expect(isoDate()).toBeDefined()
    expect(isoDate('2000-12-03')).toBe('2000-12-03')
    expect(isoDate('2000-12-03T00:00:00.000')).toBe('2000-12-03')
    expect(isoDate({ year: 2000, month: 12, day: 3 })).toBe('2000-12-03')
    expect(isoDate('12-03', 2000)).toBe('2000-12-03')
    expect(isoDate('2000-12', 3)).toBe('2000-12-03')
    expect(isoDate(2000, 12, 3)).toBe('2000-12-03')
  })

  it('should throw on invalid date', () => {
    // @ts-ignore
    expect(() => isoDate(1, 2, 3, 4)).toThrowError()
    expect(() => isoDate('invalid date')).toThrowError()
    // @ts-ignore
    expect(() => isoDate('invalid yearMonth', 3)).toThrowError()
  })
})
