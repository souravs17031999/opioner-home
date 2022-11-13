const express = require('express')
const router = express.Router()
const userController = require('./UserController')
const userRouteHandler = new userController()

router.post('/data', userRouteHandler.checkUpsertUser)
router.post('/subscription', userRouteHandler.setSubscription)
router.get('/status/live', userRouteHandler.getLivenessStatus)
router.get('/status/health', userRouteHandler.getHealthStatus)
router.post('/status', userRouteHandler.getUserStatus)

module.exports = router;
