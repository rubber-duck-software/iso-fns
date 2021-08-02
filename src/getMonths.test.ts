import describe from 'beartest-js'
import expect from 'expect'
import getMonths from './getMonths'

describe('getMonths', ({ it }) => {
  it('should get months', () => {
    expect(getMonths('P3M')).toBe(3)
    expect(getMonths('PT3H')).toBe(0)
  })
})
