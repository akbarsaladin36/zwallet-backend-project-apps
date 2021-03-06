const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const helper = require('../../helpers/wrapper')
const usersModel = require('./users_model')
// const nodemailer = require('nodemailer')
const fs = require('fs')

module.exports = {
  getAllUsersData: async (req, res) => {
    try {
      let { page, limit, sort, keywords } = req.query

      limit = limit || '6'
      page = page || '1'
      keywords = '%' + keywords + '%' || '%%'
      sort = sort || 'user_name ASC'

      page = parseInt(page)
      limit = parseInt(limit)
      const offset = page * limit - limit

      const totalData = await usersModel.getUsersDataCount(keywords)
      const totalPage = Math.ceil(totalData / limit)
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }

      const result = await usersModel.getAllUsers(limit, offset, keywords, sort)
      return helper.response(
        res,
        200,
        'Succes Get Data By Name',
        result,
        pageInfo
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  getUsersProfileById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await usersModel.getOneUserData(id)
      if (result.length > 0) {
        return helper.response(
          res,
          200,
          `Success get user profile by id ${id}`,
          result
        )
      } else {
        return helper.response(
          res,
          404,
          'User profile with id is not found.',
          null
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  updateUserVerifiedAccount: async (req, res) => {
    try {
      const { id } = req.params
      const result = await usersModel.updateUserData({ user_verify: 1 }, id)
      return helper.response(
        res,
        200,
        'Success verified your account. You can login right now.',
        result
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', null)
    }
  },

  updateUsersProfile: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const result = await usersModel.getOneUserData(id)

      if (result.length === 0) {
        return helper.response(
          res,
          404,
          `the data with ${id} is not found.`,
          null
        )
      }

      const { userPhone, userName } = req.body
      const setData = {
        user_phone: userPhone,
        user_name: userName
      }

      const newResult = await usersModel.updateUserData(setData, id)
      return helper.response(
        res,
        200,
        'The data with id is successfuly updated.',
        newResult
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', null)
    }
  },

  updatePin: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      let newPin = req.body.newPin
      const checkPin = /^[0-9]+$/.test(newPin)

      if (newPin.length !== 6 || checkPin === false) {
        return helper.response(res, 403, 'Pin must typed by number.')
      }

      const salt = bcrypt.genSaltSync(10)
      newPin = bcrypt.hashSync(newPin, salt)

      const result = await usersModel.updateUserData({ user_pin: newPin }, id)
      return helper.response(
        res,
        200,
        `Success updating a pi for user ${id}`,
        result
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', null)
    }
  },

  updateUserImage: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const setData = {
        user_image: req.file ? req.file.filename : '',
        user_updated_at: new Date(Date.now())
      }
      const updateData = await usersModel.getOneUserData(id)
      if (updateData.length > 0) {
        if (updateData.length > 0) {
          const imageDelete = updateData[0].user_image
          const imageExist = fs.existsSync(`src/uploads/${imageDelete}`)

          if (imageExist && imageDelete) {
            fs.unlink(`src/uploads/${imageDelete}`, (err) => {
              if (err) throw err
            })
          }
        }

        const result = await usersModel.updateUserData(setData, id)
        return helper.response(
          res,
          200,
          `Success uploading an profile image with ${id}`,
          result
        )
      } else {
        return helper.response(
          res,
          403,
          `the user image with ${id} is not found. Please try again.`,
          null
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  updateUserPassword: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const { userCurrentPassword, userNewPassword } = req.body

      const result = await usersModel.getOneUserData(id)
      if (result[0].length === 0) {
        return helper.response(res, 403, 'User data is not found', null)
      }

      const checkPassword = bcrypt.compareSync(
        userCurrentPassword,
        result[0].user_password
      )

      if (checkPassword) {
        const salt = bcrypt.genSaltSync(10)
        const userNewPassword1 = bcrypt.hashSync(userNewPassword, salt)
        const setData = {
          user_password: userNewPassword1
        }
        const newResult = await usersModel.updateUserData(setData, id)
        return helper.response(
          res,
          200,
          'Success updating a password users',
          newResult
        )
      } else {
        return helper.response(
          res,
          403,
          'Updating password is failed. Please try again.',
          null
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  deleteUserAccount: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const result = await usersModel.getOneUserData(id)
      if (result.length > 0) {
        const newResult = await usersModel.deleteOneUserData(id)
        return helper.response(
          res,
          200,
          'the user with id is deleted successfully',
          newResult
        )
      } else {
        return helper.response(res, 400, 'the user with id is not found.', null)
      }
    } catch (error) {
      return helper.response(res, 404, 'Bad Request', null)
    }
  },

  deleteUserImage: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const updateData = await usersModel.getOneUserData(id)
      if (updateData.length > 0) {
        if (updateData.length > 0) {
          const imageDelete = updateData[0].user_account_image
          const imageExist = fs.existsSync(`src/uploads/${imageDelete}`)

          if (imageExist && imageDelete) {
            fs.unlink(`src/uploads/${imageDelete}`, (err) => {
              if (err) throw err
            })
          }
        }
        const setData = {
          user_image: '',
          user_updated_at: new Date(Date.now())
        }
        const result = await usersModel.updateUserData(setData, id)
        return helper.response(
          res,
          200,
          `Success deleting an profile image with ${id}`,
          result
        )
      } else {
        return helper.response(
          res,
          403,
          `the user image with ${id} is not found. Please try again.`,
          null
        )
      }
    } catch (error) {
      return helper.response(res, 404, 'Bad Request', null)
    }
  }
}
