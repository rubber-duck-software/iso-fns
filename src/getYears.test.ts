import describe from 'beartest-js'
import expect from 'expect'
import getYears from './getYears'

describe('getYears', ({ it }) => {
  it('should get years', () => {
    expect(getYears('P3Y')).toBe(3)
    expect(getYears('PT3H')).toBe(0)
  })
})
