import describe from 'beartest-js'
import expect from 'expect'
import getYear from './getYear'

describe('getYear', ({ it }) => {
  it('should get year', () => {
    expect(getYear('2021-01-01')).toBe(2021)
    expect(getYear('2019-01-01T00:00')).toBe(2019)
    expect(getYear('2000-01')).toBe(2000)
  })
})
