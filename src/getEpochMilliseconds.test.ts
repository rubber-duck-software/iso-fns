import describe from 'beartest-js'
import expect from 'expect'
import getEpochMilliseconds from './getEpochMilliseconds'

describe('getEpochMilliseconds', ({ it }) => {
  it('should get epoch milliseconds', () => {
    expect(getEpochMilliseconds('2000-03-15T12:30:15.123Z')).toBe(953123415123)

    expect(getEpochMilliseconds('2000-01-01T00:00:00.000Z')).toBe(946684800000)

    expect(getEpochMilliseconds('1970-01-01T00:00:00.000Z')).toBe(0)
  })
})
