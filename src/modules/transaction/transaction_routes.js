const express = require('express')
const router = express.Router()
const transactionController = require('./transaction_controller')
const authMiddleware = require('../../middleware/auth')

router.get(
  '/',
  authMiddleware.userAuthentication,
  transactionController.getTransactionHistory
)
router.get(
  '/balance',
  authMiddleware.userAuthentication,
  transactionController.getUsersBalance
)

router.get(
  '/balance/:id',
  authMiddleware.userAuthentication,
  transactionController.getUsersBalanceById
)

router.get(
  '/summary',
  authMiddleware.userAuthentication,
  transactionController.getTransactionSummary
)

router.post(
  '/',
  authMiddleware.userAuthentication,
  transactionController.transferMoney
)

module.exports = router
