import { describe, it } from 'beartest-js'
import { strict as assert } from 'assert'
import { dateFns, durationFns } from './index'

describe('Date', () => {
  describe('date.until() works', () => {
    const date = dateFns.fromNumbers(1969, 7, 24)
    it('takes days per month into account', () => {
      const date1 = dateFns.from('2019-01-01')
      const date2 = dateFns.from('2019-02-01')
      const date3 = dateFns.from('2019-03-01')
      assert.equal(dateFns.until(date1, date2), 'P31D')
      assert.equal(dateFns.until(date2, date3), 'P28D')
      const date4 = dateFns.from('2020-02-01')
      const date5 = dateFns.from('2020-03-01')
      assert.equal(dateFns.until(date4, date5), 'P29D')
    })
    it('takes days per year into account', () => {
      const date1 = dateFns.from('2019-01-01')
      const date2 = dateFns.from('2019-06-01')
      const date3 = dateFns.from('2020-01-01')
      const date4 = dateFns.from('2020-06-01')
      const date5 = dateFns.from('2021-01-01')
      const date6 = dateFns.from('2021-06-01')
      assert.equal(dateFns.until(date1, date3), 'P365D')
      assert.equal(dateFns.until(date3, date5), 'P366D')
      assert.equal(dateFns.until(date2, date4), 'P366D')
      assert.equal(dateFns.until(date4, date6), 'P365D')
    })
    it('weeks and months are mutually exclusive', () => {
      const laterDate = dateFns.add(date, { days: 42 })
      const weeksDifference = dateFns.chain(date).until(laterDate, { largestUnit: 'weeks' }).getFields().value()
      assert.notEqual(weeksDifference.weeks, 0)
      assert.equal(weeksDifference.months, 0)
      const monthsDifference = dateFns.chain(date).until(laterDate, { largestUnit: 'months' }).getFields().value()
      assert.equal(monthsDifference.weeks, 0)
      assert.notEqual(monthsDifference.months, 0)
    })
    const earlier = dateFns.from('2019-01-08')
    const later = dateFns.from('2021-09-07')
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      assert.equal(dateFns.until(earlier, later, { smallestUnit: 'years', roundingMode: 'halfExpand' }), 'P3Y')
      assert.equal(dateFns.until(earlier, later, { smallestUnit: 'months', roundingMode: 'halfExpand' }), 'P32M')
      assert.equal(dateFns.until(earlier, later, { smallestUnit: 'weeks', roundingMode: 'halfExpand' }), 'P139W')
    })
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ] as const
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      it(`rounds to nearest ${smallestUnit}`, () => {
        assert.equal(dateFns.until(earlier, later, { smallestUnit, roundingMode }), expected)
        assert.equal(dateFns.until(later, earlier, { smallestUnit, roundingMode }), `-${expected}`)
      })
    })
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ] as const
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      it(`rounds up to ${smallestUnit}`, () => {
        assert.equal(dateFns.until(earlier, later, { smallestUnit, roundingMode }), expectedPositive)
        assert.equal(dateFns.until(later, earlier, { smallestUnit, roundingMode }), expectedNegative)
      })
    })
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ] as const
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      it(`rounds down to ${smallestUnit}`, () => {
        assert.equal(dateFns.until(earlier, later, { smallestUnit, roundingMode }), expectedPositive)
        assert.equal(dateFns.until(later, earlier, { smallestUnit, roundingMode }), expectedNegative)
      })
    })
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ] as const
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(dateFns.until(earlier, later, { smallestUnit, roundingMode }), expected)
        assert.equal(dateFns.until(later, earlier, { smallestUnit, roundingMode }), `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(dateFns.until(earlier, later, { smallestUnit: 'years' }), 'P2Y')
      assert.equal(dateFns.until(later, earlier, { smallestUnit: 'years' }), '-P2Y')
    })
    it('rounds to an increment of years', () => {
      assert.equal(
        dateFns.until(earlier, later, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' }),
        'P4Y'
      )
    })
    it('rounds to an increment of months', () => {
      assert.equal(
        dateFns.until(earlier, later, { smallestUnit: 'months', roundingIncrement: 10, roundingMode: 'halfExpand' }),
        'P30M'
      )
    })
    it('rounds to an increment of weeks', () => {
      assert.equal(
        dateFns.until(earlier, later, { smallestUnit: 'weeks', roundingIncrement: 12, roundingMode: 'halfExpand' }),
        'P144W'
      )
    })
    it('rounds to an increment of days', () => {
      assert.equal(
        dateFns.until(earlier, later, { smallestUnit: 'days', roundingIncrement: 100, roundingMode: 'halfExpand' }),
        'P1000D'
      )
    })
    it('rounds relative to the receiver', () => {
      const date1 = dateFns.from('2019-01-01')
      const date2 = dateFns.from('2019-02-15')
      assert.equal(dateFns.until(date1, date2, { smallestUnit: 'months', roundingMode: 'halfExpand' }), 'P2M')
      assert.equal(dateFns.until(date2, date1, { smallestUnit: 'months', roundingMode: 'halfExpand' }), '-P1M')
    })
  })
  describe('order of operations in until - TODO: add since', () => {
    const cases = [
      ['2019-03-01', '2019-01-29', 'P1M1D'],
      ['2019-01-29', '2019-03-01', '-P1M3D'],
      ['2019-03-29', '2019-01-30', 'P1M29D'],
      ['2019-01-30', '2019-03-29', '-P1M29D'],
      ['2019-03-30', '2019-01-31', 'P1M30D'],
      ['2019-01-31', '2019-03-30', '-P1M28D'],
      ['2019-03-31', '2019-01-31', 'P2M'],
      ['2019-01-31', '2019-03-31', '-P2M']
    ] as const
    for (const [end, start, expected] of cases) {
      it(`${start} until ${end} => ${expected}`, () => {
        const result = dateFns.until(start, end, { largestUnit: 'months' })
        assert.equal(result.toString(), expected)
      })
    }
  })
  describe('date.since() works', () => {
    const date = dateFns.fromNumbers(1976, 11, 18)
    it('takes days per month into account', () => {
      const date1 = dateFns.from('2019-01-01')
      const date2 = dateFns.from('2019-02-01')
      const date3 = dateFns.from('2019-03-01')
      assert.equal(dateFns.since(date2, date1), 'P31D')
      assert.equal(dateFns.since(date3, date2), 'P28D')

      const date4 = dateFns.from('2020-02-01')
      const date5 = dateFns.from('2020-03-01')
      assert.equal(dateFns.since(date5, date4), 'P29D')
    })
    it('takes days per year into account', () => {
      const date1 = dateFns.from('2019-01-01')
      const date2 = dateFns.from('2019-06-01')
      const date3 = dateFns.from('2020-01-01')
      const date4 = dateFns.from('2020-06-01')
      const date5 = dateFns.from('2021-01-01')
      const date6 = dateFns.from('2021-06-01')
      assert.equal(dateFns.since(date3, date1), 'P365D')
      assert.equal(dateFns.since(date5, date3), 'P366D')
      assert.equal(dateFns.since(date4, date2), 'P366D')
      assert.equal(dateFns.since(date6, date4), 'P365D')
    })
    it('weeks and months are mutually exclusive', () => {
      const laterDate = dateFns.add(date, { days: 42 })
      const weeksDifference = dateFns.chain(laterDate).since(date, { largestUnit: 'weeks' }).getFields().value()
      assert.notEqual(weeksDifference.weeks, 0)
      assert.equal(weeksDifference.months, 0)
      const monthsDifference = dateFns.chain(laterDate).since(date, { largestUnit: 'months' }).getFields().value()
      assert.equal(monthsDifference.weeks, 0)
      assert.notEqual(monthsDifference.months, 0)
    })
    const earlier = dateFns.from('2019-01-08')
    const later = dateFns.from('2021-09-07')
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      assert.equal(dateFns.since(later, earlier, { smallestUnit: 'years', roundingMode: 'halfExpand' }), 'P3Y')
      assert.equal(dateFns.since(later, earlier, { smallestUnit: 'months', roundingMode: 'halfExpand' }), 'P32M')
      assert.equal(dateFns.since(later, earlier, { smallestUnit: 'weeks', roundingMode: 'halfExpand' }), 'P139W')
    })
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ] as const
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      it(`rounds to nearest ${smallestUnit}`, () => {
        assert.equal(dateFns.since(later, earlier, { smallestUnit, roundingMode }), expected)
        assert.equal(dateFns.since(earlier, later, { smallestUnit, roundingMode }), `-${expected}`)
      })
    })
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ] as const
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      it(`rounds up to ${smallestUnit}`, () => {
        assert.equal(dateFns.since(later, earlier, { smallestUnit, roundingMode }), expectedPositive)
        assert.equal(dateFns.since(earlier, later, { smallestUnit, roundingMode }), expectedNegative)
      })
    })
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ] as const
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      it(`rounds down to ${smallestUnit}`, () => {
        assert.equal(dateFns.since(later, earlier, { smallestUnit, roundingMode }), expectedPositive)
        assert.equal(dateFns.since(earlier, later, { smallestUnit, roundingMode }), expectedNegative)
      })
    })
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ] as const
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(dateFns.since(later, earlier, { smallestUnit, roundingMode }), expected)
        assert.equal(dateFns.since(earlier, later, { smallestUnit, roundingMode }), `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(dateFns.since(later, earlier, { smallestUnit: 'years' }), 'P2Y')
      assert.equal(dateFns.since(earlier, later, { smallestUnit: 'years' }), '-P2Y')
    })
    it('rounds to an increment of years', () => {
      assert.equal(
        dateFns.since(later, earlier, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' }),
        'P4Y'
      )
    })
    it('rounds to an increment of months', () => {
      assert.equal(
        dateFns.since(later, earlier, { smallestUnit: 'months', roundingIncrement: 10, roundingMode: 'halfExpand' }),
        'P30M'
      )
    })
    it('rounds to an increment of weeks', () => {
      assert.equal(
        dateFns.since(later, earlier, { smallestUnit: 'weeks', roundingIncrement: 12, roundingMode: 'halfExpand' }),
        'P144W'
      )
    })
    it('rounds to an increment of days', () => {
      assert.equal(
        dateFns.since(later, earlier, { smallestUnit: 'days', roundingIncrement: 100, roundingMode: 'halfExpand' }),
        'P1000D'
      )
    })
    it('rounds relative to the receiver', () => {
      const date1 = dateFns.from('2019-01-01')
      const date2 = dateFns.from('2019-02-15')
      assert.equal(dateFns.since(date2, date1, { smallestUnit: 'months', roundingMode: 'halfExpand' }), 'P1M')
      assert.equal(dateFns.since(date1, date2, { smallestUnit: 'months', roundingMode: 'halfExpand' }), '-P2M')
    })
  })
  describe('date.add() works', () => {
    let date = dateFns.fromNumbers(1976, 11, 18)
    it('date.add({ years: 43 })', () => {
      assert.equal(dateFns.add(date, { years: 43 }), '2019-11-18')
    })
    it('date.add({ months: 3 })', () => {
      assert.equal(dateFns.add(date, { months: 3 }), '1977-02-18')
    })
    it('date.add({ days: 20 })', () => {
      assert.equal(dateFns.add(date, { days: 20 }), '1976-12-08')
    })
    it('new Date(2019, 1, 31).add({ months: 1 })', () => {
      assert.equal(dateFns.add(dateFns.fromNumbers(2019, 1, 31), { months: 1 }), '2019-02-28')
    })
    it('date.add(durationObj)', () => {
      assert.equal(dateFns.add(date, 'P43Y'), '2019-11-18')
    })
    it('casts argument', () => {
      assert.equal(dateFns.add(date, 'P43Y'), '2019-11-18')
    })
    it('constrain when overflowing result', () => {
      const jan31 = dateFns.from('2020-01-31')
      assert.equal(dateFns.add(jan31, { months: 1 }), '2020-02-29')
      assert.equal(dateFns.add(jan31, { months: 1 }, { overflow: 'constrain' }), '2020-02-29')
    })

    it('throw when overflowing result with reject', () => {
      const jan31 = dateFns.from('2020-01-31')
      assert.throws(() => dateFns.add(jan31, { months: 1 }, { overflow: 'reject' }), RangeError)
    })
    it('symmetrical with regard to negative durations', () => {
      assert.equal(dateFns.add('2019-11-18', { years: -43 }), '1976-11-18')
      assert.equal(dateFns.add('1977-02-18', { months: -3 }), '1976-11-18')
      assert.equal(dateFns.add('1976-12-08', { days: -20 }), '1976-11-18')
      assert.equal(dateFns.add('2019-02-28', { months: -1 }), '2019-01-28')
    })
    it("ignores lower units that don't balance up to a day", () => {
      assert.equal(dateFns.add(date, { hours: 1 }), '1976-11-18')
      assert.equal(dateFns.add(date, { minutes: 1 }), '1976-11-18')
      assert.equal(dateFns.add(date, { seconds: 1 }), '1976-11-18')
      assert.equal(dateFns.add(date, { milliseconds: 1 }), '1976-11-18')
    })
    it('adds lower units that balance up to a day or more', () => {
      assert.equal(dateFns.add(date, { hours: 24 }), '1976-11-19')
      assert.equal(dateFns.add(date, { hours: 36 }), '1976-11-19')
      assert.equal(dateFns.add(date, { hours: 48 }), '1976-11-20')
      assert.equal(dateFns.add(date, { minutes: 1440 }), '1976-11-19')
      assert.equal(dateFns.add(date, { seconds: 86400 }), '1976-11-19')
      assert.equal(dateFns.add(date, { milliseconds: 86400_000 }), '1976-11-19')
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        // @ts-ignore
        assert.throws(() => dateFns.add(date, { months: 1 }, { overflow }), RangeError)
      )
    })
    it('mixed positive and negative values always throw', () => {
      ;(['constrain', 'reject'] as const).forEach((overflow) =>
        assert.throws(() => dateFns.add(date, { months: 1, days: -30 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(dateFns.add(date, { months: 1 }, options), '1976-12-18'))
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => dateFns.add(date, {}), TypeError)
      // @ts-ignore
      assert.throws(() => dateFns.add(date, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      // @ts-ignore
      assert.equal(dateFns.add(date, { month: 1, days: 1 }), '1976-11-19')
    })
  })
  describe('date.subtract() works', () => {
    const date = dateFns.from('2019-11-18')
    it('date.subtract({ years: 43 })', () => {
      assert.equal(dateFns.subtract(date, { years: 43 }), '1976-11-18')
    })
    it('date.subtract({ months: 11 })', () => {
      assert.equal(dateFns.subtract(date, { months: 11 }), '2018-12-18')
    })
    it('date.subtract({ days: 20 })', () => {
      assert.equal(dateFns.subtract(date, { days: 20 }), '2019-10-29')
    })
    it('Date.from("2019-02-28").subtract({ months: 1 })', () => {
      assert.equal(dateFns.subtract('2019-02-28', { months: 1 }), '2019-01-28')
    })
    it('Date.subtract(durationObj)', () => {
      assert.equal(dateFns.subtract(date, durationFns.from('P43Y')), '1976-11-18')
    })
    it('casts argument', () => {
      assert.equal(dateFns.subtract(date, 'P43Y'), '1976-11-18')
    })
    it('constrain when overflowing result', () => {
      const mar31 = dateFns.from('2020-03-31')
      assert.equal(dateFns.subtract(mar31, { months: 1 }), '2020-02-29')
      assert.equal(dateFns.subtract(mar31, { months: 1 }, { overflow: 'constrain' }), '2020-02-29')
    })
    it('throw when overflowing result with reject', () => {
      const mar31 = dateFns.from('2020-03-31')
      assert.throws(() => dateFns.subtract(mar31, { months: 1 }, { overflow: 'reject' }), RangeError)
    })
    it('symmetrical with regard to negative durations', () => {
      assert.equal(dateFns.subtract(dateFns.from('1976-11-18'), { years: -43 }), '2019-11-18')
      assert.equal(dateFns.subtract(dateFns.from('2018-12-18'), { months: -11 }), '2019-11-18')
      assert.equal(dateFns.subtract(dateFns.from('2019-10-29'), { days: -20 }), '2019-11-18')
      assert.equal(dateFns.subtract(dateFns.from('2019-01-28'), { months: -1 }), '2019-02-28')
    })
    it("ignores lower units that don't balance up to a day", () => {
      assert.equal(dateFns.subtract(date, { hours: 1 }), '2019-11-18')
      assert.equal(dateFns.subtract(date, { minutes: 1 }), '2019-11-18')
      assert.equal(dateFns.subtract(date, { seconds: 1 }), '2019-11-18')
      assert.equal(dateFns.subtract(date, { milliseconds: 1 }), '2019-11-18')
    })
    it('subtracts lower units that balance up to a day or more', () => {
      assert.equal(dateFns.subtract(date, { hours: 24 }), '2019-11-17')
      assert.equal(dateFns.subtract(date, { hours: 36 }), '2019-11-17')
      assert.equal(dateFns.subtract(date, { hours: 48 }), '2019-11-16')
      assert.equal(dateFns.subtract(date, { minutes: 1440 }), '2019-11-17')
      assert.equal(dateFns.subtract(date, { seconds: 86400 }), '2019-11-17')
      assert.equal(dateFns.subtract(date, { milliseconds: 86400_000 }), '2019-11-17')
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        // @ts-ignore
        assert.throws(() => dateFns.subtract(date, { months: 1 }, { overflow }), RangeError)
      )
    })
    it('mixed positive and negative values always throw', () => {
      ;['constrain', 'reject'].forEach((overflow) =>
        // @ts-ignore
        assert.throws(() => dateFns.subtract(date, { months: 1, days: -30 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[{}, () => {}, undefined].forEach((options) =>
        assert.equal(dateFns.subtract(date, { months: 1 }, options), '2019-10-18')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => dateFns.subtract(date, {}), TypeError)
      // @ts-ignore
      assert.throws(() => dateFns.subtract(date, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      // @ts-ignore
      assert.equal(dateFns.subtract(date, { month: 1, days: 1 }), '2019-11-17')
    })
  })
  describe('date.toString() works', () => {
    it('new Date(1976, 11, 18).toString()', () => {
      assert.equal(dateFns.fromNumbers(1976, 11, 18).toString(), '1976-11-18')
    })
    it('new Date(1914, 2, 23).toString()', () => {
      assert.equal(dateFns.fromNumbers(1914, 2, 23).toString(), '1914-02-23')
    })
    const d = dateFns.fromNumbers(1976, 11, 18)
    // Elements of test commented out because of lacking functionality
    it('shows only non-ISO calendar if calendarName = auto', () => {
      // assert.equal(d.toString({ calendarName: 'auto' }), '1976-11-18')
      // assert.equal(d.withCalendar('gregory').toString({ calendarName: 'auto' }), '1976-11-18[u-ca=gregory]')
    })
    it('shows ISO calendar if calendarName = always', () => {
      // assert.equal(d.toString({ calendarName: 'always' }), '1976-11-18[u-ca=iso8601]')
    })
    it('omits non-ISO calendar if calendarName = never', () => {
      // assert.equal(d.withCalendar('gregory').toString({ calendarName: 'never' }), '1976-11-18')
    })
    it('default is calendar = auto', () => {
      assert.equal(d.toString(), '1976-11-18')
      // assert.equal(d.withCalendar('gregory').toString(), '1976-11-18[u-ca=gregory]')
    })
  })
  describe('Date.from() works', () => {
    it('Date.from("1976-11-18")', () => {
      const date = dateFns.from('1976-11-18')
      assert.equal(dateFns.getYear(date), 1976)
      assert.equal(dateFns.getMonth(date), 11)
      assert.equal(dateFns.getDay(date), 18)
    })
    it('Date.from("2019-06-30")', () => {
      const date = dateFns.from('2019-06-30')
      assert.equal(dateFns.getYear(date), 2019)
      assert.equal(dateFns.getMonth(date), 6)
      assert.equal(dateFns.getDay(date), 30)
    })
    it('Date.from("+000050-06-30")', () => {
      const date = dateFns.from('+000050-06-30')
      assert.equal(dateFns.getYear(date), 50)
      assert.equal(dateFns.getMonth(date), 6)
      assert.equal(dateFns.getDay(date), 30)
    })
    it('Date.from("+010583-06-30")', () => {
      const date = dateFns.from('+010583-06-30')
      assert.equal(dateFns.getYear(date), 10583)
      assert.equal(dateFns.getMonth(date), 6)
      assert.equal(dateFns.getDay(date), 30)
    })
    it('Date.from("-010583-06-30")', () => {
      const date = dateFns.from('-010583-06-30')
      assert.equal(dateFns.getYear(date), -10583)
      assert.equal(dateFns.getMonth(date), 6)
      assert.equal(dateFns.getDay(date), 30)
    })
    it('Date.from("-000333-06-30")', () => {
      const date = dateFns.from('-000333-06-30')
      assert.equal(dateFns.getYear(date), -333)
      assert.equal(dateFns.getMonth(date), 6)
      assert.equal(dateFns.getDay(date), 30)
    })
    // Because we're creating strings, it doesn't make sense to check for difference from object
    // it('Date.from(1976-11-18) is not the same object', () => {
    //   const orig = new Date(1976, 11, 18)
    //   const actual = dateFns.from(orig)
    //   assert.notEqual(actual, orig)
    // })
    it('Date.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18', () =>
      assert.equal(dateFns.from({ year: 1976, month: 11, day: 18 }), '1976-11-18'))
    it('can be constructed with month and without monthCode', () =>
      assert.equal(dateFns.from({ year: 1976, month: 11, day: 18 }), '1976-11-18'))
    // Unsupported functionality
    // it('can be constructed with monthCode and without month', () =>
    //   assert.equal(dateFns.from({ year: 1976, monthCode: 'M11', day: 18 }), '1976-11-18'))
    // it('month and monthCode must agree', () =>
    //   assert.throws(() => dateFns.from({ year: 1976, month: 11, monthCode: 'M12', day: 18 }), RangeError))
    it('Date.from({ year: 2019, day: 15 }) throws', () =>
      assert.throws(() => dateFns.from({ year: 2019, day: 15 }), TypeError))
    it('Date.from({ month: 12 }) throws', () => assert.throws(() => dateFns.from({ month: 12 }), TypeError))
    it('object must contain at least the required correctly-spelled properties', () => {
      assert.throws(() => dateFns.from({}), TypeError)
      assert.throws(() => dateFns.from({ year: 1976, months: 11, day: 18 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(dateFns.from({ year: 1976, month: 11, day: 18, days: 15 }), '1976-11-18')
    })
    it('Date.from(required prop undefined) throws', () =>
      assert.throws(() => dateFns.from({ year: undefined, month: 11, day: 18 }), TypeError))
    it('Date.from(number) is converted to string', () => assert.equal(dateFns.from(19761118), dateFns.from('19761118')))
    it('basic format', () => {
      assert.equal(dateFns.from('19761118'), '1976-11-18')
      assert.equal(dateFns.from('+0019761118'), '1976-11-18')
    })
    it('mixture of basic and extended format', () => {
      assert.equal(dateFns.from('1976-11-18T152330.1+00:00'), '1976-11-18')
      assert.equal(dateFns.from('19761118T15:23:30.1+00:00'), '1976-11-18')
      assert.equal(dateFns.from('1976-11-18T15:23:30.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('1976-11-18T152330.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('19761118T15:23:30.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('19761118T152330.1+00:00'), '1976-11-18')
      assert.equal(dateFns.from('19761118T152330.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('+001976-11-18T152330.1+00:00'), '1976-11-18')
      assert.equal(dateFns.from('+0019761118T15:23:30.1+00:00'), '1976-11-18')
      assert.equal(dateFns.from('+001976-11-18T15:23:30.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('+001976-11-18T152330.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('+0019761118T15:23:30.1+0000'), '1976-11-18')
      assert.equal(dateFns.from('+0019761118T152330.1+00:00'), '1976-11-18')
      assert.equal(dateFns.from('+0019761118T152330.1+0000'), '1976-11-18')
    })
    it('no junk at end of string', () => assert.throws(() => dateFns.from('1976-11-18junk'), RangeError))
    it('ignores if a timezone is specified', () => assert.equal(dateFns.from('2020-01-01[Asia/Kolkata]'), '2020-01-01'))
    it('options may only be an object or undefined', () => {
      ;[{}, () => {}, undefined].forEach((options) =>
        //@ts-ignore
        assert.equal(dateFns.from({ year: 1976, month: 11, day: 18 }, options), '1976-11-18')
      )
    })
    describe('Overflow', () => {
      const bad = { year: 2019, month: 1, day: 32 }
      it('reject', () => assert.throws(() => dateFns.from(bad, { overflow: 'reject' }), RangeError))
      it('constrain', () => {
        assert.equal(dateFns.from(bad), '2019-01-31')
        assert.equal(dateFns.from(bad, { overflow: 'constrain' }), '2019-01-31')
      })
      it('throw when bad overflow', () => {
        ;[dateFns.fromNumbers(1976, 11, 18), { year: 2019, month: 1, day: 1 }, '2019-01-31'].forEach((input) => {
          ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
            //@ts-ignore
            assert.throws(() => dateFns.from(input, { overflow }), RangeError)
          )
        })
      })
      it('constrain has no effect on invalid ISO string', () => {
        assert.throws(() => dateFns.from('2020-13-34', { overflow: 'constrain' }), RangeError)
      })
    })
  })
  describe('Date.compare works', () => {
    const d1 = dateFns.from('1976-11-18')
    const d2 = dateFns.from('2019-06-30')
    it('equal', () => assert.equal(dateFns.compare(d1, d1), 0))
    it('smaller/larger', () => assert.equal(dateFns.compare(d1, d2), -1))
    it('larger/smaller', () => assert.equal(dateFns.compare(d2, d1), 1))
    // Lacking functionality for this test.
    it('casts first argument', () => {
      // assert.equal(dateFns.compare({ year: 1976, month: 11, day: 18 }, d2), -1)
      assert.equal(dateFns.compare('1976-11-18', d2), -1)
    })
    it('casts second argument', () => {
      // assert.equal(dateFns.compare(d1, { year: 2019, month: 6, day: 30 }), -1)
      assert.equal(dateFns.compare(d1, '2019-06-30'), -1)
    })
    it('object must contain at least the required properties', () => {
      //@ts-ignore
      assert.throws(() => dateFns.compare({ year: 1976 }, d2), TypeError)
      //@ts-ignore
      assert.throws(() => dateFns.compare(d1, { year: 2019 }), TypeError)
    })
  })
  describe('Date.equal works', () => {
    const d1 = dateFns.from('1976-11-18')
    const d2 = dateFns.from('2019-06-30')
    it('equal', () => assert(dateFns.equals(d1, d1)))
    it('unequal', () => assert.equal(dateFns.equals(d1, d2), false))
    // Lacks functionality for casting
    // it('casts argument', () => {
    //   assert(!dateFns.equals({ year: 1976, month: 11, day: 18 }, d1))
    //   assert(!d2.equals('1976-11-18'))
    // })
    it('object must contain at least the required properties', () => {
      //@ts-ignore
      assert.throws(() => dateFns.equals(d2, { year: 1976 }), TypeError)
    })
  })
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      assert.throws(() => dateFns.fromNumbers(-271821, 4, 18), RangeError)
      assert.throws(() => dateFns.fromNumbers(275760, 9, 14), RangeError)
      assert.equal(dateFns.fromNumbers(-271821, 4, 19), '-271821-04-19')
      assert.equal(dateFns.fromNumbers(275760, 9, 13), '+275760-09-13')
    })
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 4, day: 18 }
      const tooLate = { year: 275760, month: 9, day: 14 }
      ;['reject', 'constrain'].forEach((overflow) => {
        ;[tooEarly, tooLate].forEach((props) => {
          //@ts-ignore
          assert.throws(() => dateFns.from(props, { overflow }), RangeError)
        })
      })
      assert.equal(dateFns.from({ year: -271821, month: 4, day: 19 }), '-271821-04-19')
      assert.equal(dateFns.from({ year: 275760, month: 9, day: 13 }), '+275760-09-13')
    })
    it('constructing from ISO string', () => {
      ;['reject', 'constrain'].forEach((overflow) => {
        ;['-271821-04-18', '+275760-09-14'].forEach((str) => {
          //@ts-ignore
          assert.throws(() => dateFns.from(str, { overflow }), RangeError)
        })
      })
      assert.equal(dateFns.from('-271821-04-19'), '-271821-04-19')
      assert.equal(dateFns.from('+275760-09-13'), '+275760-09-13')
    })
    it('converting from DateTime', () => {
      const min = dateFns.from('-271821-04-19T00:00:00.000000001')
      const max = dateFns.from('+275760-09-13T23:59:59.999999999')
      assert.equal(min.toString(), '-271821-04-19')
      assert.equal(max.toString(), '+275760-09-13')
    })

    // Do not support the ability to convert a YearMonth directly to a date via the addition of a day
    //   it('converting from YearMonth', () => {
    //     const min = Temporal.PlainYearMonth.from('-271821-04')
    //     const max = Temporal.PlainYearMonth.from('+275760-09')
    //     assert.throws(() => min.toPlainDate({ day: 1 }), RangeError)
    //     assert.throws(() => max.toPlainDate({ day: 30 }), RangeError)
    //     assert.equal(min.toPlainDate({ day: 19 }), '-271821-04-19')
    //     assert.equal(max.toPlainDate({ day: 13 }), '+275760-09-13')
    //   })
    // Do not support the ability to convert a MonthDay directly to a date via the addition of a year
    //   it('converting from MonthDay', () => {
    //     const jan1 = Temporal.PlainMonthDay.from('01-01')
    //     const dec31 = Temporal.PlainMonthDay.from('12-31')
    //     const minYear = -271821
    //     const maxYear = 275760
    //     assert.throws(() => jan1.toPlainDate({ year: minYear }), RangeError)
    //     assert.throws(() => dec31.toPlainDate({ year: maxYear }), RangeError)
    //     assert.equal(jan1.toPlainDate({ year: minYear + 1 }), '-271820-01-01')
    //     assert.equal(dec31.toPlainDate({ year: maxYear - 1 }), '+275759-12-31')
    //   })
    it('adding and subtracting beyond limit', () => {
      const min = dateFns.from('-271821-04-19')
      const max = dateFns.from('+275760-09-13')
      ;['reject', 'constrain'].forEach((overflow) => {
        //@ts-ignore
        assert.throws(() => dateFns.subtract(min, { days: 1 }, { overflow }), RangeError)
        //@ts-ignore
        assert.throws(() => dateFns.add(max, { days: 1 }, { overflow }), RangeError)
      })
    })
  })
  describe('Date.toZonedDateTime works', () => {
    it('convert to ZonedDateTime with a timezone alias', () => {
      const date1 = dateFns.from('2019-01-01')
      const zonedDateTime1 = dateFns.toZonedDateTime(date1, { timeZone: 'US/Central' })
      assert.equal(zonedDateTime1, '2019-01-01T00:00-06:00[America/Chicago]')
    })
  })
})
