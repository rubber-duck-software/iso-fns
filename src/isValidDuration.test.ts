import describe from 'beartest-js'
import expect from 'expect'
import isValidDuration from './isValidDuration'

describe('isValidDuration', ({ it }) => {
  it('should match valid durations', () => {
    expect(isValidDuration('P1Y1M1DT1H1M1.1S')).toBeTruthy()
    expect(isValidDuration('P40D')).toBeTruthy()
    expect(isValidDuration('P1Y1D')).toBeTruthy()
    expect(isValidDuration('P3DT4H59M')).toBeTruthy()
    expect(isValidDuration('PT2H30M')).toBeTruthy()
    expect(isValidDuration('P1M')).toBeTruthy()
    expect(isValidDuration('PT1M')).toBeTruthy()
    expect(isValidDuration('PT0.0021S')).toBeTruthy()
    expect(isValidDuration('PT0S')).toBeTruthy()
    expect(isValidDuration('P0D')).toBeTruthy()
    expect(isValidDuration('P1Y2M3W4DT5H6M7.987S')).toBeTruthy()
    expect(isValidDuration('P40D')).toBeTruthy()
    expect(isValidDuration('P1Y1D')).toBeTruthy()
    expect(isValidDuration('-P2DT12H')).toBeTruthy()
    expect(isValidDuration('P3DT6H50M')).toBeTruthy()
  })

  it('should not match invalid durations', () => {
    expect(isValidDuration('P3DT6H50MT6H50M')).toBeFalsy()
    expect(isValidDuration('P-40D')).toBeFalsy()
    expect(isValidDuration('invalid duration')).toBeFalsy()
    expect(isValidDuration(false)).toBeFalsy()
  })
})
