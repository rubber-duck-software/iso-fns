import describe from 'beartest-js'
import expect from 'expect'
import getHours from './getHours'

describe('getHours', ({ it }) => {
  it('should get hours', () => {
    expect(getHours('PT3H')).toBe(3)
    expect(getHours('P1D')).toBe(0)
  })
})
