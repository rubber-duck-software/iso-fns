import compare from './compare'
import describe from 'beartest-js'
import expect from 'expect'
import { IsoDate } from './iso-types'

// The Beatles were formed in 1962, whereas the Monkees were not formed until 1966.

const Beatles = '1962-01-01T00:00:00.000'
const Monkees = '1966-01-01T00:00:00.000'

describe('compare', ({ it }) => {
  it('should determine that two Instants are in ascending order', () => {
    expect(compare('1999-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z')).toBe(-1)
    expect(compare('2000-01-01T00:00:00.000Z', '1999-01-01T00:00:00.000Z')).toBe(1)
    expect(compare('2000-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z')).toBe(0)
  })

  it('should determine that two DateTimes are in ascending order', () => {
    expect(compare(Beatles, Monkees)).toBe(-1)
    expect(compare(Monkees, Beatles)).toBe(1)
    expect(compare(Beatles, Beatles)).toBe(0)
  })

  it('should determine that two Dates are in ascending order', () => {
    expect(compare('2020-01-01', '2020-01-02')).toBe(-1)
    expect(compare('2020-01-02', '2020-01-01')).toBe(1)
    expect(compare('2020-01-01', '2020-01-01')).toBe(0)

    const dates: IsoDate[] = ['2020-01-02', '2020-01-01', '2020-01-03']

    expect(dates.sort(compare)).toStrictEqual(['2020-01-01', '2020-01-02', '2020-01-03'])
  })

  it('should determine which duration is longer', () => {
    expect(compare('P1Y', 'P366D', { relativeTo: '2019-01-01' })).toBe(-1)
    expect(compare('P1Y', 'P365D', { relativeTo: '2020-01-01' })).toBe(1)
    expect(compare('P1Y', 'P366D', { relativeTo: '2020-01-01' })).toBe(0)
  })

  it('should throw error on invalid input', () => {
    // @ts-ignore
    expect(() => compare('2020-01-02', '2020-01-01T00:00:00.000')).toThrowError()
  })
})
