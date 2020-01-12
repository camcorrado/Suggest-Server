const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const cors = require('cors')
const bodyParser = require('body-parser')
const apiRouter = require('./api')

const app = express()

const PORT = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
)
app.use(morgan('dev'))

app.use('/api', apiRouter)

app.use(errorhandler())

app.listen(PORT, () => {
    console.log('Server listening on port: ' + PORT)
})

module.exports = app 