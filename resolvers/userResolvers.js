const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { combineResolvers } = require('graphql-resolvers')
const isValidOtp = require('../resolvers/middlewares/isValidOtp')
const isValidToken = require('../resolvers/middlewares/isValidToken')

module.exports = {
  Mutation: {
    signup: async (_, { input }, { redis }) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 12)
        const newUser = new User({
          ...input,
          password: hashedPassword,
          verified: false,
        })
        const user = await newUser.save()
        if (user) {
          redis.setex(`${input.email}_OTP`, 60 * 15, Math.floor(Math.random() * (100000 - 999999 + 1)) + 999999)
          const token = jwt.sign(
            {
              email: input.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1h',
            },
          )
          redis.setex(`${input.email}_TOKEN`, 3600, token)
          return {
            success: true,
            token,
          }
        } else {
          return {
            success: false,
          }
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    verifyOtp: combineResolvers(isValidToken, isValidOtp, async (_, { input: { email } }, { redis }) => {
      try {
        const user = await User.findOneAndUpdate(email, { verified: true }, { new: true })
        redis.del(`${email}_OTP`)
        return {
          success: true,
          user: { ...user._doc, id: user._doc._id },
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    }),
    resendOtp: async (_, { email }, { redis }) => {
      try {
        const user = await User.findOne({ email: email })
        if (user.verified) {
          return {
            success: true,
            token: null,
            message: 'User has been verified!',
          }
        }
        redis.setex(`${email}_OTP`, 60 * 15, Math.floor(Math.random() * (10000 - 99999 + 1)) + 99999)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        redis.setex(`${email}_TOKEN`, 3600, token)
        return {
          success: true,
          token,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    login: async (_, { input: { email, password } }, { redis }) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          return new Error('User does not exist!')
        }
        console.log(user)
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return new Error('Invalid password!')
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        redis.setex(`${email}_TOKEN`, 3600, token)
        return {
          success: true,
          token: token,
          user,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
}
