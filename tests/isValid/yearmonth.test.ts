import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { yearMonthFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('yearMonthFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['2020-02', '2020-01', '2020-12']) {
      it(`accepts ${input}`, () => {
        assert.ok(yearMonthFns.isValid(input))
      })
    }
    for (const input of ['0000-01', '9999-12']) {
      it(`accepts four-digit year boundary ${input}`, () => {
        assert.ok(yearMonthFns.isValid(input))
      })
    }
    for (const input of ['-000001-01', '+010000-01']) {
      it(`accepts signed six-digit year ${input}`, () => {
        assert.ok(yearMonthFns.isValid(input))
      })
    }
    for (const input of ['-271821-04', '+275760-09']) {
      it(`accepts Temporal range edge ${input}`, () => {
        assert.ok(yearMonthFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['2020-13', '2020-00']) {
      it(`rejects out-of-range month ${input}`, () => {
        assert.ok(!yearMonthFns.isValid(input))
      })
    }
    for (const input of ['2020-1', '202002']) {
      it(`rejects non-padded or compact form ${input}`, () => {
        assert.ok(!yearMonthFns.isValid(input))
      })
    }
    for (const input of ['2020-02-01', '2020-02T00:00']) {
      it(`rejects trailing day or time ${input}`, () => {
        assert.ok(!yearMonthFns.isValid(input))
      })
    }
    it('rejects non-canonical signed year +002020-01', () => {
      assert.ok(!yearMonthFns.isValid('+002020-01'))
    })
    for (const input of ['-271821-03', '+275760-10']) {
      it(`rejects beyond Temporal range ${input}`, () => {
        assert.ok(!yearMonthFns.isValid(input))
      })
    }
    for (const input of [' 2020-02', '2020-02 ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!yearMonthFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.PlainYearMonth.from('2020-02')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!yearMonthFns.isValid(input as unknown as string))
      })
    }
  })
})
