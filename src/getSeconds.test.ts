import describe from 'beartest-js'
import expect from 'expect'
import getSeconds from './getSeconds'

describe('getSeconds', ({ it }) => {
  it('should get seconds', () => {
    expect(getSeconds('PT3S')).toBe(3)
    expect(getSeconds('P1D')).toBe(0)
  })
})
