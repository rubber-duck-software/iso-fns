import { ofMonthAndNumber } from './of-month-and-number'
import describe from 'beartest-js'
import expect from 'expect'
import { February } from '../Month/values'

const month = February
const day = 5

describe('MonthDay: ofMonthAndNumber', ({ it }) => {
  it('should create the correct monthDay from a month and day', () => {
    expect(ofMonthAndNumber(month, day)).toStrictEqual('02-05')
  })
})
