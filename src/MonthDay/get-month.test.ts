import { getMonth } from './get-month'
import describe from 'beartest-js'
import expect from 'expect'
import { February } from '../Month/values'

const MonthDay = '02-05'

describe('MonthDay: getMonth', ({ it }) => {
  it('should get the month from a monthDay', () => {
    expect(getMonth(MonthDay)).toBe(February)
  })
})
