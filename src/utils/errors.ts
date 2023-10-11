import { ApolloError } from 'apollo-server-errors'

export const internalServerError = (message: string) => {
  throw new ApolloError(message, 'INTERNAL_SERVER_ERROR')
}
