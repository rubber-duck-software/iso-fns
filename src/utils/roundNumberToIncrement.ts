import { divmod } from './divmod'

export function roundNumberToIncrement(
  quantity: number,
  increment: number,
  mode: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
): number {
  if (increment === 1) return Number(quantity)
  let { quotient, remainder } = divmod(quantity, increment)
  if (remainder === 0) return Number(quantity)
  const sign = remainder < 0 ? -1 : 1
  switch (mode) {
    case 'ceil':
      if (sign > 0) quotient = quotient + sign
      break
    case 'floor':
      if (sign < 0) quotient = quotient + sign
      break
    case 'trunc':
      // no change needed, because divmod is a truncation
      break
    case 'halfExpand':
      // "half up away from zero"
      if (Math.abs(remainder * 2) >= increment) quotient = quotient + sign
      break
  }
  return quotient * increment
}
