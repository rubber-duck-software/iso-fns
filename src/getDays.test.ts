import describe from 'beartest-js'
import expect from 'expect'
import getDays from './getDays'

describe('getDays', ({ it }) => {
  it('should get days', () => {
    expect(getDays('P3D')).toBe(3)
    expect(getDays('PT3H')).toBe(0)
  })
})
