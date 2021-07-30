export function getDaysInMonthByNumber(month: number, isLeap: boolean): number {
  switch (month) {
    case 2:
      return isLeap ? 29 : 28
    case 4:
    case 6:
    case 9:
    case 11:
      return 30
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31
    default:
      throw new Error(`Invalid Month: ${month} is not a valid Month`)
  }
}
