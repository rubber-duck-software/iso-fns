import { minusSeconds } from './minus-seconds'
import describe from 'beartest-js'
import expect from 'expect'

const NSYNC = '1995-01-01T00:00:00.000Z'
const BeforeNSYNC = '1994-12-31T23:59:50.000Z'

describe('Instant: minus-seconds', ({ it }) => {
  it('should remove an amount of seconds', () => {
    expect(expect(minusSeconds(NSYNC, 10)).toBe(BeforeNSYNC))
  })
})
