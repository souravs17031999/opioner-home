const express = require('express')
const router = express.Router()
const authController = require('./auth/Routes')
const userController = require('./user/Routes')
const productController = require('./product/Routes')
const notificationController = require('./notification/Routes')
const healthController = require('./health/Routes')

router.use('/auth', authController)
router.use('/user', userController)
router.use('/product', productController)
router.use('/notification', notificationController)
router.use('/status', healthController)

module.exports = router;