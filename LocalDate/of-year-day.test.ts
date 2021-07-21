import { ofYearDay } from './of-year-day'
import describe from 'beartest-js'
import expect from 'expect'

// Disneyland in California opened on July 17th, 1955. (198th day of the year)
const Disneyland = '1955-07-17'
const First = '2020-01-01'

describe('LocalDate: ofYearDay', ({ it }) => {
  it('should return the correct date for a given day of the year', () => {
    expect(ofYearDay(1955, 198)).toStrictEqual(Disneyland)
  })

  it('should return the first day of the year', () => {
    expect(ofYearDay(2020, 1)).toBe(First)
  })

  it('should throw an error if the day of year is 366 and the year is not a leap year', () => {
    expect(() => {
      ofYearDay(1987, 366)
    }).toThrow()
  })
})
