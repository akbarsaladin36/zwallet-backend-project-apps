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
router.post(
  '/',
  authMiddleware.userAuthentication,
  transactionController.transferMoney
)

router.post(
  '/top-up',
  authMiddleware.userAuthentication,
  transactionController.topupMoney
)

module.exports = router
