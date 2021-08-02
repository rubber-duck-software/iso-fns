import describe from 'beartest-js'
import expect from 'expect'
import getSecond from './getSecond'

describe('getSecond', ({ it }) => {
  it('should get second', () => {
    expect(getSecond('2021-01-01T19:30:59.000')).toBe(59)
    expect(getSecond('14:23:15')).toBe(15)
  })
})
