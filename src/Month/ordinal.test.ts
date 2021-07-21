import { ordinal } from './ordinal'
import describe from 'beartest-js'
import expect from 'expect'
import { March } from './values'

describe('Month: ordinal', ({ it }) => {
  it('should return the correct month ordinal assuming 0-indexing', () => {
    expect(ordinal(March)).toBe(2)
  })

  it('should throw an error when an invalid month is supplied', () => {
    expect(() => {
      ordinal('March-uary')
    }).toThrow()
  })
})
