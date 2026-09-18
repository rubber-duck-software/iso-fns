import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { dateTimeFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('dateTimeFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['2020-01-01T12:30', '2020-02-29T00:00', '2020-12-31T23:59']) {
      it(`accepts minute precision ${input}`, () => {
        assert.ok(dateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30:01', '2020-01-01T12:30:00']) {
      it(`accepts second precision ${input}`, () => {
        assert.ok(dateTimeFns.isValid(input))
      })
    }
    for (const input of [
      '2020-01-01T12:30:01.1',
      '2020-01-01T12:30:01.01',
      '2020-01-01T12:30:01.001',
      '2020-01-01T12:30:01.0001',
      '2020-01-01T12:30:01.123456789'
    ]) {
      it(`accepts fraction of 1 through 9 digits ${input}`, () => {
        assert.ok(dateTimeFns.isValid(input))
      })
    }
    for (const input of [
      '2020-01-01T12:30:00.0',
      '2020-01-01T12:30:00.00',
      '2020-01-01T12:30:00.000',
      '2020-01-01T12:30:01.10',
      '2020-01-01T12:30:00.100'
    ]) {
      it(`accepts fraction with trailing zeros ${input}`, () => {
        assert.ok(dateTimeFns.isValid(input))
      })
    }
    for (const input of ['-271821-04-19T00:00:00.000000001', '+275760-09-13T23:59:59.999999999']) {
      it(`accepts Temporal range edge ${input}`, () => {
        assert.ok(dateTimeFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['2020-01-01T24:00', '2020-02-30T12:30', '2021-02-29T12:30']) {
      it(`rejects out-of-range component ${input}`, () => {
        assert.ok(!dateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T00:00:1', '2020-01-01T12', '2020-01-01']) {
      it(`rejects incomplete or non-padded ${input}`, () => {
        assert.ok(!dateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01 12:30', '2020-01-01t12:30']) {
      it(`rejects non-T separator ${input}`, () => {
        assert.ok(!dateTimeFns.isValid(input))
      })
    }
    for (const input of [
      '2020-01-01T12:30Z',
      '2020-01-01T12:30z',
      '2020-01-01T12:30+01:00',
      '2020-01-01T12:30[America/Chicago]'
    ]) {
      it(`rejects zone or offset suffix ${input}`, () => {
        assert.ok(!dateTimeFns.isValid(input))
      })
    }
    for (const input of ['-271821-04-19T00:00', '+275760-09-14T00:00']) {
      it(`rejects exact-midnight beyond Temporal range ${input}`, () => {
        assert.ok(!dateTimeFns.isValid(input))
      })
    }
    for (const input of [' 2020-01-01T12:30', '2020-01-01T12:30 ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!dateTimeFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.PlainDateTime.from('2020-01-01T12:30')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!dateTimeFns.isValid(input as unknown as string))
      })
    }
  })
})
