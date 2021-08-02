<p align="center">
  <h1 align="center">iso-fns</h1>
  <p align="center">A string-based date-time library for Javascript.</p>
</p>
<p align="center">
<a href="https://github.com/rubber-duck-software/iso-fns/blob/release/LICENSE"><img src="https://img.shields.io/npm/l/iso-fns.svg?" alt="NPM License"></a>
<a href="https://www.npmjs.com/package/iso-fns"><img src="https://img.shields.io/npm/v/iso-fns.svg?style=flat" alt="NPM Version"></a>
<a href="https://www.npmjs.com/package/iso-fns"><img src="https://img.shields.io/npm/dw/iso-fns.svg?style=flat" alt="NPM Downloads"></a>
<a href="https://coveralls.io/github/rubber-duck-software/iso-fns?branch=release"><img src="https://coveralls.io/repos/github/rubber-duck-software/iso-fns/badge.svg?branch=release" alt="Coverage Status"></a>
</p>

# What is iso-fns?

Iso-fns is a date-time library for Javascript based on the [Temporal Proposal for JavaScript](https://tc39.es/proposal-temporal/docs/index.html) and inspired by [date-fns](https://date-fns.org) which represents all date-time primitives as strings formatted according the iso-8601 standard. An instant in time is represented as a string formatted
as "YYYY-MM-DDThh:mm:ss.sssZ" and a date (or plain date) is represented as "YYYY-MM-DD". Each function in this library will
input some iso 8601 string and perform an operation on it, returning another iso 8601 formatted string.

# Why represent temporal types as strings?

A type represented as a javascript class cannot be sent over the wire in a JSON payload without being serialized. Then on the other end of the wire, the payload has to be deserialized into a class again to access the methods. Representing the type as a string avoids this boilerplate, since the type can be sent over the wire directly and performing operations on the type requires no deserialization.

An additional benefit to this approach is the transparency of strings. There can be no internal state, no overwritten methods, or any other difficult-to-follow structure. Strings are the most readable format for date-time information.

# Contents

There are 7 fundamental types covered by this library

- Instant (yyyy-mm-ddThh:mm:ss.mmmZ)
- DateTime (yyyy-mm-ddThh:mm:ss.mmm | yyyy-mm-ddThh:mm:ss | yyyy-mm-ddThh:mm)
- Date (yyyy-mm-dd)
- Time (hh:mm:ss.mmm | hh:mm:ss | hh:mm)
- YearMonth (yyyy-mm)
- MonthDay (--mm-dd)
- Duration (PnYnMnWnDTnHnMnS)

For documentation on the functions included in this library, check out https://iso-fns.org.

## Contributors ✨

---

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/rubber-duck-software"><img src="https://avatars.githubusercontent.com/u/25811049?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Grant Colestock</b></sub></a><br /><a href="https://github.com/rubber-duck-software/iso-fns/commits?author=rubber-duck-software" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kolton-musgrove"><img src="https://avatars.githubusercontent.com/u/78399413?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kolton Musgrove</b></sub></a><br /><a href="https://github.com/rubber-duck-software/iso-fns/commits?author=kolton-musgrove" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
