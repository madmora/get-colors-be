import bcrypt from 'bcryptjs'
import { pathOr } from 'ramda'
import {
  getConnection,
  spActivarUsuario,
  spActualizarPassword,
  spCrearUsuario,
  spAumentarIntentosLogin,
  spEditarUsuario,
  spEliminarUsuario,
  spLogin,
  spObtenerEstadoCuenta,
  spObtenerHistorialPassword,
  spObtenerResponsable,
  spObtenerUsuarios,
  spBloquearCuenta,
  spGuardarRecuperarPassword,
  spObtenerRecuperarPassword,
  spRecuperarPassword,
} from '../../database'
import {
  PoolResponse,
  ResetPasswordData,
  SecurityData,
  User,
} from '../../types'
import {
  internalServerError,
  hasData,
  isQuerySuccess,
  parseDbResponse,
} from '../../utils'
import {
  ActivateUserInput,
  DeleteUserInput,
  EditUserInput,
  SignInInput,
} from './types'

interface PasswordHistory {
  password: string
}

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  const result = await bcrypt.hash(password, salt)
  return result
}

export const comparePassword = async (
  password: string,
  receivedPassword: string,
) => {
  const result = await bcrypt.compare(password, receivedPassword)
  return result
}

export const createUser = async ({ input }: SignInInput) => {
  const { cedula, email, nombre, apellidos, direccion, password, rol } = input

  const encryptedPassword = await encryptPassword(password)

  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spCrearUsuario, [
    cedula,
    email,
    nombre,
    apellidos,
    direccion,
    encryptedPassword,
    rol,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const savePasswordReset = async (email: string, token: string) => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(
    spGuardarRecuperarPassword,
    [email, token],
  )

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const deleteUser = async ({ input }: DeleteUserInput) => {
  const { responsable, cedula } = input

  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spEliminarUsuario, [
    responsable,
    cedula,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const activateUser = async ({ input }: ActivateUserInput) => {
  const { responsable, cedula } = input

  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spActivarUsuario, [
    responsable,
    cedula,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const editUser = async ({ input }: EditUserInput) => {
  const {
    cedulaActual,
    cedula,
    email,
    nombre,
    apellidos,
    direccion,
    rol,
    responsable,
  } = input

  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spEditarUsuario, [
    cedulaActual,
    cedula,
    email,
    nombre,
    apellidos,
    direccion,
    rol,
    responsable,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const editPassword = async (
  newPassword: string,
  responsable: string,
) => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const encryptedPassword = await encryptPassword(newPassword)

  const dbResponse: PoolResponse = await pool?.query(spActualizarPassword, [
    responsable,
    encryptedPassword,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const login = async (responsableId: string): Promise<User> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spLogin, [responsableId])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  if (!hasData(rows)) {
    return undefined
  }

  const user: User = pathOr({} as User, [0], rows)

  return user
}

export const getSecurityData = async (
  responsableId: string,
): Promise<SecurityData | undefined> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spObtenerEstadoCuenta, [
    responsableId,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  if (!hasData(rows)) {
    return undefined
  }

  const securityData: SecurityData = pathOr({} as SecurityData, [0], rows)

  return securityData
}

export const updateSecurityInformation = async (
  responsableId: string,
): Promise<boolean> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spAumentarIntentosLogin, [
    responsableId,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const blockAccount = async (responsableId: string): Promise<boolean> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spBloquearCuenta, [
    responsableId,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}

export const verifyLoginPassword = async (
  password: string,
  dbPassword: string,
): Promise<boolean> => {
  const isPasswordEqual = await comparePassword(password, dbPassword)

  return isPasswordEqual
}

export const getUsers = async (): Promise<User[]> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const dbResponse: PoolResponse = await pool?.query(spObtenerUsuarios)

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

export const getUser = async (responsableId: string): Promise<User> => {
  const pool = getConnection()

  if (!pool) {
    return undefined
  }

  const dbResponse: PoolResponse = await pool?.query(spObtenerResponsable, [
    responsableId,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    return undefined
  }

  const { rows } = dbParsedResponse

  if (!hasData(rows)) {
    return undefined
  }

  const user: User = pathOr(undefined as User, [0], rows)

  return user
}

export const getPasswordHistory = async (
  cedula: string,
): Promise<PasswordHistory[]> => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const history: PoolResponse = await pool?.query(spObtenerHistorialPassword, [
    cedula,
  ])

  const dbParsedResponse = parseDbResponse(history)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  if (!hasData(rows)) {
    return []
  }
  return rows
}

interface UserIds {
  email?: string
  id?: string
}

export const userExist = async ({ email, id }: UserIds): Promise<boolean> => {
  if (email) {
    const userWithEmail = await getUser(email)
    return hasData(userWithEmail)
  }

  if (id) {
    const userWithId = await getUser(id)
    return hasData(userWithId)
  }

  return false
}

export const passwordCanBeUsed = async (
  responsible: string,
  oldPassword: string,
): Promise<boolean> => {
  if (!responsible && !oldPassword) {
    return false
  }

  const user = await login(responsible)

  if (
    hasData(user) &&
    (await comparePassword(oldPassword, user?.password || ''))
  ) {
    return false
  }

  return true
}

export const availablePassword = async (
  responsible: string,
  newPassword: string,
): Promise<boolean> => {
  if (!responsible && !newPassword) {
    return false
  }

  const history = await getPasswordHistory(responsible)

  for (let i = 0; i < history.length; i++) {
    if (await comparePassword(newPassword, history[i].password)) {
      return false
    }
  }

  return true
}

export const getResetPasswordData = async (
  token: string,
): Promise<ResetPasswordData> => {
  const pool = getConnection()

  if (!pool) {
    return undefined
  }

  const dbResponse: PoolResponse = await pool?.query(
    spObtenerRecuperarPassword,
    [token],
  )

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    return undefined
  }

  const { rows } = dbParsedResponse

  if (!hasData(rows)) {
    return undefined
  }

  const resetPasswordData: ResetPasswordData = pathOr(
    undefined as ResetPasswordData,
    [0],
    rows,
  )

  return resetPasswordData
}

export const resetPassword = async (password: string, responsable: string) => {
  const pool = getConnection()

  if (!pool) {
    internalServerError('Database connection error')
  }

  const encryptedPassword = await encryptPassword(password)

  const dbResponse: PoolResponse = await pool?.query(spRecuperarPassword, [
    responsable,
    encryptedPassword,
  ])

  const dbParsedResponse = parseDbResponse(dbResponse)

  if (!dbParsedResponse) {
    internalServerError('Graphql internal error')
  }

  const { rows } = dbParsedResponse

  const success = isQuerySuccess(rows)

  return success
}
