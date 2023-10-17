import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { CustomContext, GraphqlRoot } from '../../../types'
import { AppConstants } from '../../../utils/constants'
import { isAuthorized } from '../../../utils'
import { getUsersDemo } from './helpers'
import { UserDemo } from '../types'

// Aqui van los Query y Mutation para demoUserResolvers
export const demoUserResolvers = {
  Query: {
    getUsersDemo: async (
      _: GraphqlRoot, // Ignoren esto nunca lo he usado
      __: unknown, // En la segunda posicion vienen los parametros que mandamos desde el FE en este caso no mandamos nada
      { auth: { isAuth, user } }: CustomContext, // En la tercera vienen datos de gql y los que injectamos en el contexto mediante src/utils/createContext.ts (es decir sobre escribimos algunas cosas :) )
    ) => {
      // Siempre es posible obtener isAuth ya que lo estamos creando en
      // src/utils/createContext.ts y lo pasamos como parametro
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      // Si queremos podemos darle un nivel de autorizacion de momento tenemos tres policies
      // ACCESS_POLICY_ADMIN
      // ACCESS_POLICY_USER
      // ACCESS_POLICY_ADMIN_USER
      if (!isAuthorized(user?.rol || '', AppConstants.ACCESS_POLICY_ADMIN)) {
        throw new ForbiddenError(AppConstants.FORBIDDEN_ERROR)
      }

      const userData: UserDemo[] = await getUsersDemo()

      return userData
    },
  },
}
