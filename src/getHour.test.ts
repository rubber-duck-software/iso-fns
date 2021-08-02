import describe from 'beartest-js'
import expect from 'expect'
import getHour from './getHour'

describe('getHour', ({ it }) => {
  it('should get hour', () => {
    expect(getHour('2021-01-01T19:00:00.000')).toBe(19)
    expect(getHour('14:00')).toBe(14)
  })
})
