import { gql } from 'apollo-server-express'

/**
 * Estos son los tipos de gql no de type script por eso UserDemo
 * se declara en dos lugares diferentes
 */
export const typeDefs = gql`
  extend type Query {
    getUsersDemo: [UserDemo]
  }

  type UserDemo {
    activo: Int
    cedula: String
    email: String
    nombre: String
    apellidos: String
    direccion: String
    rol: String
  }
`
