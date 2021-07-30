import describe from 'beartest-js'
import expect from 'expect'
import abs from './abs'

describe('abs', ({ it }) => {
  it('should get absolute value of duration', () => {
    expect(abs('P0Y')).toBe('P0Y')
    expect(abs('-P1Y')).toBe('P1Y')
    expect(abs('P1Y')).toBe('P1Y')

    expect(abs('P4Y3M2DT1H8M1.023S')).toBe('P4Y3M2DT1H8M1.023S')
    expect(abs('-P4Y3M2DT1H8M1.023S')).toBe('P4Y3M2DT1H8M1.023S')

    expect(abs('PT1H8M1.023S')).toBe('PT1H8M1.023S')
    expect(abs('-PT1H8M1.023S')).toBe('PT1H8M1.023S')
  })
})
