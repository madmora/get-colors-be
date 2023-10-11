import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { createContext } from './utils'
import { ExpressContext } from 'apollo-server-express'
import { typeDefs, resolvers } from './gql'
import cors from 'cors'
import express, { Express } from 'express'
import http from 'http'
import { CustomContext } from './types'
import { MySQLConnectorInit } from './database'

export const startApolloServer = async (port: string) => {
  MySQLConnectorInit()

  const app: Express = express()

  const corsOptions = {}

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.get('/', (_, res) => {
    res.json({
      message: 'Welcome to my Products API',
    })
  })

  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async (ctx: ExpressContext): Promise<CustomContext> =>
      await createContext(ctx),
  })
  await server.start()

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: /(localhost|qa-service-platform-fe.herokuapp.com)(.+)?/,
    },
  })

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once('listening', resolve).once('error', reject)
  })
}
