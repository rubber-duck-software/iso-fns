import { test } from 'beartest-js'
import { strict as assert } from 'node:assert'
import { yearMonthFns } from '../src/index.ts'

const { describe } = test
const it = test

describe('YearMonth', () => {
  describe('yearMonthFns.fromNumbers()', () => {
    it('constructs a YearMonth from year + month numbers', () => {
      assert.equal(yearMonthFns.fromNumbers(1976, 11), '1976-11')
    })
    it('throws if month argument is missing', () => {
      // @ts-expect-error testing runtime guard
      assert.throws(() => yearMonthFns.fromNumbers(1976), RangeError)
    })
    it('rejects invalid month', () => {
      assert.throws(() => yearMonthFns.fromNumbers(1976, 13), RangeError)
    })
  })

  describe('yearMonthFns.isValid()', () => {
    it('returns true for valid YearMonth strings', () => {
      assert.equal(yearMonthFns.isValid('2019-10'), true)
      assert.equal(yearMonthFns.isValid('1976-11'), true)
    })
    it('returns false for invalid strings', () => {
      assert.equal(yearMonthFns.isValid('2019-13'), false)
      assert.equal(yearMonthFns.isValid('2019-10-01'), false)
      assert.equal(yearMonthFns.isValid('19-10'), false)
      assert.equal(yearMonthFns.isValid('not-a-date'), false)
      assert.equal(yearMonthFns.isValid(''), false)
    })
    it('returns false for non-string values', () => {
      assert.equal(yearMonthFns.isValid(201910), false)
      assert.equal(yearMonthFns.isValid(null), false)
      assert.equal(yearMonthFns.isValid(undefined), false)
      assert.equal(yearMonthFns.isValid({ year: 2019, month: 10 }), false)
    })
  })

  describe('yearMonthFns.assertIsValid()', () => {
    it('does not throw for valid YearMonth', () => {
      yearMonthFns.assertIsValid('2019-10')
    })
    it('throws for invalid YearMonth', () => {
      assert.throws(() => yearMonthFns.assertIsValid('not-a-date'), TypeError)
      assert.throws(() => yearMonthFns.assertIsValid('2019-13'), TypeError)
    })
  })

  describe('yearMonthFns property accessors', () => {
    const ym = yearMonthFns.from('1976-11')
    it('getYear', () => assert.equal(yearMonthFns.getYear(ym), 1976))
    it('getMonth', () => assert.equal(yearMonthFns.getMonth(ym), 11))
    it('getDaysInMonth (30)', () => assert.equal(yearMonthFns.getDaysInMonth(ym), 30))
    it('getDaysInMonth for February in a leap year', () => {
      assert.equal(yearMonthFns.getDaysInMonth(yearMonthFns.from('2020-02')), 29)
    })
    it('getDaysInMonth for February in a non-leap year', () => {
      assert.equal(yearMonthFns.getDaysInMonth(yearMonthFns.from('2019-02')), 28)
    })
    it('getDaysInYear for leap year', () => {
      assert.equal(yearMonthFns.getDaysInYear(yearMonthFns.from('2020-02')), 366)
    })
    it('getDaysInYear for non-leap year', () => {
      assert.equal(yearMonthFns.getDaysInYear(yearMonthFns.from('2019-02')), 365)
    })
    it('inLeapYear', () => {
      assert.equal(yearMonthFns.inLeapYear(yearMonthFns.from('2020-02')), true)
      assert.equal(yearMonthFns.inLeapYear(yearMonthFns.from('2019-02')), false)
    })
  })

  describe('yearMonthFns.with()', () => {
    const ym = yearMonthFns.from('2019-10')
    it('replaces month', () => assert.equal(yearMonthFns.with(ym, { month: 5 }), '2019-05'))
    it('replaces year', () => assert.equal(yearMonthFns.with(ym, { year: 2023 }), '2023-10'))
    it('replaces both', () => assert.equal(yearMonthFns.with(ym, { year: 2023, month: 5 }), '2023-05'))
    it('respects overflow: reject', () => {
      assert.throws(() => yearMonthFns.with(ym, { month: 13 }, { overflow: 'reject' }), RangeError)
    })
    it('respects overflow: constrain (default)', () => {
      assert.equal(yearMonthFns.with(ym, { month: 13 }), '2019-12')
    })
  })

  describe('yearMonthFns.add()', () => {
    const ym = yearMonthFns.from('2019-11')
    it('adds months', () => assert.equal(yearMonthFns.add(ym, { months: 2 }), '2020-01'))
    it('adds years', () => assert.equal(yearMonthFns.add(ym, { years: 1 }), '2020-11'))
    it('adds mixed', () => assert.equal(yearMonthFns.add(ym, { years: 1, months: 2 }), '2021-01'))
    it('adds a Duration string', () => assert.equal(yearMonthFns.add(ym, 'P2M'), '2020-01'))
    it('promotes days via the calendar', () => {
      // 2019-11-01 + 365 days lands in October 2020
      assert.equal(yearMonthFns.add(ym, { days: 365 }), '2020-10')
    })
  })

  describe('yearMonthFns.subtract()', () => {
    const ym = yearMonthFns.from('2019-11')
    it('subtracts months', () => assert.equal(yearMonthFns.subtract(ym, { months: 2 }), '2019-09'))
    it('subtracts years', () => assert.equal(yearMonthFns.subtract(ym, { years: 1 }), '2018-11'))
    it('subtracts a Duration string', () => assert.equal(yearMonthFns.subtract(ym, 'P2M'), '2019-09'))
  })

  describe('yearMonthFns.until() / since()', () => {
    const start = yearMonthFns.from('2019-01')
    const end = yearMonthFns.from('2020-04')
    it('until returns positive duration when other is later', () => {
      assert.equal(yearMonthFns.until(start, end), 'P1Y3M')
    })
    it('since returns positive duration when other is earlier', () => {
      assert.equal(yearMonthFns.since(end, start), 'P1Y3M')
    })
    it('until returns negative duration when other is earlier', () => {
      assert.equal(yearMonthFns.until(end, start), '-P1Y3M')
    })
    it('honours largestUnit option', () => {
      assert.equal(yearMonthFns.until(start, end, { largestUnit: 'month' }), 'P15M')
    })
    it('until and since are negations of each other', () => {
      const a = yearMonthFns.from('2019-03')
      const b = yearMonthFns.from('2022-06')
      const until = yearMonthFns.until(a, b)
      const since = yearMonthFns.since(a, b)
      // The until duration from a→b should be the negation of the since duration from a→b
      assert.equal(until, 'P3Y3M')
      assert.equal(since, '-P3Y3M')
    })
  })

  describe('yearMonthFns.equals()', () => {
    const oct19 = yearMonthFns.from('2019-10')
    it('equal', () => assert.equal(yearMonthFns.equals(oct19, '2019-10'), true))
    it('unequal', () => assert.equal(yearMonthFns.equals(oct19, '2019-11'), false))
  })

  describe('yearMonthFns comparison methods', () => {
    const jan19 = yearMonthFns.from('2019-01')
    const jun19 = yearMonthFns.from('2019-06')
    const jun20 = yearMonthFns.from('2020-06')
    it('isBefore', () => {
      assert.equal(yearMonthFns.isBefore(jan19, jun19), true)
      assert.equal(yearMonthFns.isBefore(jun19, jan19), false)
      assert.equal(yearMonthFns.isBefore(jun19, jun19), false)
    })
    it('isAfter', () => {
      assert.equal(yearMonthFns.isAfter(jun20, jun19), true)
      assert.equal(yearMonthFns.isAfter(jun19, jun20), false)
      assert.equal(yearMonthFns.isAfter(jun19, jun19), false)
    })
    it('isEqualOrBefore', () => {
      assert.equal(yearMonthFns.isEqualOrBefore(jun19, jun19), true)
      assert.equal(yearMonthFns.isEqualOrBefore(jan19, jun19), true)
      assert.equal(yearMonthFns.isEqualOrBefore(jun20, jun19), false)
    })
    it('isEqualOrAfter', () => {
      assert.equal(yearMonthFns.isEqualOrAfter(jun19, jun19), true)
      assert.equal(yearMonthFns.isEqualOrAfter(jun20, jun19), true)
      assert.equal(yearMonthFns.isEqualOrAfter(jan19, jun19), false)
    })
  })

  describe('yearMonthFns.compare()', () => {
    it('returns 0 for equal', () => {
      assert.equal(yearMonthFns.compare('2019-06', '2019-06'), 0)
    })
    it('orders by year first', () => {
      assert.equal(yearMonthFns.compare('2019-06', '2020-01'), -1)
      assert.equal(yearMonthFns.compare('2020-01', '2019-06'), 1)
    })
    it('orders by month when years equal', () => {
      assert.equal(yearMonthFns.compare('2019-06', '2019-07'), -1)
      assert.equal(yearMonthFns.compare('2019-07', '2019-06'), 1)
    })
  })

  describe('yearMonthFns.toDate()', () => {
    it('combines with a day number to produce an Iso.Date', () => {
      assert.equal(yearMonthFns.toDate(yearMonthFns.from('2019-11'), 18), '2019-11-18')
    })
    it('throws if day is missing', () => {
      // @ts-expect-error testing runtime guard
      assert.throws(() => yearMonthFns.toDate(yearMonthFns.from('2019-11')), TypeError)
    })
  })

  describe('yearMonthFns.getFields()', () => {
    it('returns year and month', () => {
      const fields = yearMonthFns.getFields(yearMonthFns.from('1976-11'))
      assert.equal(fields.year, 1976)
      assert.equal(fields.month, 11)
    })
  })

  describe('yearMonthFns.from()', () => {
    it('parses ISO YearMonth strings', () => {
      assert.equal(yearMonthFns.from('2019-10'), '2019-10')
      assert.equal(yearMonthFns.from('1976-11'), '1976-11')
    })
    it('parses date strings and truncates to year-month', () => {
      assert.equal(yearMonthFns.from('2019-10-01'), '2019-10')
    })
    it('parses object input', () => {
      assert.equal(yearMonthFns.from({ year: 2019, month: 11 }), '2019-11')
    })
    it('throws for missing required fields', () => {
      assert.throws(() => yearMonthFns.from({ year: 2019 }), TypeError)
      assert.throws(() => yearMonthFns.from({ month: 6 }), TypeError)
      assert.throws(() => yearMonthFns.from({}), TypeError)
    })
    it('throws when required prop is undefined', () => {
      assert.throws(() => yearMonthFns.from({ year: undefined, month: 6 }), TypeError)
    })
    it('respects overflow: reject', () => {
      assert.throws(() => yearMonthFns.from({ year: 2019, month: 13 }, { overflow: 'reject' }), RangeError)
    })
    it('respects overflow: constrain (default)', () => {
      assert.equal(yearMonthFns.from({ year: 2019, month: 13 }), '2019-12')
    })
  })

  describe('yearMonthFns.format()', () => {
    const ym = yearMonthFns.from('2019-11')
    it('formats yyyy (zero-padded year)', () => assert.equal(yearMonthFns.format(ym, 'yyyy'), '2019'))
    it('formats MM (zero-padded month)', () => assert.equal(yearMonthFns.format(ym, 'MM'), '11'))
    it('formats MMMM (month name)', () => assert.equal(yearMonthFns.format(ym, 'MMMM'), 'November'))
    it('formats MMM (abbrev month)', () => assert.equal(yearMonthFns.format(ym, 'MMM'), 'Nov'))
    it('formats combined patterns', () => assert.equal(yearMonthFns.format(ym, 'MM/yyyy'), '11/2019'))
    it('accepts locale option', () => {
      assert.equal(yearMonthFns.format(ym, 'MMMM yyyy', { locale: 'en-US' }), 'November 2019')
    })
  })

  describe('yearMonthFns.chain()', () => {
    it('round-trips via value()', () => {
      assert.equal(yearMonthFns.chain('1976-11').value(), '1976-11')
    })
    it('exposes getters', () => {
      assert.equal(yearMonthFns.chain('1976-11').getYear().value(), 1976)
      assert.equal(yearMonthFns.chain('1976-11').getMonth().value(), 11)
    })
    it('supports add/subtract', () => {
      assert.equal(yearMonthFns.chain('2019-11').add({ months: 2 }).value(), '2020-01')
      assert.equal(yearMonthFns.chain('2019-11').subtract({ months: 2 }).value(), '2019-09')
    })
    it('supports with()', () => {
      assert.equal(yearMonthFns.chain('2019-11').with({ year: 2023 }).value(), '2023-11')
    })
    it('supports until()/since()', () => {
      assert.equal(yearMonthFns.chain('2019-01').until('2020-04').value(), 'P1Y3M')
      assert.equal(yearMonthFns.chain('2020-04').since('2019-01').value(), 'P1Y3M')
    })
    it('supports equals()', () => {
      assert.equal(yearMonthFns.chain('2019-10').equals('2019-10').value(), true)
      assert.equal(yearMonthFns.chain('2019-10').equals('2019-11').value(), false)
    })
    it('supports comparison methods', () => {
      assert.equal(yearMonthFns.chain('2019-01').isBefore('2020-01').value(), true)
      assert.equal(yearMonthFns.chain('2020-01').isAfter('2019-01').value(), true)
      assert.equal(yearMonthFns.chain('2019-01').isEqualOrBefore('2019-01').value(), true)
      assert.equal(yearMonthFns.chain('2019-01').isEqualOrAfter('2019-01').value(), true)
    })
    it('supports toDate()', () => {
      assert.equal(yearMonthFns.chain('2019-11').toDate(18).value(), '2019-11-18')
    })
    it('supports getFields()', () => {
      const fields = yearMonthFns.chain('1976-11').getFields().value()
      assert.equal(fields.year, 1976)
      assert.equal(fields.month, 11)
    })
    it('supports format()', () => {
      assert.equal(yearMonthFns.chain('2019-11').format('MM/yyyy').value(), '11/2019')
    })
    it('supports inLeapYear / getDaysInMonth / getDaysInYear', () => {
      assert.equal(yearMonthFns.chain('2020-02').inLeapYear().value(), true)
      assert.equal(yearMonthFns.chain('2020-02').getDaysInMonth().value(), 29)
      assert.equal(yearMonthFns.chain('2020-02').getDaysInYear().value(), 366)
    })
  })
})
