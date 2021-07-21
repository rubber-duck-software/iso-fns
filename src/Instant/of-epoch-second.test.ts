import { ofEpochSecond } from './of-epoch-second'
import describe from 'beartest-js'
import expect from 'expect'

// "Girls" by the Beastie Boys was released on November 15th, 1986
const GirlsSeconds = 532396800
const GirlsString = '1986-11-15T00:00:00.000Z'

describe('Instant: ofEpochSecond', ({ it }) => {
  it('should convert form epoch seconds to date-time string', () => {
    expect(ofEpochSecond(GirlsSeconds)).toBe(GirlsString)
  })
})
