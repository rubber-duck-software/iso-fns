import describe from 'beartest-js'
import expect from 'expect'
import isoTime from './isoTime'

describe('isoTime', ({ it }) => {
  it('should create valid time', () => {
    expect(isoTime()).toBeDefined()
    expect(isoTime('12:30:15.123')).toBe('12:30:15.123')
    expect(isoTime('2000-12-03T12:30:15.123')).toBe('12:30:15.123')
    expect(isoTime({ hour: 12, minute: 30, second: 15, millisecond: 123 })).toBe('12:30:15.123')
    expect(isoTime(12)).toBe('12:00:00.000')
    expect(isoTime(12, 30)).toBe('12:30:00.000')
    expect(isoTime(12, 30, 59, 999)).toBe('12:30:59.999')
  })
})
