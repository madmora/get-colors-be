import { Pool, Query } from 'mysql2'

export type JWTDecoded =
  | {
      cedula: string
      email: string
      iat: number
      exp: number
    }
  | undefined

export type User =
  | {
      password?: string
      cedula: string
      email: string
      nombre: string
      apellidos: string
      direccion: string
      rol: string
    }
  | undefined

export interface Auth {
  isAuth: boolean
  user: User
}

export interface CustomContext {
  auth: Auth
}

export type GraphqlRoot = unknown

export type PoolResponse = Query | undefined

export type MySqlPool = Pool | null

export interface SecurityData {
  cuentaActiva: number
  passwordExpirado: number
  passwordBloqueado: number
  intentosExcedido: number
}

export type ResetPasswordData =
  | {
      tokenExpirado: boolean
      responsable: string
    }
  | undefined
