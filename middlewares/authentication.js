const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const userToken = req.headers.access_token
    if (userToken) {
        const authenticated = jwt.verify(userToken, process.env.SECRET)
        if (authenticated) {
            req.currentUserId = authenticated._id
            next()
        }
        else {
            res.status(401).json({
            msg: "user not logged in"
            })
        }
    }
    else {res.status(400).json({
        msg: "invalid token"
    })}
}