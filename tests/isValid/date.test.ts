import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { dateFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('dateFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['2020-01-01', '2020-02-29', '2000-02-29', '2020-12-31', '2020-04-30', '1969-07-24']) {
      it(`accepts ${input}`, () => {
        assert.ok(dateFns.isValid(input))
      })
    }
    for (const input of ['0000-01-01', '9999-12-31']) {
      it(`accepts four-digit year boundary ${input}`, () => {
        assert.ok(dateFns.isValid(input))
      })
    }
    for (const input of ['-000001-01-01', '+010000-01-01']) {
      it(`accepts signed six-digit year ${input}`, () => {
        assert.ok(dateFns.isValid(input))
      })
    }
    for (const input of ['-271821-04-19', '+275760-09-13']) {
      it(`accepts Temporal range limit ${input}`, () => {
        assert.ok(dateFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['2021-02-29', '1900-02-29', '2100-02-29']) {
      it(`rejects February 29 in non-leap year ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['2020-04-31', '2020-06-31', '2020-09-31', '2020-11-31']) {
      it(`rejects day 31 in a 30-day month ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['2020-13-01', '2020-00-10']) {
      it(`rejects out-of-range month ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['2020-01-00', '2020-01-32']) {
      it(`rejects out-of-range day ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['2020-1-01', '20200101']) {
      it(`rejects non-padded or compact form ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['+002020-01-01', '+000000-01-01', '-000000-01-01']) {
      it(`rejects non-canonical signed year ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['-271821-04-18', '+275760-09-14']) {
      it(`rejects beyond Temporal range ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T00:00', '2020-01-01[u-ca=iso8601]', '2020-02-29t']) {
      it(`rejects trailing time or annotation ${input}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of [' 2020-01-01', '2020-01-01 ', '2020-01-01\n']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!dateFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.PlainDate.from('2020-01-01')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!dateFns.isValid(input as unknown as string))
      })
    }
  })
})
