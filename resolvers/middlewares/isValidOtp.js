const { skip } = require('graphql-resolvers')

const isValidOtp = async (_, { input: { otp, email } }, { redis }) => {
  try {
    const response = await redis.get(`${email}_OTP`)
    const isValid = response === otp
    if (!isValid) {
      return new Error('Invalid OTP!')
    }
    return skip
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = isValidOtp
