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
                const name = payloadData.given_name;
                res.status(200).json({token, name})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static register(req, res) {
        const { email, password } = req.body
        User.findOne({ email: email })
            .then(found => {
                if (!found) return User.create({ email, password })
                else res.status(409).json({ msg: 'Email address is already used, please use another' })
            })
            .then(user => {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET)
                console.log(token)
                res.status(200).json({ token })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static login(req, res) {
        const { email, password } = req.body
        User.findOne({ email: email })
            .then(user => {
                if (!user) res.status(409).json({ msg: 'Email isn\'t registered' })
                else {
                    if (user.password === password) {
                        const token = jwt.sign({ _id: user._id }, process.env.SECRET)
                        console.log(token)
                        res.status(200).json({ token })
                    } else {
                        console.log(err)
                        res.status(403).json({ msg: 'Password invalid' })
                    }
                }
            })
            .catch(err => {
                console.log(err)
                res.status(404).json({ msg: 'Email address isn\'t registered' })
            })
    }
}

module.exports = UserController