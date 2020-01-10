const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_TOKEN);
const jwt = require('jsonwebtoken')
const User = require('../models/user')

class UserController {
    static googleSignIn(req, res) {
        let payloadData

        client.verifyIdToken({
            idToken: req.body.google_token,
            audience: process.env.CLIENT_ID
        })
            .then(ticket => {
                payloadData = ticket.getPayload()
                return User.findOne({email: payloadData.email})
            })
            .then(userData => {
                if(!userData) {
                    return User.create({
                        email: payloadData.email,
                        googleSignIn: true
                    })
                }
                else {
                    return userData
                }
            })
            .then(user => {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET)
                res.status(200).json({token})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }
}

module.exports = UserController