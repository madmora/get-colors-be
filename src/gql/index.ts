import { gql } from 'apollo-server-express'
import { typeDefs as User, resolvers as UserResolvers } from './user'
import { typeDefs as GlobalTypeDefs } from './typeDefs'
const schemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`

const rootQuery = gql`
  type Query {
    _: String
  }
`

const rootMutation = gql`
  type Mutation {
    _: String
  }
`

export const typeDefs = [
  schemaDefinition,
  rootQuery,
  rootMutation,
  User,
  GlobalTypeDefs,
]

export const resolvers = [UserResolvers]
