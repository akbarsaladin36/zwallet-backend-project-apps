const express = require('express')
const Route = express.Router()
const authRouter = require('../modules/auth/auth_routes')
const usersRouter = require('../modules/users/users_routes')
const transactionRouter = require('../modules/transaction/transaction_routes')

Route.use('/auth', authRouter)
Route.use('/users', usersRouter)
Route.use('/transaction', transactionRouter)

module.exports = Route
