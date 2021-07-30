import difference from './difference'
import describe from 'beartest-js'
import expect from 'expect'

describe('difference', ({ it }) => {
  it('should get difference between instants', () => {
    expect(difference('2000-01-01T12:30:15.123Z', '2000-01-01T14:45:15.123Z')).toBe('PT2H15M')
    expect(difference('1999-12-31T12:30:15.123Z', '2000-01-01T14:45:15.123Z')).toBe('PT26H15M')
  })

  it('should get difference between dateTime', () => {
    expect(difference('2000-01-01T12:30:15.123', '2000-01-01T14:45:15.123')).toBe('PT2H15M')
    expect(difference('1999-12-31T12:30:15.123', '2000-01-01T14:45:15.123')).toBe('P1DT2H15M')
  })

  it('should get difference between dates', () => {
    expect(difference('2000-01-01', '2000-01-01')).toBe('PT0S')
    expect(difference('1999-12-31', '2000-01-01')).toBe('P1D')
  })

  it('should get difference between times', () => {
    expect(difference('12:30:15.123', '14:45:15.123')).toBe('PT2H15M')
  })

  it('should get difference between yearMonths', () => {
    expect(difference('2000-01', '2001-05')).toBe('P1Y4M')
  })

  it('should throw with invalid input', () => {
    // @ts-ignore
    expect(() => difference('2000-01-01', '2001-05')).toThrowError()
  })
})
