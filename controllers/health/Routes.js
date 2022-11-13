const express = require('express')
const router = express.Router()
const healthController = require('./HealthController')
const healthRouteHandler = new healthController()

router.get('/health', healthRouteHandler.getStatus)

module.exports = router;