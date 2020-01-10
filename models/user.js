const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email: String,
    googleSignIn: Boolean,
    password: String
})

const User = mongoose.model('User', userSchema)

module.exports = User