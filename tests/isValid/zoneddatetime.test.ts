import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { zonedDateTimeFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('zonedDateTimeFns.isValid', () => {
  describe('valid', () => {
    for (const input of [
      '2020-01-01T12:30-06:00[America/Chicago]',
      '2020-01-01T12:30:01-06:00[America/Chicago]',
      '2020-01-01T12:30:00-06:00[America/Chicago]',
      '2020-01-01T12:30:01.1-06:00[America/Chicago]',
      '2020-01-01T12:30:00.0-06:00[America/Chicago]',
      '2020-01-01T12:30:01.01-06:00[America/Chicago]',
      '2020-01-01T12:30:01.001-06:00[America/Chicago]',
      '2020-01-01T12:30:01.0001-06:00[America/Chicago]',
      '2020-01-01T12:30:00.100-06:00[America/Chicago]',
      '2020-01-01T12:30:01.123456789-06:00[America/Chicago]'
    ]) {
      it(`accepts precision variant ${input}`, () => {
        assert.ok(zonedDateTimeFns.isValid(input))
      })
    }
    it('accepts DST offset 2020-07-01T12:30-05:00[America/Chicago]', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-07-01T12:30-05:00[America/Chicago]'))
    })
    for (const input of [
      '2020-01-01T12:30+00:00[UTC]',
      '2020-01-01T12:30+00:00[Etc/UTC]',
      '2020-01-01T12:30-06:00[US/Central]',
      '2020-01-01T12:30+05:30[Asia/Kolkata]',
      '2020-01-01T12:30+05:45[Asia/Kathmandu]'
    ]) {
      it(`accepts named zone ${input}`, () => {
        assert.ok(zonedDateTimeFns.isValid(input))
      })
    }
    it('accepts offset zone 2020-01-01T12:30-06:00[-06:00]', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30-06:00[-06:00]'))
    })
    for (const input of ['2020-11-01T01:30-05:00[America/Chicago]', '2020-11-01T01:30-06:00[America/Chicago]']) {
      it(`accepts either offset in fall-back ambiguity ${input}`, () => {
        assert.ok(zonedDateTimeFns.isValid(input))
      })
    }
    it('accepts historical sub-minute offset rounded to minutes 1880-01-01T12:00-05:51[America/Chicago]', () => {
      assert.ok(zonedDateTimeFns.isValid('1880-01-01T12:00-05:51[America/Chicago]'))
    })
    it('accepts 1900-01-01T12:00-06:00[America/Chicago]', () => {
      assert.ok(zonedDateTimeFns.isValid('1900-01-01T12:00-06:00[America/Chicago]'))
    })
  })

  describe('invalid', () => {
    it('rejects standard offset during DST 2020-07-01T12:30-06:00[America/Chicago]', () => {
      assert.ok(!zonedDateTimeFns.isValid('2020-07-01T12:30-06:00[America/Chicago]'))
    })
    for (const input of ['2020-03-08T02:30-05:00[America/Chicago]', '2020-03-08T02:30-06:00[America/Chicago]']) {
      it(`rejects either offset in spring-forward gap ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    it('rejects mismatched offset zone 2020-01-01T12:30-06:00[+05:30]', () => {
      assert.ok(!zonedDateTimeFns.isValid('2020-01-01T12:30-06:00[+05:30]'))
    })
    for (const input of [
      '1900-01-01T12:00-05:50:36[America/Chicago]',
      '1900-01-01T12:00-05:51[America/Chicago]',
      '1880-01-01T12:00-05:50[America/Chicago]'
    ]) {
      it(`rejects wrong historical offset ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T00:00Z', '2020-01-01T12:30Z[UTC]']) {
      it(`rejects Z instead of numeric offset ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30-0600[America/Chicago]', '2020-01-01T12:30-06[America/Chicago]']) {
      it(`rejects non-hh:mm offset form ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30-06:00', '2020-01-01T12:30[America/Chicago]']) {
      it(`rejects missing offset or zone ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    for (const input of ['2020-01-01T12:30-06:00[america/chicago]', '2020-01-01T12:30-06:00[Nope/Zone]']) {
      it(`rejects unknown or lowercase zone ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    it('rejects trailing calendar annotation 2020-01-01T12:30-06:00[America/Chicago][u-ca=iso8601]', () => {
      assert.ok(!zonedDateTimeFns.isValid('2020-01-01T12:30-06:00[America/Chicago][u-ca=iso8601]'))
    })
    for (const input of [
      '2020-01-01T00:00:1-06:00[America/Chicago]',
      '2020-01-01t12:30-06:00[America/Chicago]',
      '2020-01-01T24:00-06:00[America/Chicago]',
      '2020-02-30T12:30-06:00[America/Chicago]'
    ]) {
      it(`rejects malformed or out-of-range date-time ${input}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    for (const input of [' 2020-01-01T12:30-06:00[America/Chicago]', '2020-01-01T12:30-06:00[America/Chicago] ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input))
      })
    }
    for (const input of [
      undefined,
      null,
      12,
      {},
      [],
      new Date(),
      Temporal.ZonedDateTime.from('2020-01-01T12:30-06:00[America/Chicago]')
    ]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!zonedDateTimeFns.isValid(input as unknown as string))
      })
    }
  })
})
