import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { Temporal } from 'temporal-polyfill'
import { monthDayFns } from '../../src/index.ts'

const { describe } = test
const it = test

describe('monthDayFns.isValid', () => {
  describe('valid', () => {
    for (const input of ['--01-01', '--02-29', '--04-30', '--12-31']) {
      it(`accepts ${input}`, () => {
        assert.ok(monthDayFns.isValid(input))
      })
    }
  })

  describe('invalid', () => {
    for (const input of ['--02-30', '--04-31', '--06-31', '--09-31', '--11-31']) {
      it(`rejects day beyond month length ${input}`, () => {
        assert.ok(!monthDayFns.isValid(input))
      })
    }
    for (const input of ['--13-01', '--00-01']) {
      it(`rejects out-of-range month ${input}`, () => {
        assert.ok(!monthDayFns.isValid(input))
      })
    }
    for (const input of ['--01-32', '--01-00']) {
      it(`rejects out-of-range day ${input}`, () => {
        assert.ok(!monthDayFns.isValid(input))
      })
    }
    for (const input of ['02-29', '-01-01']) {
      it(`rejects missing -- prefix ${input}`, () => {
        assert.ok(!monthDayFns.isValid(input))
      })
    }
    it('rejects non-padded --2-9', () => {
      assert.ok(!monthDayFns.isValid('--2-9'))
    })
    it('rejects trailing time --01-01T00:00', () => {
      assert.ok(!monthDayFns.isValid('--01-01T00:00'))
    })
    for (const input of [' --02-29', '--02-29 ']) {
      it(`rejects surrounding whitespace ${JSON.stringify(input)}`, () => {
        assert.ok(!monthDayFns.isValid(input))
      })
    }
    for (const input of [undefined, null, 12, {}, [], new Date(), Temporal.PlainMonthDay.from('--02-29')]) {
      it(`rejects non-string ${Object.prototype.toString.call(input)}`, () => {
        assert.ok(!monthDayFns.isValid(input as unknown as string))
      })
    }
  })
})
