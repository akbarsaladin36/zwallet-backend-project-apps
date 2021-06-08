const express = require('express')
const router = express.Router()

const { registerUserAccount, loginUserAccount } = require('./auth_controller')

router.post('/login', loginUserAccount)
router.post('/register', registerUserAccount)

module.exports = router
