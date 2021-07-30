import describe from 'beartest-js'
import expect from 'expect'
import isoInstant from './isoInstant'

describe('isoInstant', ({ it }) => {
  it('should create valid instant', () => {
    expect(isoInstant()).toBeDefined()
    expect(isoInstant('2000-12-03T12:30:15.123Z')).toBe('2000-12-03T12:30:15.123Z')
    expect(isoInstant(0)).toBe('1970-01-01T00:00:00.000Z')
  })
})
