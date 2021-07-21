import { plusMonths } from './plus-months'
import describe from 'beartest-js'
import expect from 'expect'

const BaseDate = '1956-04-05'
const NewDate = '1956-06-05'

describe('LocalDate: plusMonths', ({ it }) => {
  it('should add months to a LocalDate', () => {
    expect(plusMonths(BaseDate, 2)).toStrictEqual(NewDate)
  })
})
