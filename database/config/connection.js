const mongoose = require('mongoose')
const connection = {}
require('dotenv').config()

module.exports = async () => {
  if (connection.isConnected) {
    console.log('=> using existing database connection')
    return
  }

  console.log('=> using new database connection')
  const db = await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  connection.isConnected = db.connections[0].readyState
}
