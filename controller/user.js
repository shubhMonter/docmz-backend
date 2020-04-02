var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../database/config/connection.js')
const User = require('../database/models/User.js')

module.exports = {
async signin(req,res){
  try {
    const email = req.body.email
    const password = req.body.password

    const db = await connectToDatabase()
    return User.findOne({email:email}).exec().then((user) =>{
      if(!user) return res.status(401).send({success:false,message:'No user found'})
      if(bcrypt.compareSync(password, user.password)) {
      var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.SECRETKEY, {expiresIn: 86400 * 30});
           jwt.verify(token, process.env.SECRETKEY, function(err, data){
           })
           return res.json({success: true, id:user.id, token: 'JWT ' + token})
      }
      else {
       return res.status(401).send({success: false, message: 'Authentication failed. Wrong password.'});
      }
    })


  } catch (err) {
    return res.status(400).send(err)
  }
},

 async signup(req,res){
  try {

    const email = req.body.email
    const password = req.body.password
    const username = email.split('@')[0]

    const db = await connectToDatabase()

    const user = new User({
      username: username,
      email: email,
      password:password,
      role:'admin'
    })

    return user.save().then((user) => res.status(201).send(user))

  } catch (err) {
    return res.status(400).send(err)
  }
}

}
