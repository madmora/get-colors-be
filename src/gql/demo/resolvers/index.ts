import { demoUserResolvers } from './demoUser'

// Si se separan los resolvers en archivos solo los
// exportamos como un array de lo contrario usamos el
// aproach de users que tiene un resolver gigante
export const resolvers = [demoUserResolvers]
