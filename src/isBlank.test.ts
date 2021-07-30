import describe from 'beartest-js'
import expect from 'expect'
import isBlank from './isBlank'

describe('isBlank', ({ it }) => {
  it('should determine if duration is blank', () => {
    expect(isBlank('P0Y')).toBeTruthy()
    expect(isBlank('-P1Y')).toBeFalsy()
    expect(isBlank('P1Y')).toBeFalsy()

    expect(isBlank('PT3H2M1S')).toBeFalsy()
    expect(isBlank('-PT3H2M1S')).toBeFalsy()
    expect(isBlank('PT0S')).toBeTruthy()
  })
})
