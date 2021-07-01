import describe from 'beartest-js'
import expect from 'expect'
import { isLeap } from './is-leap'

describe('Year:is-leap', ({ it }) => {
  it('every 4 years is a leap year', () => {
    expect(isLeap(2020)).toBe(true)
    expect(isLeap(2016)).toBe(true)
    expect(isLeap(2012)).toBe(true)
  })
})
