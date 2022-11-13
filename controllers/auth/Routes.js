const express = require('express')
const router = express.Router()
const authController = require('./AuthController')
const authRouteHandler = new authController()

router.post('/login/user', authRouteHandler.loginUser)

module.exports = router;
