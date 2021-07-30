import describe from 'beartest-js'
import expect from 'expect'
import fromEpochMilliseconds from './fromEpochMilliseconds'

describe('formEpochMilliseconds', ({ it }) => {
  it('should create instant from epoch milliseconds', () => {
    expect(fromEpochMilliseconds(953123415123)).toBe('2000-03-15T12:30:15.123Z')

    expect(fromEpochMilliseconds(946684800000)).toBe('2000-01-01T00:00:00.000Z')

    expect(fromEpochMilliseconds(0)).toBe('1970-01-01T00:00:00.000Z')
  })
})
