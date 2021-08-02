import describe from 'beartest-js'
import expect from 'expect'
import getMinute from './getMinute'

describe('getMinute', ({ it }) => {
  it('should get minute', () => {
    expect(getMinute('2021-01-01T19:30:00.000')).toBe(30)
    expect(getMinute('14:23')).toBe(23)
  })
})
