import { ExpressContext } from 'apollo-server-express'
import config from '../config'
import { CustomContext, User } from '../types'
import { hasData } from './helpers'
import { verifyToken } from './security'

export const createContext = async (
  context: ExpressContext,
): Promise<CustomContext> => {
  const { req } = context
  const token = req.headers.authorization

  if (!token || !config.secret) {
    return { auth: { isAuth: false, user: undefined } }
  }

  const user: User = await verifyToken(token)

  return { auth: { isAuth: hasData(user), user } }
}
