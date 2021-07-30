import describe from 'beartest-js'
import expect from 'expect'
import round from './round'

describe('round', ({ it }) => {
  it('should round time to rounding increment', () => {
    expect(round('12:23', { smallestUnit: 'minute', roundingIncrement: 15 })).toBe('12:30:00.000')
    expect(round('12:30', { smallestUnit: 'minute', roundingIncrement: 15 })).toBe('12:30:00.000')

    expect(round('12:22', { smallestUnit: 'minute', roundingIncrement: 5 })).toBe('12:20:00.000')

    expect(round('12:22', { smallestUnit: 'hour', roundingIncrement: 1 })).toBe('12:00:00.000')

    expect(round('12:20:30', { smallestUnit: 'minute', roundingIncrement: 1 })).toBe('12:21:00.000')

    expect(round('00:00:00.123', { smallestUnit: 'second', roundingIncrement: 1 })).toBe('00:00:00.000')
    expect(round('00:00:00.123', { smallestUnit: 'second', roundingIncrement: 1, roundingMode: 'ceil' })).toBe(
      '00:00:01.000'
    )

    // @ts-ignore
    expect(() => round('12:22', { smallestUnit: 'unknown' })).toThrowError()
  })

  it('should round instant to rounding increment', () => {
    expect(round('2000-01-01T12:30:00.000Z', { smallestUnit: 'hour', roundingIncrement: 1 })).toBe(
      '2000-01-01T13:00:00.000Z'
    )
    expect(round('2000-01-01T12:32:30.001Z', { smallestUnit: 'minute', roundingIncrement: 5 })).toBe(
      '2000-01-01T12:35:00.000Z'
    )
    expect(round('2000-01-01T12:32:30.001Z', { smallestUnit: 'second', roundingIncrement: 1 })).toBe(
      '2000-01-01T12:32:30.000Z'
    )
    expect(round('2000-01-01T12:32:30.055Z', { smallestUnit: 'millisecond', roundingIncrement: 10 })).toBe(
      '2000-01-01T12:32:30.060Z'
    )
  })

  it('should round dateTime to rounding increment', () => {
    expect(round('2000-01-01T12:30:00.000', { smallestUnit: 'day', roundingIncrement: 1 })).toBe('2000-01-02T00:00:00.000')
    expect(round('2000-01-01T12:30:00.000', { smallestUnit: 'hour', roundingIncrement: 1 })).toBe('2000-01-01T13:00:00.000')
    expect(round('2000-01-01T12:32:30.001', { smallestUnit: 'minute', roundingIncrement: 5 })).toBe(
      '2000-01-01T12:35:00.000'
    )
    expect(round('2000-01-01T12:32:30.001', { smallestUnit: 'second', roundingIncrement: 1 })).toBe(
      '2000-01-01T12:32:30.000'
    )
    expect(round('2000-01-01T12:32:30.055', { smallestUnit: 'millisecond', roundingIncrement: 10 })).toBe(
      '2000-01-01T12:32:30.060'
    )
  })

  it('should round duration to rounding increment', () => {
    expect(round('PT8784H', { smallestUnit: 'hour', roundingIncrement: 100, relativeTo: '2020-01-01' })).toBe('PT8800H')
    expect(round('PT8784H', { smallestUnit: 'day' })).toBe('P366D')
    expect(round('P4Y', { largestUnit: 'day', relativeTo: '2020-01-01' })).toBe('P1461D')
    expect(round('PT13523.354S', { smallestUnit: 'hour' })).toBe('PT4H')
    expect(round('PT13523.354S', { smallestUnit: 'minute' })).toBe('PT225M')
    expect(round('PT13523.354S', { smallestUnit: 'second' })).toBe('PT13523S')

    expect(round('P1461D', { smallestUnit: 'year', relativeTo: '2020-01-01' })).toBe('P4Y')
    expect(round('P1Y', { largestUnit: 'week', relativeTo: '2020-01-01' })).toBe('P52W2D')
    expect(round('P21D', { smallestUnit: 'week' })).toBe('P3W')

    expect(round('P20D', { smallestUnit: 'week', roundingMode: 'floor' })).toBe('P2W')
    expect(round('-P20D', { smallestUnit: 'week', roundingMode: 'floor' })).toBe('-P3W')
    expect(round('P20D', { smallestUnit: 'week', roundingMode: 'trunc' })).toBe('P2W')
    expect(round('-P20D', { smallestUnit: 'week', roundingMode: 'trunc' })).toBe('-P2W')
    expect(round('P15D', { smallestUnit: 'week', roundingMode: 'ceil' })).toBe('P3W')

    expect(round('P52W', { smallestUnit: 'year', relativeTo: '2020-01-01' })).toBe('P1Y')

    expect(round('P6M', { largestUnit: 'day', relativeTo: '2020-01-01' })).toBe('P182D')

    // @ts-ignore
    expect(() => round('P3D', { smallestUnit: 'unknown' })).toThrowError()
    expect(() => round('P3D', { smallestUnit: 'year' })).toThrowError()
    expect(() => round('P3D', { smallestUnit: 'month' })).toThrowError()
  })
})
