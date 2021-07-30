import describe from 'beartest-js'
import expect from 'expect'
import negate from './negate'

describe('negate', ({ it }) => {
  it('should negate duration', () => {
    expect(negate('P0Y')).toBe('P0Y')
    expect(negate('-P1Y')).toBe('P1Y')
    expect(negate('P1Y')).toBe('-P1Y')

    expect(negate('PT3H2M1S')).toBe('-PT3H2M1S')
    expect(negate('-PT3H2M1S')).toBe('PT3H2M1S')
    expect(negate('PT0S')).toBe('PT0S')
  })
})
