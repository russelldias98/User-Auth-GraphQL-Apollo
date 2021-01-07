const { skip } = require('graphql-resolvers')

const isValidToken = async (_, { input: { email } }, { redis, token }) => {
  try {
    const response = await redis.get(`${email}_TOKEN`)
    const isValid = response === token.split(' ')[1]
    if (!isValid) {
      return new Error('Token expired!')
    }
    return skip
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = isValidToken
