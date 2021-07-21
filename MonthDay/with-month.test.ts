import { withMonth } from './with-month'
import describe from 'beartest-js'
import expect from 'expect'
import { January } from '../Month/values'

const MonthDay = '02-05'
const Month = January

describe('MonthDay: withMonth', ({ it }) => {
  it('should update the the month of a MonthDay', () => {
    expect(withMonth(MonthDay, Month)).toStrictEqual('01-05')
  })
})
