const express = require('express')
const router = express.Router()
const authController = require('./AuthController')
const authRouteHandler = new authController()

router.get('/status/live', authRouteHandler.getLivenessStatus)
router.get('/status/health', authRouteHandler.getHealthStatus)

module.exports = router;
