import { complement, either, isEmpty, isNil, pathOr } from 'ramda'

export const isEmptyOrUndefined = either(isNil, isEmpty)

export const hasData = complement(isEmptyOrUndefined)

export const pathOrNull = pathOr(null)
