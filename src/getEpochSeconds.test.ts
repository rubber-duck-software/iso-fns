import describe from 'beartest-js'
import expect from 'expect'
import getEpochSeconds from './getEpochSeconds'

describe('getEpochSeconds', ({ it }) => {
  it('should get epoch seconds', () => {
    expect(getEpochSeconds('2000-03-15T12:30:15.000Z')).toBe(953123415)

    expect(getEpochSeconds('2000-01-01T00:00:00.000Z')).toBe(946684800)

    expect(getEpochSeconds('1970-01-01T00:00:00.000Z')).toBe(0)
  })
})
