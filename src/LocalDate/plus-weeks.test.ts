import { plusWeeks } from './plus-weeks'
import describe from 'beartest-js'
import expect from 'expect'

// On July 19th, 1963, the first reusable, piloted spacecraft was launched.
// One week later, on July 26th, 1963, the first geosynchronous satellite was launched.
const Reuse = '1963-07-19'
const GeoSync = '1963-08-02'

describe('LocalDate: plusWeeks', ({ it }) => {
  it('should add a number of weeks to a local date', () => {
    expect(plusWeeks(Reuse, 2)).toStrictEqual(GeoSync)
  })
})
