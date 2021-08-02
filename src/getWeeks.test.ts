import describe from 'beartest-js'
import expect from 'expect'
import getWeeks from './getWeeks'

describe('getWeeks', ({ it }) => {
  it('should get weeks', () => {
    expect(getWeeks('P3W')).toBe(3)
    expect(getWeeks('PT3H')).toBe(0)
  })
})
