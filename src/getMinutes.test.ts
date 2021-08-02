import describe from 'beartest-js'
import expect from 'expect'
import getMinutes from './getMinutes'

describe('getMinutes', ({ it }) => {
  it('should get minutes', () => {
    expect(getMinutes('PT3M')).toBe(3)
    expect(getMinutes('P1D')).toBe(0)
  })
})
