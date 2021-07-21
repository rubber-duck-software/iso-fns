import { getEpochSecond } from './get-epoch-second'
import describe from 'beartest-js'
import expect from 'expect'

// The Jonas Brothers' band was formed in 2005
const JonasString = '2005-01-01T00:00:00.000Z'
const JonasSeconds = 1104537600

describe('Instant: getEpochSecond', ({ it }) =>
  it('should convert from an instant in time to epoch seconds', () => {
    expect(getEpochSecond(JonasString)).toBe(JonasSeconds)
  }))
