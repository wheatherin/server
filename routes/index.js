const router = require('express').Router();
const userRouter = require('../routes/')


router.use('/user', userRouter)
// router.use('/user', repoRouter)


module.exports = router