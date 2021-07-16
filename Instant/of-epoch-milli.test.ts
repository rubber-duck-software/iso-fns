import { ofEpochMilli } from './of-epoch-milli'
import describe from 'beartest-js'
import expect from 'expect'

// "It's Gonna be Me" by NSYNC was released on June 13, 2000
const ItsGonnaBeMilliSeconds = 960854400000
const ItsGonnaBeString = '2000-06-13T00:00:00.000Z'

describe('of-epoch-milli', ({ it }) => {
  it('should return the correct date from a given number of epoch seconds', () => {
    expect(ofEpochMilli(ItsGonnaBeMilliSeconds)).toStrictEqual(ItsGonnaBeString)
  })
})
