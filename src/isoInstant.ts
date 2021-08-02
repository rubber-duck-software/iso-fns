import { IsoInstant } from './iso-types'
import isValidInstant from './isValidInstant'
import { JsDateToIsoInstant } from './utils/jsdateConversions'

function isoInstant(input: string): IsoInstant
function isoInstant(epochMilliseconds: number): IsoInstant
function isoInstant(): IsoInstant

function isoInstant(...args: any[]) {
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

export default isoInstant
