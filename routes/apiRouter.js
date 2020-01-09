const express = require('express');
const apiRouter = express.Router();
const apiController = require('../controllers/apiController')

apiRouter.get('/current/:city', apiController.currentWeather)

module.exports = apiRouter