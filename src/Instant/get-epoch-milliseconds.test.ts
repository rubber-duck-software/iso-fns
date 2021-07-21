import { getEpochMilliseconds } from './get-epoch-milliseconds'
import describe from 'beartest-js'
import expect from 'expect'

// "Sucker" by the Jonas Brothers was released on March 1st, 2019
const Sucker = '2019-03-01T00:00:00.000Z'
const SuckerMilli = 1551398400000

describe('Instant: getEpochMilliseconds', ({ it }) => {
  it('should convert an instant into milliseconds', () => {
    expect(getEpochMilliseconds(Sucker)).toBe(SuckerMilli)
  })
})
