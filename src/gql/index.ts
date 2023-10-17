import { gql } from 'apollo-server-express'
import { typeDefs as User, resolvers as UserResolvers } from './user'
// En este index se importan todos los nuevos resolvers y type definitions que hagamos
import { typeDefs as Demo, resolvers as DemoResolvers } from './demo'
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
  // Solo agregamos el nuevo typeDef al array
  Demo,
  GlobalTypeDefs,
]

// Solo agregamos el nuevo resolver al array
export const resolvers = [UserResolvers, DemoResolvers]
