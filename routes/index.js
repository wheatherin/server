const router = require('express').Router();
const userRouter = require('../routes/userRouter')


router.use('/user', userRouter)
// router.use('/user', repoRouter)


module.exports = router