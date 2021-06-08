const express = require('express')
const router = express.Router()
const usersController = require('./users_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/upload')

router.get(
  '/',
  authMiddleware.userAuthentication,
  usersController.getAllUsersData
)
router.get(
  '/:id',
  authMiddleware.userAuthentication,
  usersController.getUsersProfileById
)
router.patch(
  '/update-profile',
  authMiddleware.userAuthentication,
  uploadFile,
  usersController.updateUsersProfile
)
router.patch(
  '/update-pin',
  authMiddleware.userAuthentication,
  uploadFile,
  usersController.updatePin
)
router.patch(
  '/update-password',
  authMiddleware.userAuthentication,
  uploadFile,
  usersController.updateUserPassword
)

module.exports = router
