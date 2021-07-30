import describe from 'beartest-js'
import expect from 'expect'
import getSign from './getSign'

describe('getSign', ({ it }) => {
  it('should get sign of duration', () => {
    expect(getSign('P0Y')).toBe(0)
    expect(getSign('-P1Y')).toBe(-1)
    expect(getSign('P1Y')).toBe(1)

    expect(getSign('PT3H2M1S')).toBe(1)
    expect(getSign('-PT3H2M1S')).toBe(-1)
    expect(getSign('PT0S')).toBe(0)
  })
})
