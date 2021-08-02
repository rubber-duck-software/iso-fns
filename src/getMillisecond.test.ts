import describe from 'beartest-js'
import expect from 'expect'
import getMillisecond from './getMillisecond'

describe('getMilliSecond', ({ it }) => {
  it('should get millisecond', () => {
    expect(getMillisecond('2021-01-01T19:30:59.123')).toBe(123)
    expect(getMillisecond('14:23:15.153')).toBe(153)
  })
})
