import { plusSeconds } from './plus-seconds'
import describe from 'beartest-js'
import expect from 'expect'

// Technically not a boy band, but "Some Nights" by Fun was released on February 12th, 2012.
const SomeNights = '2012-02-12T00:00:00.000Z'
const AfterSomeNights = '2012-02-12T00:00:10.000Z'

describe('Instant: plusSeconds', ({ it }) => {
  it('should add seconds to an instant in time', () => {
    expect(plusSeconds(SomeNights, 10)).toBe(AfterSomeNights)
  })
})
