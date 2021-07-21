const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const helper = require('../../helpers/wrapper')
const transactionModel = require('./transaction_model')

module.exports = {
  getUsersBalance: async (req, res) => {
    try {
      const userId = req.decodeToken.user_id
      const result = await transactionModel.getOneBalanceData(userId)
      return helper.response(
        res,
        200,
        'Get a users balance successfully',
        result
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  getUsersBalanceById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await transactionModel.getOneBalanceData(id)
      return helper.response(
        res,
        200,
        'Get a users balance successfully',
        result
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  getTransactionHistory: async (req, res) => {
    try {
      const userId = req.decodeToken.user_id
      let { sort, limit } = req.query
      limit = limit || 10
      let condition = ''

      if (sort) {
        if (sort === 'week') {
          condition =
            ' AND YEARWEEK(`transaction_created_at`, 1) = YEARWEEK(CURDATE(), 1)'
        } else {
          condition = ' AND MONTH(`transaction_created_at`) = MONTH(CURDATE())'
        }
      }

      const result = await transactionModel.getTransactionData(
        userId,
        condition,
        parseInt(limit)
      )

      for (const transaction of result) {
        if (!transaction.transaction_type) {
          transaction.receiverDetail =
            await transactionModel.getUsersDetailData(
              transaction.transaction_receiver_id
            )
          transaction.senderDetail = await transactionModel.getUsersDetailData(
            transaction.transaction_sender_id
          )
        } else {
          transaction.receiverDetail =
            await transactionModel.getUsersDetailData(
              transaction.transaction_receiver_id
            )
        }
      }

      return helper.response(
        res,
        200,
        'Success get a transaction history from users.',
        result
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  getTransactionSummary: async (req, res) => {
    try {
      const userId = req.decodeToken.user_id
      const transactionPerDay =
        await transactionModel.getTotalTransactionPerDayData(userId)
      const amountIn = await transactionModel.getTotalAmountInData(userId)
      const amountOut = await transactionModel.getTotalAmountOutData(userId)

      const result = {
        transactionPerDay:
          transactionPerDay.length > 0 ? transactionPerDay : null,
        amountIn: amountIn.length > 0 ? amountIn[0].total_amount : null,
        amountOut: amountOut.length > 0 ? amountOut[0].total_amount : null
      }

      return helper.response(
        res,
        200,
        'Success get a transaction summary data',
        result
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  transferMoney: async (req, res) => {
    try {
      let { transactionType, transactionAmount, senderPin, receiverId } =
        req.body

      const senderId = req.decodeToken.user_id
      transactionAmount = parseInt(transactionAmount) || 0

      if (transactionType) {
        let userBalance = await transactionModel.getOneBalanceData(
          req.decodeToken.user_id
        )
        userBalance += transactionAmount
        await transactionModel.updateOneBalanceData(
          { balance: userBalance },
          req.decodeToken.user_id
        )

        const result = await transactionModel.addTransactionData({
          transaction_type: transactionType,
          transaction_receiver_id: req.decodeToken.user_id,
          transaction_amount: transactionAmount,
          transaction_status: 1
        })

        return helper.response(res, 200, 'Top Up has been success!', result)
      } else {
        const senderPinDb = await transactionModel.getOnePinData(senderId)
        const checkValidPin = bcrypt.compareSync(senderPin, senderPinDb)

        if (!checkValidPin) {
          return helper.response(res, 400, 'Pin is not match', null)
        }

        let senderBalance = await transactionModel.getOneBalanceData(senderId)
        senderBalance -= transactionAmount
        if (senderBalance < 0) {
          return helper.response(
            res,
            400,
            'Insufficient funds for sender. Please top up now.',
            null
          )
        }

        let receiverBalance = await transactionModel.getOneBalanceData(
          receiverId
        )
        if (receiverBalance < 0) {
          return helper.response(
            res,
            400,
            'the receiver data is not found.',
            null
          )
        }
        receiverBalance += transactionAmount

        console.log(senderBalance, receiverBalance)

        await transactionModel.updateOneBalanceData(
          { balance: receiverBalance },
          receiverId
        )
        await transactionModel.updateOneBalanceData(
          { balance: senderBalance },
          senderId
        )

        const result = await transactionModel.addTransactionData({
          transaction_sender_id: senderId,
          transaction_receiver_id: receiverId,
          transaction_amount: transactionAmount,
          transaction_status: 1
        })

        return helper.response(
          res,
          200,
          'Transaction has been successfull!',
          result
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  }
}
