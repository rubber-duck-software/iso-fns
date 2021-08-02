import describe from 'beartest-js'
import expect from 'expect'
import getMilliseconds from './getMilliseconds'

describe('getMilliseconds', ({ it }) => {
  it('should get milliseconds', () => {
    expect(getMilliseconds('PT0.123S')).toBe(123)
    expect(getMilliseconds('P1D')).toBe(0)
  })
})
