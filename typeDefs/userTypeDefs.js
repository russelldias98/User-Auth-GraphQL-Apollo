const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Mutation {
    signup(input: signupInput): signupReturn
    verifyOtp(input: verifyOtpInput): verifyOtpReturn
    resendOtp(email: String!): resendOtpReturn
    login(input: loginInput): loginReturn
  }

  input signupInput {
    name: String
    email: String
    password: String
  }

  input loginInput {
    email: String!
    password: String!
  }

  input verifyOtpInput {
    email: String!
    otp: String!
  }

  type signupReturn {
    success: Boolean!
    token: String!
  }

  type loginReturn {
    success: Boolean!
    token: String!
    user: User
  }

  type resendOtpReturn {
    success: Boolean!
    token: String
    message: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    verified: Boolean
    createdAt: String
    updatedAt: String
  }

  type verifyOtpReturn {
    success: Boolean!
    user: User!
  }
`
