import describe from 'beartest-js'
import expect from 'expect'
import isoDateTime from './isoDateTime'

describe('isoDateTime', ({ it }) => {
  it('should create valid dateTime', () => {
    expect(isoDateTime()).toBeDefined()
    expect(
      isoDateTime({
        year: 2000,
        month: 12,
        day: 3,
        hour: 12,
        minute: 30,
        second: 15,
        millisecond: 123
      })
    ).toBe('2000-12-03T12:30:15.123')
    expect(isoDateTime('2000-12-03T12:30:15.123')).toBe('2000-12-03T12:30:15.123')

    expect(isoDateTime({ year: 2000, month: 12, day: 3 }, { hour: 12, minute: 30, second: 15, millisecond: 123 })).toBe(
      '2000-12-03T12:30:15.123'
    )
    expect(isoDateTime('2000-12-03', { hour: 12, minute: 30, second: 15, millisecond: 123 })).toBe('2000-12-03T12:30:15.123')
    expect(isoDateTime('2000-12-03')).toBe('2000-12-03T00:00:00.000')
    expect(isoDateTime({ year: 2000, month: 12, day: 3 }, '12:30:15.123')).toBe('2000-12-03T12:30:15.123')
    expect(isoDateTime('2000-12-03', '12:30:15.123')).toBe('2000-12-03T12:30:15.123')

    expect(isoDateTime(2020, 3, 2)).toBe('2020-03-02T00:00:00.000')
  })
})
