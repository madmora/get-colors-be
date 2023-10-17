import { getConnection, spObtenerUsuariosDemo } from '../../../database'
import { PoolResponse } from '../../../types'
import { hasData, internalServerError, parseDbResponse } from '../../../utils'
import { UserDemo } from '../types'

// Esto se puede hacer dentro del resolver pero para
// que no se haga tan grande se hizo este archivo de helpers
export const getUsersDemo = async (): Promise<UserDemo[]> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spObtenerUsuariosDemo)

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  if (!hasData(rows)) {
    return []
  }

  return rows
}
