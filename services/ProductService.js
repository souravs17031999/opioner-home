let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class ProductService {

    constructor() {
        logger.info("[init] Register ProductService")
        this.productServiceUrl = (process.env.PRODUCT_SERVICE_URL || "http://localhost") + "/product"
        this.genericRestServiceClient = new genericRestService()
        this.loadPublicFeedsUrl = this.productServiceUrl + "/product/public/feeds"
        this.insertPublicFeedUrl = this.productServiceUrl + "/product/feed/upsert"
        this.handleLikeFeedBtnUrl = this.productServiceUrl + "/product/feed/status"
        this.getAllCommentsUrl = this.productServiceUrl + "/product/comments"
        this.updateCommentsUrl = this.productServiceUrl + "/product/public/comments" 
        this.handleBlockFeedUrl = this.productServiceUrl + "/product/feed/flag"
        this.renderAllPublicFeedsUrl = this.productServiceUrl + "/product/my/feed"
        this.deletePublicFeedsUrl = this.productServiceUrl + "/product/my/feed"
        this.updateUserStatusUrl = this.productServiceUrl + "/product/update-task-status"
        this.getLivenessUrl = this.productServiceUrl + "/status/live"
        this.getStatusUrl = this.productServiceUrl + "/status/health"
    }

    async loadPublicFeeds(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.loadPublicFeedsUrl + `?&page=${obj.query.page}&size=${obj.query.size}`)
            logger.info("[loadPublicFeeds] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[loadPublicFeeds] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async insertPublicFeed(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.insertPublicFeedUrl, obj.body)
            logger.info("[insertPublicFeed] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[insertPublicFeed] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async handleLikeFeedBtn(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.handleLikeFeedBtnUrl, obj.body)
            logger.info("[handleLikeFeedBtn] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[handleLikeFeedBtn] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getAllComments(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getAllCommentsUrl + `?list_id=${obj.query.list_id}&user_id=${obj.query.user_id}`)
            logger.info("[getAllComments] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[getAllComments] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async updateComments(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.updateCommentsUrl, obj.body)
            logger.info("[updateComments] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[updateComments] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async handleBlockFeed(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.handleBlockFeedUrl, obj.body)
            logger.info("[handleBlockFeed] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[handleBlockFeed] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async renderAllPublicFeeds(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.renderAllPublicFeedsUrl)
            logger.info("[renderAllPublicFeeds] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[renderAllPublicFeeds] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async deletePublicFeeds(obj) {
        try {
            let resp = await this.genericRestServiceClient.delete(this.deletePublicFeedsUrl, obj.body)
            logger.info("[deletePublicFeeds] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[deletePublicFeeds] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async updateUserStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.updateUserStatusUrl, obj.body)
            logger.info("[updateUserStatus] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[updateUserStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getLivenessStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getLivenessUrl)
            logger.info("[getLivenessStatus] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[getLivenessStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getHealthStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getStatusUrl)
            logger.info("[getHealthStatus] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[getHealthStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    

}