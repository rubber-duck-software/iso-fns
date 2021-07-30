export function divmod(x: number, divisor: number) {
  return {
    quotient: Math.trunc(x / divisor),
    remainder: x % divisor
  }
}
