const express = require('express')
const router = express.Router()
// const authentication = require('../middlewares/authentication')
const UserController = require('../controllers/userController')

router.post('/googlesignin', UserController.googleSignIn)
router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router