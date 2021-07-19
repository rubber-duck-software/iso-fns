import { plusYears } from './plus-years'
import describe from 'beartest-js'
import expect from 'expect'

// The first orbital test flight of the Space Shuttle took place exactly 20 years after the first human spaceflight
const Yuri = '1961-04-12'
const SpaceShuttle = '1981-04-12'

describe('LocalDate: plusYears', ({ it }) => {
  it('should add the correct number of years to a local date', () => {
    expect(plusYears(Yuri, 20)).toStrictEqual(SpaceShuttle)
  })
})
