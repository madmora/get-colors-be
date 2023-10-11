import { pathOrNull } from './helpers'
import { pathOr } from 'ramda'
import { internalServerError } from './errors'

export interface DatabaseResponse {
  readonly error: number
  readonly track_no: number
  readonly consecutivo?: number
  readonly errorMessage?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseDbResponse = (data: any): any => {
  try {
    if (data) {
      const dbData = data[0]
      const rows = pathOrNull([0], dbData)
      const resultSetHeader = { ...dbData[1] }
      return { rows, resultSetHeader }
    }

    return null
  } catch (_) {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createResponse = (rows: any) => {
  const response: DatabaseResponse | object = pathOr({}, [0], rows)

  const {
    error = 1,
    errorMessage = '',
    track_no = 0,
    ...rest
  } = response as DatabaseResponse

  if (error) {
    console.log('Error:', errorMessage, 'track_no: ', track_no)
    internalServerError('Database internal error')
  }

  return rest
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isQuerySuccess = (rows: any) => {
  const response: DatabaseResponse | object = pathOr({}, [0], rows)

  const {
    error = 1,
    errorMessage = '',
    track_no = 0,
  } = response as DatabaseResponse

  if (error) {
    console.log('Error:', errorMessage, 'track_no: ', track_no)
    return false
  }

  return true
}
