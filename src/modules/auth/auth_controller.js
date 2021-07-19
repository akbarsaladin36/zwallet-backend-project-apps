const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../../helpers/wrapper')
const authModel = require('./auth_model')
const nodemailer = require('nodemailer')
require('dotenv').config()

module.exports = {
  registerUserAccount: async (req, res) => {
    try {
      const { userEmail, userName, userPassword, userPhone } = req.body

      const checkEmailUser = await authModel.getUserDataCondition({
        user_email: userEmail
      })

      if (checkEmailUser.length > 0) {
        return helper.response(res, 400, 'Email is exists.please try again')
      } else {
        const salt = bcrypt.genSaltSync(10)
        const encryptPassword = bcrypt.hashSync(userPassword, salt)
        const setData = {
          user_email: userEmail,
          user_name: userName,
          user_password: encryptPassword,
          user_phone: userPhone,
          user_verify: 0
        }
        const result = await authModel.registerUser(setData)
        delete result.user_password
        await authModel.addBalanceData({ user_id: result.id, balance: 0 })

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
          }
        })

        const mailOptions = {
          from: '"Zwallet Admin" <adminTickitz.gmail.com>',
          to: result.user_email,
          subject: 'Zwallet- Activation Email',
          html: `<b>Congratulation! Now you can activate your account now. Please click this link to activate it.</b><a href="http://localhost:5000/backend4/api/v1/users/user-activation/${result.id}">Click!</>`
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
            return helper.response(res, 400, 'Email not send !')
          } else {
            console.log('Email have been sent to:' + info.response)
            return helper.response(
              res,
              200,
              'Email verification is sent. Please check your email.'
            )
          }
        })

        return helper.response(
          res,
          200,
          'User is successfully created.',
          result
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', null)
    }
  },

  loginUserAccount: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const checkEmailUser = await authModel.getUserDataCondition({
        user_email: userEmail
      })
      if (checkEmailUser.length > 0) {
        const checkPassword = bcrypt.compareSync(
          userPassword,
          checkEmailUser[0].user_password
        )
        if (checkPassword) {
          const payload = {
            user_id: checkEmailUser[0].user_id,
            user_email: checkEmailUser[0].user_email,
            user_pin: checkEmailUser[0].user_pin
          }
          delete payload.user_password
          const token = jwt.sign({ ...payload }, 'AKBARSALADIN1995', {
            expiresIn: '24h'
          })
          const result = { ...payload, token }
          return helper.response(
            res,
            200,
            'User is successfully logged in to website',
            result
          )
        } else {
          return helper.response(
            res,
            404,
            'Password is incorrect. please try again.',
            null
          )
        }
      } else {
        return helper.response(
          res,
          400,
          'Email is incorrect. Please try again.',
          null
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', null)
    }
  }
}
