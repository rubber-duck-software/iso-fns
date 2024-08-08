// @flow
/* eslint-env mocha */

import { strict as assert } from 'assert'
import format from '.'
import { test } from 'beartest-js'
const { describe } = test
const it = test

describe('format', function () {
  var date = {
    year: 1986,
    month: 4 /* April */,
    day: 4,
    hour: 10,
    minute: 32,
    second: 55,
    millisecond: 123
  }

  it('escapes characters between the single quote characters', function () {
    var result = format(date, "'yyyy-'MM-dd'THH:mm:ss.SSSX' yyyy-'MM-dd'")
    assert(result === 'yyyy-04-04THH:mm:ss.SSSX 1986-MM-dd')
  })

  it('two single quote characters are transformed into a "real" single quote', function () {
    var date = { year: 2014, month: 4, day: 4, hour: 5 }
    assert(format(date, "''h 'o''clock'''") === "'5 o'clock'")
  })

  it('accepts new line charactor', function () {
    var date = { year: 2014, month: 4, day: 4, hour: 5, minute: 0, second: 0 }
    assert.equal(format(date, "yyyy-MM-dd'\n'HH:mm:ss"), '2014-04-04\n05:00:00')
  })

  describe('ordinal numbers', function () {
    it('ordinal day of an ordinal month', function () {
      var result = format(date, "do 'day of the' Mo 'month of' yyyy")
      assert(result === '4th day of the 4th month of 1986')
    })

    it('should return a correct ordinal number', function () {
      var result = []
      for (var i = 1; i <= 31; i++) {
        result.push(format({ day: i }, 'do'))
      }
      var expected = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th',
        '7th',
        '8th',
        '9th',
        '10th',
        '11th',
        '12th',
        '13th',
        '14th',
        '15th',
        '16th',
        '17th',
        '18th',
        '19th',
        '20th',
        '21st',
        '22nd',
        '23rd',
        '24th',
        '25th',
        '26th',
        '27th',
        '28th',
        '29th',
        '30th',
        '31st'
      ]
      assert.deepEqual(result, expected)
    })
  })

  it('era', function () {
    var result = format(date, 'G GG GGG GGGG GGGGG')
    assert(result === 'AD AD AD Anno Domini A')

    var bcDate = { year: -1, month: 1, day: 1 }
    var bcResult = format(bcDate, 'G GG GGG GGGG GGGGG')
    assert(bcResult === 'BC BC BC Before Christ B')
  })

  describe('year', function () {
    describe('regular year', function () {
      it('works as expected', function () {
        var result = format(date, 'y yo yy yyy yyyy yyyyy')
        assert(result === '1986 1986th 86 1986 1986 01986')
      })

      it('1 BC formats as 1', function () {
        var result = format({ year: 0 }, 'y')
        assert(result === '1')
      })

      it('2 BC formats as 2', function () {
        var result = format({ year: -1 }, 'y')
        assert(result === '2')
      })

      it('2 BC formats as 2nd', function () {
        var result = format({ year: -1 }, 'yo')
        assert(result === '2nd')
      })
    })

    describe('extended year', function () {
      it('works as expected', function () {
        var result = format(date, 'u uu uuu uuuu uuuuu')
        assert(result === '1986 1986 1986 1986 01986')
      })

      it('1 BC formats as 0', function () {
        var result = format({ year: 0 }, 'u')
        assert(result === '0')
      })

      it('2 BC formats as -1', function () {
        var result = format({ year: -1 }, 'u')
        assert(result === '-1')
      })
    })
  })

  describe('quarter', function () {
    it('formatting quarter', function () {
      var result = format(date, 'Q Qo QQ QQQ QQQQ QQQQQ')
      assert(result === '2 2nd 02 Q2 2nd quarter 2')
    })

    it('returns a correct quarter for each month', function () {
      var result = []
      for (var i = 1; i <= 12; i++) {
        result.push(format({ month: i }, 'Q'))
      }
      var expected = ['1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4']
      assert.deepEqual(result, expected)
    })
  })

  describe('month', function () {
    it('formatting month', function () {
      var result = format(date, 'M Mo MM MMM MMMM MMMMM')
      assert(result === '4 4th 04 Apr April A')
    })
  })

  describe('week', function () {
    it('ISO week of year', function () {
      var result = format({ year: 1986, month: 4, day: 6 }, 'I Io II')
      assert(result === '14 14th 14')
    })
  })

  describe('day', function () {
    it('date', function () {
      var result = format(date, 'd do dd')
      assert(result === '4 4th 04')
    })
  })

  describe('week day', function () {
    describe('ISO day of week', function () {
      it('works as expected', function () {
        var result = format(date, 'i io ii iii iiii iiiii iiiiii')
        assert(result === '5 5th 05 Fri Friday F Fr')
      })

      it('returns a correct day of an ISO week', function () {
        var result = []
        for (var i = 1; i <= 7; i++) {
          result.push(format({ year: 1986, month: 9, day: i }, 'i'))
        }
        var expected = ['1', '2', '3', '4', '5', '6', '7']
        assert.deepEqual(result, expected)
      })
    })
  })

  describe('day period and hour', function () {
    it('hour [1-12]', function () {
      var result = format({ hour: 0 }, 'h ho hh')
      assert(result === '12 12th 12')
    })

    it('hour [0-23]', function () {
      var result = format({ hour: 0 }, 'H Ho HH')
      assert(result === '0 0th 00')
    })

    it('hour [0-11]', function () {
      var result = format({ hour: 0 }, 'K Ko KK')
      assert(result === '0 0th 00')
    })

    it('hour [1-24]', function () {
      var result = format({ hour: 0 }, 'k ko kk')
      assert(result === '24 24th 24')
    })

    describe('AM, PM', function () {
      it('works as expected', function () {
        var result = format({ hour: 0 }, 'a aa aaa aaaa aaaaa')
        assert(result === 'AM AM am a.m. a')
      })

      it('12 PM', function () {
        assert(format({ hour: 12 }, 'h H K k a') === '12 12 0 12 PM')
      })

      it('12 AM', function () {
        assert(format({ hour: 0 }, 'h H K k a') === '12 0 0 24 AM')
      })
    })

    describe('AM, PM, noon, midnight', function () {
      it('works as expected', function () {
        var result = format({ hour: 2 }, 'b bb bbb bbbb bbbbb')
        assert(result === 'AM AM am a.m. a')

        var pmResult = format({ hour: 13 }, 'b bb bbb bbbb bbbbb')
        assert(pmResult === 'PM PM pm p.m. p')
      })

      it('12 PM', function () {
        assert(format({ hour: 12 }, 'b bb bbb bbbb bbbbb') === 'noon noon noon noon n')
      })

      it('12 AM', function () {
        assert(format({ hour: 0 }, 'b bb bbb bbbb bbbbb') === 'midnight midnight midnight midnight mi')
      })
    })

    describe('flexible day periods', function () {
      it('works as expected', function () {
        var result = format(date, 'B, BB, BBB, BBBB, BBBBB')
        assert(result === 'in the morning, in the morning, in the morning, in the morning, in the morning')
      })

      it('12 PM', function () {
        assert(format({ hour: 12 }, 'h B') === '12 in the afternoon')
      })

      it('5 PM', function () {
        assert(format({ hour: 17 }, 'h B') === '5 in the evening')
      })

      it('12 AM', function () {
        assert(format({ hour: 0 }, 'h B') === '12 at night')
      })

      it('4 AM', function () {
        assert(format({ hour: 4 }, 'h B') === '4 in the morning')
      })
    })
  })

  it('minute', function () {
    var result = format(date, 'm mo mm')
    assert(result === '32 32nd 32')
  })

  describe('second', function () {
    it('second', function () {
      var result = format(date, 's so ss')
      assert(result === '55 55th 55')
    })

    it('fractional seconds', function () {
      var result = format(date, 'S SS SSS SSSS')
      assert(result === '1 12 123 1230')
    })
  })

  describe('time zone', function () {
    it('ISO-8601 with Z', function () {
      var resultZeroOffset = format({ offset: '+00:00' }, 'X XX XXX XXXX XXXXX')
      assert(resultZeroOffset === 'Z Z Z Z Z')

      var resultNegativeOffset = format({ offset: '-08:00' }, 'X XX XXX XXXX XXXXX')
      assert.equal(resultNegativeOffset, '-08 -0800 -08:00 -0800 -08:00')

      var resultNegative30Offset = format({ offset: '-07:30' }, 'X XX XXX XXXX XXXXX')
      assert.equal(resultNegative30Offset, '-0730 -0730 -07:30 -0730 -07:30')
    })

    it('GMT', function () {
      var resultNegativeOffset = format({ offset: '-08:00' }, 'O OO OOO OOOO')
      assert(resultNegativeOffset === 'GMT-8 GMT-8 GMT-8 GMT-08:00')

      var resultNegative30Offset = format({ offset: '-07:30' }, 'O OO OOO OOOO')
      assert(resultNegative30Offset === 'GMT-7:30 GMT-7:30 GMT-7:30 GMT-07:30')
    })
  })

  describe('long format', function () {
    it('short date', function () {
      var result = format(date, 'P')
      assert(result === '04/04/1986')
    })

    it('medium date', function () {
      var result = format(date, 'PP')
      assert(result === 'Apr 4, 1986')
    })

    it('long date', function () {
      var result = format(date, 'PPP')
      assert(result === 'April 4th, 1986')
    })

    it('full date', function () {
      var result = format(date, 'PPPP')
      assert(result === 'Friday, April 4th, 1986')
    })

    it('short time', function () {
      var result = format(date, 'p')
      assert(result === '10:32 AM')
    })

    it('medium time', function () {
      var result = format(date, 'pp')
      assert(result === '10:32:55 AM')
    })

    it('long time', function () {
      var result = format({ ...date, timeZone: 'America/Chicago', epochMilliseconds: 1634170752000 }, 'ppp')
      assert(result === '10:32:55 AM CDT')
    })

    it('full time', function () {
      var result = format({ ...date, timeZone: 'America/Chicago', epochMilliseconds: 1634170752000 }, 'pppp')
      assert(result === '10:32:55 AM Central Daylight Time')
    })

    it('short date + time', function () {
      var result = format(date, 'Pp')
      assert(result === '04/04/1986, 10:32 AM')
    })

    it('medium date + time', function () {
      var result = format(date, 'PPpp')
      assert(result === 'Apr 4, 1986, 10:32:55 AM')
    })

    it('long date + time', function () {
      var result = format({ ...date, timeZone: 'America/Chicago', epochMilliseconds: 1634170752000 }, 'PPPppp')
      assert(result === 'April 4th, 1986 at 10:32:55 AM CDT')
    })

    it('full date + time', function () {
      var result = format({ ...date, timeZone: 'America/Chicago', epochMilliseconds: 1634170752000 }, 'PPPPpppp')
      assert(result === 'Friday, April 4th, 1986 at 10:32:55 AM Central Daylight Time')
    })

    it('allows arbitrary combination of date and time', function () {
      var result = format({ ...date, timeZone: 'America/Chicago', epochMilliseconds: 1634170752000 }, 'Ppppp')
      assert(result === '04/04/1986, 10:32:55 AM Central Daylight Time')
    })
  })

  describe('edge cases', function () {
    it('throws RangeError if the time value is invalid', () => {
      assert.throws(() => format({}, 'MMMM d, yyyy'), RangeError)
    })

    it('handles dates before 100 AD', function () {
      assert(format({ year: 7, month: 12, day: 31 }, 'i') === '1')
    })
  })

  it('implicitly converts `formatString`', function () {
    // eslint-disable-next-line no-new-wrappers
    var formatString = new String('yyyy-MM-dd')

    // @ts-expect-error
    assert(format({ year: 2014, month: 4, day: 4 }, formatString) === '2014-04-04')
  })

  it('throws RangeError exception if the format string contains an unescaped latin alphabet character', function () {
    assert.throws(() => format(date, 'yyyy-MM-dd-nnnn'), RangeError)
  })

  it('throws TypeError exception if passed less than 2 arguments', function () {
    // @ts-expect-error
    assert.throws(() => format(), TypeError)
    // @ts-expect-error
    assert.throws(() => format(1), TypeError)
  })
})
