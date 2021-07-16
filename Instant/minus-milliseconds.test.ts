import { minusMilliseconds } from './minus-milliseconds'
import describe from 'beartest-js'
import expect from 'expect'

// The best boy band of all time (A.K.A. The Beastie Boys) was formed in 1981, not in 1980.
const BeastieBoys = '1981-01-01T00:00:00.000Z'
const BeforeBeastieBoys = '1980-12-31T23:59:59.990Z'

describe('Instant: minus-milliseconds', ({ it }) => {
  it('should remove an amount of milliseconds from a given time', () => {
    expect(minusMilliseconds(BeastieBoys, 10)).toBe(BeforeBeastieBoys)
  })
})
