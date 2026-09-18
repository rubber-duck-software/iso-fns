import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { durationFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('durationFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['P1D', 'P1W', 'P1M', 'PT1M', 'P99999999999D']) {
      it(`accepts single unit ${input}`, () => {
        assert.ok(durationFns.isValid(input))
      })
    }
    it('accepts canonical zero PT0S', () => {
      assert.ok(durationFns.isValid('PT0S'))
    })
    for (const input of ['PT1.5S', 'PT0.5S', 'PT1.123456789S', 'PT1.000000001S']) {
      it(`accepts fractional seconds ${input}`, () => {
        assert.ok(durationFns.isValid(input))
      })
    }
    for (const input of ['P1W1D', 'P1DT2H', 'P1DT1.5S', 'P1YT1S', 'PT1M1S', 'P1Y2M3W4DT5H6M7S', 'P1Y2M3W4DT5H6M7.5S']) {
      it(`accepts multiple units ${input}`, () => {
        assert.ok(durationFns.isValid(input))
      })
    }
    for (const input of ['PT36H', 'PT1H60M']) {
      it(`accepts unbalanced components ${input}`, () => {
        assert.ok(durationFns.isValid(input))
      })
    }
    for (const input of ['-P1D', '-P1Y2M3W4DT5H6M7.5S']) {
      it(`accepts negative ${input}`, () => {
        assert.ok(durationFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['P0D', 'PT0M', 'P0Y', 'P0DT0S', '-PT0S']) {
      it(`rejects non-canonical zero ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['P1Y0M', 'P0Y1M', 'PT1H0M', 'PT0H1M']) {
      it(`rejects zero component mixed with non-zero ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['PT00S', 'PT01S', 'P01D']) {
      it(`rejects leading zeros ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['PT1.50S', 'PT1.500S', 'PT1.500000000S']) {
      it(`rejects trailing fractional zeros ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['PT1.1234567890S', 'PT.5S', 'PT1,5S']) {
      it(`rejects malformed fraction ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['PT1.5M', 'PT1.5H', 'PT1.5H30M', 'P1.5D']) {
      it(`rejects fraction on non-second unit ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['+P1D', 'P', 'PT', 'P1DT', '1D', 'p1d']) {
      it(`rejects malformed designators ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of ['PT1S1M', 'P1D1Y', 'P1W1M']) {
      it(`rejects wrong unit order ${input}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of [' P1D', 'P1D ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!durationFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.Duration.from('P1D')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!durationFns.isValid(input as unknown as string))
      })
    }
  })
})
