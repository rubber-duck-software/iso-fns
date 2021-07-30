import { IsoInstant } from 'iso-types'
import isValidInstant from './isValidInstant'
import { JsDateToIsoInstant } from './utils/jsdateConversions'

export default function instant(input: string): IsoInstant
export default function instant(epochMilliseconds: number): IsoInstant
export default function instant(): IsoInstant

export default function instant(...args: any[]) {
  if (args.length === 0) {
    return JsDateToIsoInstant(new Date())
  } else if (args.length === 1) {
    if (isValidInstant(args[0])) {
      return args[0]
    } else if (typeof args[0] === 'number') {
      return JsDateToIsoInstant(new Date(args[0]))
    } else {
      throw new Error(`Unrecognized input: ${args}`)
    }
  } else {
    throw new Error(`Unrecognized input: ${args}`)
  }
}
