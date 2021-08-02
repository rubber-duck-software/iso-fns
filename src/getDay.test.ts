import describe from 'beartest-js'
import expect from 'expect'
import getDay from './getDay'

describe('getDay', ({ it }) => {
  it('should get day', () => {
    expect(getDay('2021-01-01')).toBe(1)
    expect(getDay('2019-02-02T00:00')).toBe(2)
    expect(getDay('--03-03')).toBe(3)
  })
})
