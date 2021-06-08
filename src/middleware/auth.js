const helper = require('../helpers/wrapper')
const jwt = require('jsonwebtoken')

module.exports = {
  userAuthentication: (req, res, next) => {
    let token = req.headers.authorization
    if (token) {
      token = token.split(' ')[1]
      // Proses Token divalidasi
      jwt.verify(token, 'AKBARSALADIN1995', (error, result) => {
        if (
          (error && error.name === 'JsonWebTokenError') ||
          (error && error.name === 'TokenExpiredError')
        ) {
          return helper.response(res, 403, error.message)
        } else {
          req.decodeToken = result
          next()
        }
      })
    } else {
      return helper.response(res, 403, 'Please login first to the website.')
    }
  },

  isAdmin: (req, res, next) => {
    if (req.decodeToken.user_account_status === 'admin') {
      next()
    } else {
      return helper.response(res, 403, 'This website can be accessed by admin.')
    }
  }
}
