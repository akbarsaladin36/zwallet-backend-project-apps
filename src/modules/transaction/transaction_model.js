const connection = require('../../config/mysql')

module.exports = {
  getOnePinData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT user_pin FROM users WHERE user_id=?',
        id,
        (error, result) => {
          if (!error) {
            resolve(result[0] ? result[0].user_pin : null)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  getOneBalanceData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT balance FROM balance WHERE user_id=?',
        id,
        (error, result) => {
          if (!error) {
            resolve(result[0] ? result[0].balance : -1)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  updateOneBalanceData: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE balance SET ? WHERE user_id=?',
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...data
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  getTransactionData: (id, condition, limit) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM transaction WHERE (transaction_sender_id = ? OR transaction_receiver_id = ?)${condition} ORDER BY transaction_id DESC LIMIT ?`,
        [id, id, limit],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  getUsersDetailData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT user_email, user_phone, user_name, user_email FROM users WHERE user_id=?',
        id,
        (error, result) => {
          if (!error) {
            resolve(result[0] ? result[0].user_pin : null)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  addTransactionData: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO transaction SET ?',
        setData,
        (error, result) => {
          console.log(error)
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
