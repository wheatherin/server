const router = require('express').Router();

const userRouter = require('../routes/userRouter')

// >>>>>>> 80cbe3dcea53ec457856f3ecdb05e55cea34af45

const apiRouter = require('./apiRouter')


// router.use('/user', userRouter)
router.use('/api', apiRouter)


module.exports = router