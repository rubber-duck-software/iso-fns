import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { monthDayFns } from '../src/index.ts'

const { describe } = test
const it = test

describe('MonthDay', () => {
  describe('monthDayFns.fromNumbers()', () => {
    it('constructs a MonthDay from month + day numbers', () => {
      assert.equal(monthDayFns.fromNumbers(11, 18), '--11-18')
    })
    it('throws if day argument is missing', () => {
      // @ts-expect-error testing runtime guard
      assert.throws(() => monthDayFns.fromNumbers(11), RangeError)
    })
  })

  describe('monthDayFns.isValid()', () => {
    it('returns true for valid MonthDay strings', () => {
      assert.equal(monthDayFns.isValid('--11-18'), true)
      assert.equal(monthDayFns.isValid('--02-29'), true)
    })
    it('returns false for invalid strings', () => {
      assert.equal(monthDayFns.isValid('11-18'), false)
      assert.equal(monthDayFns.isValid('2019-11-18'), false)
      assert.equal(monthDayFns.isValid('--13-01'), false)
      assert.equal(monthDayFns.isValid('--11-32'), false)
      assert.equal(monthDayFns.isValid('not-a-date'), false)
      assert.equal(monthDayFns.isValid(''), false)
    })
    it('returns false for non-string values', () => {
      assert.equal(monthDayFns.isValid(1118), false)
      assert.equal(monthDayFns.isValid(null), false)
      assert.equal(monthDayFns.isValid(undefined), false)
      assert.equal(monthDayFns.isValid({ month: 11, day: 18 }), false)
    })
  })

  describe('monthDayFns.assertIsValid()', () => {
    it('does not throw for valid MonthDay', () => {
      monthDayFns.assertIsValid('--11-18')
    })
    it('throws for invalid MonthDay', () => {
      assert.throws(() => monthDayFns.assertIsValid('not-a-date'), TypeError)
      assert.throws(() => monthDayFns.assertIsValid('--13-01'), TypeError)
    })
  })

  describe('monthDayFns.getMonth() / getDay()', () => {
    const md = monthDayFns.from('--11-18')
    it('reads month', () => assert.equal(monthDayFns.getMonth(md), 11))
    it('reads day', () => assert.equal(monthDayFns.getDay(md), 18))
  })

  describe('monthDayFns.with()', () => {
    const md = monthDayFns.from('--11-18')
    it('replaces month', () => assert.equal(monthDayFns.with(md, { month: 2 } as any), '--02-18'))
    it('replaces day', () => assert.equal(monthDayFns.with(md, { day: 5 } as any), '--11-05'))
    it('replaces both', () => assert.equal(monthDayFns.with(md, { month: 6, day: 1 }), '--06-01'))
    it('respects overflow: reject', () => {
      assert.throws(() => monthDayFns.with(md, { month: 2, day: 30 }, { overflow: 'reject' }), RangeError)
    })
    it('respects overflow: constrain (default)', () => {
      assert.equal(monthDayFns.with(md, { month: 2, day: 30 }), '--02-29')
    })
  })

  describe('monthDayFns.equals()', () => {
    const nov18 = monthDayFns.from('--11-18')
    it('equal', () => assert.equal(monthDayFns.equals(nov18, '--11-18'), true))
    it('unequal', () => assert.equal(monthDayFns.equals(nov18, '--11-19'), false))
    it('casts argument', () => {
      assert.equal(monthDayFns.equals(nov18, { month: 11, day: 18 } as any), true)
    })
  })

  describe('monthDayFns.compare()', () => {
    const jan01 = monthDayFns.from('--01-01')
    const jun15 = monthDayFns.from('--06-15')
    const jun16 = monthDayFns.from('--06-16')
    const dec31 = monthDayFns.from('--12-31')
    it('returns 0 for equal', () => assert.equal(monthDayFns.compare(jun15, '--06-15'), 0))
    it('orders by month first', () => {
      assert.equal(monthDayFns.compare(jan01, jun15), -1)
      assert.equal(monthDayFns.compare(dec31, jun15), 1)
    })
    it('orders by day when months equal', () => {
      assert.equal(monthDayFns.compare(jun15, jun16), -1)
      assert.equal(monthDayFns.compare(jun16, jun15), 1)
    })
  })

  describe('monthDayFns.toDate()', () => {
    it('produces a plain date with the given year', () => {
      const md = monthDayFns.from('--11-18')
      assert.equal(monthDayFns.toDate(md, 2021), '2021-11-18')
    })
    it('constrains Feb 29 to Feb 28 in non-leap years', () => {
      const leap = monthDayFns.from('--02-29')
      assert.equal(monthDayFns.toDate(leap, 2021), '2021-02-28')
    })
    it('works for Feb 29 in a leap year', () => {
      const leap = monthDayFns.from('--02-29')
      assert.equal(monthDayFns.toDate(leap, 2020), '2020-02-29')
    })
  })

  describe('monthDayFns.getFields()', () => {
    it('returns month and day', () => {
      const fields = monthDayFns.getFields(monthDayFns.from('--11-18'))
      assert.equal(fields.month, 11)
      assert.equal(fields.day, 18)
    })
  })

  describe('monthDayFns.from()', () => {
    it('parses ISO MonthDay strings', () => {
      assert.equal(monthDayFns.from('--11-18'), '--11-18')
    })
    it('parses date strings and truncates to month-day', () => {
      assert.equal(monthDayFns.from('2019-11-18'), '--11-18')
    })
    it('parses object input', () => {
      assert.equal(monthDayFns.from({ month: 11, day: 18 } as any), '--11-18')
    })
    it('respects overflow: reject', () => {
      assert.throws(() => monthDayFns.from({ month: 13, day: 1 } as any, { overflow: 'reject' }), RangeError)
    })
  })

  describe('monthDayFns.format()', () => {
    const md = monthDayFns.from('--11-18')
    it('formats MM (zero-padded month)', () => assert.equal(monthDayFns.format(md, 'MM'), '11'))
    it('formats dd (zero-padded day)', () => assert.equal(monthDayFns.format(md, 'dd'), '18'))
    it('formats combined patterns', () => assert.equal(monthDayFns.format(md, 'MM/dd'), '11/18'))
  })

  describe('monthDayFns.chain()', () => {
    it('round-trips via value()', () => {
      assert.equal(monthDayFns.chain('--11-18').value(), '--11-18')
    })
    it('exposes getters', () => {
      assert.equal(monthDayFns.chain('--11-18').getMonth().value(), 11)
      assert.equal(monthDayFns.chain('--11-18').getDay().value(), 18)
    })
    it('supports with()', () => {
      assert.equal(
        monthDayFns
          .chain('--11-18')
          .with({ day: 5 } as any)
          .value(),
        '--11-05'
      )
    })
    it('supports equals()', () => {
      assert.equal(monthDayFns.chain('--11-18').equals('--11-18').value(), true)
      assert.equal(monthDayFns.chain('--11-18').equals('--11-19').value(), false)
    })
    it('supports toDate()', () => {
      assert.equal(monthDayFns.chain('--11-18').toDate(2021).value(), '2021-11-18')
    })
    it('supports getFields()', () => {
      const fields = monthDayFns.chain('--11-18').getFields().value()
      assert.equal(fields.month, 11)
      assert.equal(fields.day, 18)
    })
    it('supports format()', () => {
      assert.equal(monthDayFns.chain('--11-18').format('MM/dd').value(), '11/18')
    })
  })
})
