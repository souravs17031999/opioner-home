const express = require('express')
const router = express.Router()
const productController = require('./ProductController')
const productRouteHandler = new productController()

router.get('/product/public/feeds', productRouteHandler.loadPublicFeeds)
router.post('/product/feed/upsert', productRouteHandler.insertPublicFeed)
router.put('/product/feed/status', productRouteHandler.handleLikeFeedBtn)
router.get('/product/comments', productRouteHandler.getAllComments)
router.put('/product/public/comments', productRouteHandler.updateComments)
router.post('/product/feed/flag', productRouteHandler.handleBlockFeed)
router.get('/product/my/feed', productRouteHandler.renderAllPublicFeeds)
router.delete('/product/my/feed', productRouteHandler.deletePublicFeeds)
router.post('/product/update-task-status', productRouteHandler.updateUserStatus)
router.get('/status/live', productRouteHandler.getLivenessStatus)
router.get('/status/health', productRouteHandler.getHealthStatus)

module.exports = router;
