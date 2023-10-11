import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  interface ProcessCode {
    code: String
  }
`
