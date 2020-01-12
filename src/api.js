const express = require('express')
const suggestionRouter = require('./suggestions')

const apiRouter = express.Router()

apiRouter.use('/suggestions', suggestionRouter)

module.exports = apiRouter