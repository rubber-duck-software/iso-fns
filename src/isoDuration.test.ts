import describe from 'beartest-js'
import isoDuration from './isoDuration'
import expect from 'expect'

describe('isoDuration', ({ it }) => {
  it('should create a duration from fields', () => {
    expect(
      isoDuration({
        years: 1,
        months: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        milliseconds: 100
      })
    ).toBe('P1Y1M1DT1H1M1.1S')
    expect(isoDuration({ days: 40 })).toBe('P40D')
    expect(isoDuration({ milliseconds: 22 })).toBe('PT0.022S')
    expect(isoDuration({ days: -2, hours: -12 })).toBe('-P2DT12H')
    expect(isoDuration(1)).toBe('P1Y')
    expect(isoDuration(1, 2, 3, 4, 5, 6, 7, 8)).toBe('P1Y2M3W4DT5H6M7.008S')
  })
})
