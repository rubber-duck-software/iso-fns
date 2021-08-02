import describe from 'beartest-js'
import expect from 'expect'
import getMonth from './getMonth'

describe('getMonth', ({ it }) => {
  it('should get month', () => {
    expect(getMonth('2021-01-01')).toBe(1)
    expect(getMonth('2019-02-01T00:00')).toBe(2)
    expect(getMonth('--03-01')).toBe(3)
    expect(getMonth('2021-04')).toBe(4)
  })
})
