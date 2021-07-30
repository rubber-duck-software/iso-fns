import describe from 'beartest-js'
import expect from 'expect'
import fromEpochSeconds from './fromEpochSeconds'

describe('fromEpochSeconds', ({ it }) => {
  it('should create instant from epoch seconds', () => {
    expect(fromEpochSeconds(953123415)).toBe('2000-03-15T12:30:15.000Z')

    expect(fromEpochSeconds(946684800)).toBe('2000-01-01T00:00:00.000Z')

    expect(fromEpochSeconds(0)).toBe('1970-01-01T00:00:00.000Z')
  })
})
