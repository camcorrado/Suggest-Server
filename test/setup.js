const { expect } = require('chai')
const supertest = require('supertest')
process.env.NODE_ENV = 'test'
process.env.TZ = 'UTC'
require('dotenv').config()


global.expect = expect
global.supertest = supertest