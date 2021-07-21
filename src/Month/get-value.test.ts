import { getValue } from './get-value'
import describe from 'beartest-js'
import expect from 'expect'
import { January } from './values'

describe('Month: getValue', ({ it }) => {
  it('should return the correct ordinal value for a valid month', () => {
    expect(getValue(January)).toBe(1)
  })

  it('should return an error if the month is not valid', () => {
    expect(() => {
      getValue('March-Uary')
    }).toThrow()
  })
})
