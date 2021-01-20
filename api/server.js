const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const dotEnv = require('dotenv')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const connectDB = require('./utils/connectDB')
const Redis = require('ioredis')

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
})

const { verifyUser } = require('./utils/context')

dotEnv.config()

const app = express()

connectDB()

app.use(express.json())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    await verifyUser(req)
    return {
      email: req.email,
      userId: req.userId,
      token: req.headers.authorization,
      redis,
    }
  },
  formatError: (error) => {
    return {
      message: error.message,
    }
  },
})

apolloServer.applyMiddleware({ app, path: '/graphql' })

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on ${process.env.SERVER_PORT}`)
})
