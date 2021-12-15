import isoSource from '!!raw-loader!../../../dist/out.d.ts'

export const files = [
  {
    source: `
      declare module 'https://cdn.skypack.dev/iso-fns@alpha' {
      import { IDateFns } from 'types/IDateFns'
      import { IDateTimeFns } from 'types/IDateTimeFns'
      import { IInstantFns } from 'types/IInstantFns'
      import { ITimeFns } from 'types/ITimeFns'
      import { IMonthDayFns } from 'types/IMonthDayFns'
      import { IYearMonthFns } from 'types/IYearMonthFns'
      import { IZonedDateTimeFns } from 'types/IZonedDateTimeFns'
      import { IDurationFns } from 'types/IDurationFns'

      export * from 'iso-types'

      export const dateFns: IDateFns
      export const dateTimeFns: IDateTimeFns
      export const durationFns: IDurationFns
      export const instantFns: IInstantFns
      export const monthDayFns: IMonthDayFns
      export const timeFns: ITimeFns
      export const yearMonthFns: IYearMonthFns
      export const zonedDateTimeFns: IZonedDateTimeFns
    }

    ${isoSource}
    `,
    path: 'file:///node_modules/iso-fns/index.d.ts'
  }
]
