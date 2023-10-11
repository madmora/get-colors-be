import jwt from 'jsonwebtoken'
import { includes, map, toLower } from 'ramda'
import config from '../config'

import { getUser } from '../gql/user/helpers'
import { JWTDecoded } from '../types'
import { User } from '../types'

export interface TokenData {
  cedula: string
  email: string
}

export const getToken = (data: TokenData, expires: string): string => {
  const { secret } = config
  const expiresIn = expires ? expires : '12h'

  if (!secret) {
    return ''
  }

  return jwt.sign(data, config.secret, { expiresIn })
}

export const jwtVerify = (token: string): JWTDecoded => {
  const { secret } = config

  if (!token || !secret) {
    return undefined
  }

  try {
    return jwt.verify(token, config.secret) as JWTDecoded
  } catch (error) {
    return undefined
  }
}

export const verifyToken = async (token: string): Promise<User> => {
  const { secret } = config

  if (!token || !secret) {
    return undefined
  }

  const decoded: JWTDecoded = jwtVerify(token)

  if (!decoded?.email) {
    return undefined
  }

  const { email } = decoded

  const user: User = await getUser(email)

  return user
}

export const isAuthorized = (rol: string, authLevel: string[]): boolean => {
  const authLevelLowercase: string[] = map(
    (level: string) => toLower(level),
    authLevel || [],
  )

  return includes(toLower(rol), authLevelLowercase)
}
