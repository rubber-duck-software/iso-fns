# Changelog

## 2.0.0 (unreleased — currently published under the `alpha` tag)

Version 2 is a ground-up rewrite. The public surface — the string-based `Iso.*`
types, the `*Fns` modules, and `.chain()` builders — is unchanged, but the
engine underneath is completely different.

### Highlights

- **Now backed by [`temporal-polyfill`](https://github.com/fullcalendar/temporal-polyfill).**
  The hand-written date/time engine has been replaced by a thin adapter over the
  TC39 `Temporal` polyfill. Behaviour now tracks the `Temporal` specification.
- **Locale registry for formatting.** New exports `registerLocale`, `getLocale`,
  and `enUS`: register a `Locale` once and reference it by code from `format`.

### Breaking changes

- **New runtime dependency.** `temporal-polyfill` is installed as a (peer-free)
  dependency. v1 had no runtime dependencies.
- **ESM-first dual package.** The package ships both ESM (`index.mjs`) and
  CommonJS (`index.cjs`) with matching type declarations, resolved through the
  `exports` map. Toolchains that ignore the `exports` field are not supported.
- **`weekStartsOn` numbering.** `Locale.options.weekStartsOn` now uses Temporal's
  `1` = Monday … `7` = Sunday numbering (not date-fns's `0` = Sunday). The
  bundled `enUS` locale uses `7`.

### Performance

Accessors and predicates on the **non-chain** API (e.g. `dateFns.getYear(date)`,
`instantFns.isValid(x)`) parse the ISO string into a `Temporal` object on every
call, and `isValid`/`assertIsValid` do a full parse-and-reserialize round trip
rather than a single regex test. For one-off calls this is negligible. For hot
loops that perform several operations on the same value, prefer the chain API,
which parses once and reuses the parsed value:

```ts
// Re-parses "2020-01-01" three times:
const y = dateFns.getYear(d)
const m = dateFns.getMonth(d)
const wd = dateFns.getDayOfWeek(d)

// Parses once, then reuses:
const c = dateFns.chain(d)
const y = c.getYear().value()
const m = c.getMonth().value()
const wd = c.getDayOfWeek().value()
```

### Notes

- Accessors and arithmetic operate at millisecond precision; the string
  representation preserves whatever fractional-second precision was parsed
  (including sub-millisecond), matching `Temporal`.
- `isValid` accepts any serialization equivalent to a canonical value — e.g.
  `2020-01-01T12:00`, `2020-01-01T12:00:00`, and `2020-01-01T12:00:00.000` are
  all accepted as the same `Iso.DateTime`.
