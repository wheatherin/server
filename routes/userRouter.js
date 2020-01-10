const express = require('express')
const router = express.Router()
// const authentication = require('../middlewares/authentication')
const UserController = require('../controllers/userController')

router.post('/googlesignin', UserController.googleSignIn)


module.exports = router