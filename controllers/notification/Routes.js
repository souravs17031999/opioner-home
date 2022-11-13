const express = require('express')
const router = express.Router()
const notificationController = require('./NotificationController')
const notificationRouteHandler = new notificationController()

router.post('/notification/me', notificationRouteHandler.handleInitiateNotify)
router.get('/notification/all', notificationRouteHandler.fetchAllUserNotifications)
router.put('/notification/status', notificationRouteHandler.updateNotificationStatus)
router.get('/notification/unread-count', notificationRouteHandler.fetchUnreadNotifications)
router.post('/notification/unsubscribe-notification', notificationRouteHandler.unsubscribeNotifications)
router.get('/status/live', notificationRouteHandler.getLivenessStatus)
router.get('/status/health', notificationRouteHandler.getHealthStatus)

module.exports = router;
