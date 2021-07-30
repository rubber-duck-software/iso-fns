import describe from 'beartest-js'
import expect from 'expect'
import total from './total'

describe('total', ({ it }) => {
  it('should total duration in years', () => {
    expect(total('PT8784H', { unit: 'years', relativeTo: '2020-01-01' })).toBe(1)
  })

  it('should total duration in years', () => {
    expect(total('PT126230400S', { unit: 'years', relativeTo: '2020-01-01' })).toBe(4)
  })

  it('should total duration in months', () => {
    expect(total('PT744H', { unit: 'months', relativeTo: '2020-01-01' })).toBe(1)
  })

  it('should total duration in months', () => {
    expect(total('PT31622400S', { unit: 'months', relativeTo: '2020-01-01' })).toBe(12)
  })

  it('should total duration in weeks', () => {
    expect(total('PT744H', { unit: 'weeks', relativeTo: '2020-01-01' })).toBe(4 + 3 / 7)
  })
  it('should total duration in days', () => {
    expect(total('PT14400M', { unit: 'days' })).toBe(10)
  })
  it('should total duration in hours', () => {
    expect(total('PT5400S', { unit: 'hours' })).toBe(1.5)
  })
  it('should total duration in minutes', () => {
    expect(total('P1W', { unit: 'minutes', relativeTo: '2020-01-01' })).toBe(10080)
  })
  it('should total duration in seconds', () => {
    expect(total('P1M', { unit: 'seconds', relativeTo: '2020-02-01' })).toBe(2505600)
  })

  it('should total negative duration in seconds', () => {
    expect(total('-P1M', { unit: 'seconds', relativeTo: '2020-03-01' })).toBe(-2505600)
  })
})
