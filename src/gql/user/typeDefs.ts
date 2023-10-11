import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  extend type Mutation {
    signIn(input: SignInInput!): UserAuth!
    deleteUser(input: DeleteUserInput!): DeleteUserResponse!
    activateUser(input: ActivateUserInput!): ActivateUserResponse!
    editUser(input: EditUserInput!): EditUserResponse!
    editPassword(input: EditPasswordInput!): EditPasswordResponse!
    requestPasswordReset(
      input: RequestPasswordResetInput!
    ): RequestPasswordResetResponse!
    resetPassword(input: ResetPasswordInput!): ResetPasswordResponse!
  }

  extend type Query {
    signUp(input: SignUpInput!): UserAuth!
    getUsers: [User]
  }

  input SignInInput {
    cedula: String!
    email: String!
    nombre: String!
    apellidos: String!
    direccion: String!
    password: String!
    rol: String!
    responsable: String!
  }

  input SignUpInput {
    responsableId: String!
    password: String!
  }

  input DeleteUserInput {
    responsable: String!
    cedula: String!
  }

  input ActivateUserInput {
    responsable: String!
    cedula: String!
  }

  input EditUserInput {
    cedulaActual: String!
    emailActual: String!
    cedula: String!
    email: String!
    nombre: String!
    apellidos: String!
    direccion: String!
    rol: String!
    responsable: String!
  }

  input EditPasswordInput {
    oldPassword: String!
    newPassword: String!
    responsable: String!
  }

  input RequestPasswordResetInput {
    email: String!
    domain: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  type UserAuth implements ProcessCode {
    code: String!
    authorization: String
    user: User
  }

  type User {
    activo: Int
    cedula: String!
    email: String!
    nombre: String!
    apellidos: String!
    direccion: String!
    rol: String!
  }

  type DeleteUserResponse implements ProcessCode {
    code: String!
  }

  type ActivateUserResponse implements ProcessCode {
    code: String!
  }

  type EditUserResponse implements ProcessCode {
    code: String!
  }

  type EditUserResponse implements ProcessCode {
    code: String!
  }

  type EditPasswordResponse implements ProcessCode {
    code: String!
  }

  type RequestPasswordResetResponse implements ProcessCode {
    code: String!
  }

  type ResetPasswordResponse implements ProcessCode {
    code: String!
  }
`
