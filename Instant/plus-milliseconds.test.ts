import { plusMilliseconds } from './plus-milliseconds'
import describe from 'beartest-js'
import expect from 'expect'

// "I Want It That Way" by the Backstreet Boys was released on April 12, 1999
const IWantIt = '1999-04-12T00:00:00.000Z'
const AfterIWantIt = '1999-04-12T00:00:00.010Z'

describe('Instant: plusMilliseconds', ({ it }) => {
  it('should add the correct number of milliseconds to an instant in time', () => {
    expect(plusMilliseconds(IWantIt, 10)).toBe(AfterIWantIt)
  })
})
