/* c8 ignore next 50 */
enum YearEnum {}

// Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
export interface DayOfWeek extends String {}

// January, February, March, April, May, June, July, August, September, October, November, December
export interface Month extends String {}

// number
export type Year = number & YearEnum

// yyyy-mm
export interface YearMonth extends String {}

// mm-dd
export interface MonthDay extends String {}

// yyyy-mm-dd
export interface LocalDate extends String {}

// THH:MM:ss.l
export interface LocalTime extends String {}

// yyyy-mm-ddTHH:MM:ss.l
export interface LocalDateTime extends String {}

// yyyy-mm-ddTHH:MM:ss.lZ
export interface Instant extends String {}

// PnYnMnDTnHnMnSn
export interface Duration extends String {}
