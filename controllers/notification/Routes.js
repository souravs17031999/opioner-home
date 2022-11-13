const express = require('express')
const router = express.Router()
const notificationController = require('./NotificationController')
const notificationRouteHandler = new notificationController()

router.post('/me', notificationRouteHandler.handleInitiateNotify)
router.get('/all', notificationRouteHandler.fetchAllUserNotifications)
router.put('/status', notificationRouteHandler.updateNotificationStatus)
router.get('/unread-count', notificationRouteHandler.fetchUnreadNotifications)
router.post('/unsubscribe-notification', notificationRouteHandler.unsubscribeNotifications)
router.get('/status/live', notificationRouteHandler.getLivenessStatus)
router.get('/status/health', notificationRouteHandler.getHealthStatus)

module.exports = router;
