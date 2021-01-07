const { connect } = require('mongoose')

const connectDB = async () => {
  try {
    await connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Mongo Connected')
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = connectDB
w
