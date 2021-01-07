const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports.verifyUser = async (req) => {
  try {
    req.email = null
    req.userId = null
    const token = req.headers.authorization
    if (token) {
      const clientToken = token.split(' ')[1]
      const payload = await jwt.verify(clientToken, process.env.JWT_SECRET)
      req.email = payload.email
      const user = await User.findOne({ email: payload.email })
      if (user) {
        req.userId = user.id
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
