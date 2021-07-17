const connection = require('../../config/mysql')

module.exports = {
  getAllUsers: (limit, offset, keywords, sort) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE user_phone LIKE ? ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [keywords, limit, offset],
        (error, result) => {
          // console.log(error)
          // console.log(result)
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  getUsersDataCount: (keywords) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) AS total FROM users WHERE user_phone LIKE ?',
        keywords,
        (error, result) => {
          if (!error) {
            resolve(result[0].total)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  getOneUserData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users WHERE user_id = ?',
        id,
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

  updateUserData: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET ? WHERE user_id=?',
        [data, id],
        (error, result) => {
          // console.log(error)
          // console.log(result)
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

  deleteOneUserData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM users WHERE user_id=?',
        id,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
