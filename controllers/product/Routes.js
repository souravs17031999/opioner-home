const express = require('express')
const router = express.Router()
const productController = require('./ProductController')
const productRouteHandler = new productController()

router.get('/public/feeds', productRouteHandler.loadPublicFeeds)
router.post('/feed/upsert', productRouteHandler.insertPublicFeed)
router.put('/feed/status', productRouteHandler.handleLikeFeedBtn)
router.get('/comments', productRouteHandler.getAllComments)
router.put('/public/comments', productRouteHandler.updateComments)
router.post('/feed/flag', productRouteHandler.handleBlockFeed)
router.get('/my/feed', productRouteHandler.renderAllPublicFeeds)
router.delete('/my/feed', productRouteHandler.deletePublicFeeds)
router.post('/update-task-status', productRouteHandler.updateUserStatus)
router.get('/status/live', productRouteHandler.getLivenessStatus)
router.get('/status/health', productRouteHandler.getHealthStatus)

module.exports = router;
