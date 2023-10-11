import { createPool, Pool } from 'mysql2'
import config from '../config'

const DATA_SOURCES = {
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbServer,
  database: config.dbDatabase,
  connectionLimit: config.dbConnectionLimit,
}

let pool: Pool

/**
 * Generates pool connection to be used throughout the app.
 */
export const MySQLConnectorInit = () => {
  try {
    pool = createPool(DATA_SOURCES)

    console.debug('MySql Adapter Pool generated successfully')
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error)
    throw new Error('Failed to initialized pool')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConnection = (): any => {
  try {
    return pool.promise()
  } catch (error) {
    console.log('ERROR:', error)
    return undefined
  }
}
