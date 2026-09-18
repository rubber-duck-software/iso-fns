import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { instantFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('instantFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['2020-01-01T12:30Z', '2020-02-29T12:30Z']) {
      it(`accepts minute precision ${input}`, () => {
        assert.ok(instantFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30:01Z', '2020-01-01T12:30:00Z']) {
      it(`accepts second precision ${input}`, () => {
        assert.ok(instantFns.isValid(input))
      })
    }
    for (const input of [
      '2020-01-01T12:30:01.1Z',
      '2020-01-01T12:30:01.001Z',
      '2020-01-01T12:30:01.0001Z',
      '2020-01-01T12:30:01.123456789Z'
    ]) {
      it(`accepts fraction of 1 through 9 digits ${input}`, () => {
        assert.ok(instantFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30:00.0Z', '2020-01-01T12:30:00.000Z', '2020-01-01T12:30:00.100Z']) {
      it(`accepts fraction with trailing zeros ${input}`, () => {
        assert.ok(instantFns.isValid(input))
      })
    }
    for (const input of ['-271821-04-20T00:00Z', '+275760-09-13T00:00Z', '+275760-09-13T00:00:00.000Z']) {
      it(`accepts Temporal range edge ${input}`, () => {
        assert.ok(instantFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['2020-01-01T12:30z', '2020-01-01t12:30Z']) {
      it(`rejects lowercase designator ${input}`, () => {
        assert.ok(!instantFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30+00:00', '2020-01-01T12:30-06:00']) {
      it(`rejects numeric offset instead of Z ${input}`, () => {
        assert.ok(!instantFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30', '2020-01-01T12:30Z[UTC]']) {
      it(`rejects missing Z or trailing annotation ${input}`, () => {
        assert.ok(!instantFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01 12:30Z', '2020-01-01T24:00Z', '2020-02-30T12:30Z']) {
      it(`rejects malformed or out-of-range date-time ${input}`, () => {
        assert.ok(!instantFns.isValid(input))
      })
    }
    for (const input of ['-271821-04-19T23:59:59.999999999Z', '+275760-09-13T00:00:00.000000001Z']) {
      it(`rejects beyond Temporal range ${input}`, () => {
        assert.ok(!instantFns.isValid(input))
      })
    }
    for (const input of [' 2020-01-01T12:30Z', '2020-01-01T12:30Z ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!instantFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.Instant.from('2020-01-01T12:30Z')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!instantFns.isValid(input as unknown as string))
      })
    }
  })
})
