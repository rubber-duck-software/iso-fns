import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { timeFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('timeFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['00:00', '23:59', '12:30']) {
      it(`accepts minute precision ${input}`, () => {
        assert.ok(timeFns.isValid(input))
      })
    }
    for (const input of ['00:00:00', '12:30:01', '12:30:00', '23:59:59']) {
      it(`accepts second precision ${input}`, () => {
        assert.ok(timeFns.isValid(input))
      })
    }
    for (const input of [
      '12:30:01.1',
      '12:30:01.01',
      '12:30:01.001',
      '12:30:01.0001',
      '12:30:01.12345',
      '12:30:01.123456',
      '12:30:01.1234567',
      '12:30:01.12345678',
      '12:30:01.123456789'
    ]) {
      it(`accepts fraction of 1 through 9 digits ${input}`, () => {
        assert.ok(timeFns.isValid(input))
      })
    }
    for (const input of [
      '12:30:00.0',
      '12:30:01.10',
      '12:30:01.100',
      '12:30:00.000',
      '00:00:00.000',
      '12:30:01.000000000'
    ]) {
      it(`accepts fraction with trailing zeros ${input}`, () => {
        assert.ok(timeFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['24:00', '23:60', '23:59:60']) {
      it(`rejects out-of-range component ${input}`, () => {
        assert.ok(!timeFns.isValid(input))
      })
    }
    for (const input of ['12', '1230', '12:3', '12:30:1']) {
      it(`rejects incomplete or non-padded ${input}`, () => {
        assert.ok(!timeFns.isValid(input))
      })
    }
    for (const input of ['12:30:01.', '12:30:01.1234567890', '12:30:01,5']) {
      it(`rejects malformed fraction ${input}`, () => {
        assert.ok(!timeFns.isValid(input))
      })
    }
    for (const input of ['T12:30', '12:30Z', '12:30+01:00', '12:30:01.5Z']) {
      it(`rejects designator prefix or zone suffix ${input}`, () => {
        assert.ok(!timeFns.isValid(input))
      })
    }
    for (const input of [' 12:30', '12:30 ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!timeFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.PlainTime.from('12:30')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!timeFns.isValid(input as unknown as string))
      })
    }
  })
})
