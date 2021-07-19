const express = require('express')
const router = express.Router()
const usersController = require('./users_controller')
const authMiddleware = require('../../middleware/auth')
const uploadFile = require('../../middleware/upload')

router.get('/user-activation/:id', usersController.updateUserVerifiedAccount)

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
  usersController.updateUsersProfile
)
router.patch(
  '/update-pin',
  authMiddleware.userAuthentication,
  usersController.updatePin
)
router.patch(
  '/update-password',
  authMiddleware.userAuthentication,
  usersController.updateUserPassword
)
router.patch(
  '/update-image',
  authMiddleware.userAuthentication,
  uploadFile,
  usersController.updateUserImage
)

router.patch(
  '/delete-image',
  authMiddleware.userAuthentication,
  uploadFile,
  usersController.deleteUserImage
)

module.exports = router
