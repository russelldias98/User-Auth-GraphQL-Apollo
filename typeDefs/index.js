const { gql } = require('apollo-server-express')
const userTypeDefs = require('./userTypeDefs')

const typeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`

module.exports = [typeDefs, userTypeDefs]
