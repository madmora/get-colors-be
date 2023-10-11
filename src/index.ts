import { startApolloServer } from './app'
import config from './config'

const main = async () => {
  try {
    await startApolloServer(config.port)
    console.log(`🚀 Server is ready at http://localhost:${config.port}/graphql`)
  } catch (err) {
    console.error('💀 Error starting the node server', err)
  }
}

void main()
