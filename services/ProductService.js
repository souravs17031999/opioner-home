let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class ProductService {

    constructor() {
        this.productServiceUrl = (process.env.PRODUCT_SERVICE_URL || "http://localhost") + "/product"
        this.genericRestServiceClient = new genericRestService()
        this.loadPublicFeedsUrl = this.productServiceUrl + "/public/feeds"
        this.insertPublicFeedUrl = this.productServiceUrl + "/feed/upsert"
        this.handleLikeFeedBtnUrl = this.productServiceUrl + "/feed/status"
        this.getAllCommentsUrl = this.productServiceUrl + "/comments"
        this.updateCommentsUrl = this.productServiceUrl + "/public/comments" 
        this.handleBlockFeedUrl = this.productServiceUrl + "/feed/flag"
        this.renderAllPublicFeedsUrl = this.productServiceUrl + "/my/feed"
        this.deletePublicFeedsUrl = this.productServiceUrl + "/my/feed"
        this.updateUserStatusUrl = this.productServiceUrl + "/update-task-status"
        this.getLivenessUrl = this.productServiceUrl + "/status/live"
        this.getStatusUrl = this.productServiceUrl + "/status/health"
        logger.info(`[init] Register ProductService at ${this.productServiceUrl}`)
    }

    async loadPublicFeeds(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.loadPublicFeedsUrl + `?&page=${obj.query.page}&size=${obj.query.size}`, obj.headers.authorization)
            logger.info(`[loadPublicFeeds] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[loadPublicFeeds] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async insertPublicFeed(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.insertPublicFeedUrl, obj.body, obj.headers.authorization)
            logger.info(`[insertPublicFeed] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[insertPublicFeed] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async handleLikeFeedBtn(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.handleLikeFeedBtnUrl, obj.body, obj.headers.authorization)
            logger.info(`[handleLikeFeedBtn] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[handleLikeFeedBtn] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getAllComments(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getAllCommentsUrl + `?list_id=${obj.query.list_id}&user_id=${obj.query.user_id}`, obj.headers.authorization)
            logger.info(`[getAllComments] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[getAllComments] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async updateComments(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.updateCommentsUrl, obj.body, obj.headers.authorization)
            logger.info(`[updateComments] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[updateComments] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async handleBlockFeed(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.handleBlockFeedUrl, obj.body, obj.headers.authorization)
            logger.info(`[handleBlockFeed] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[handleBlockFeed] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async renderAllPublicFeeds(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.renderAllPublicFeedsUrl, obj.headers.authorization)
            logger.info(`[renderAllPublicFeeds] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[renderAllPublicFeeds] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async deletePublicFeeds(obj) {
        try {
            let resp = await this.genericRestServiceClient.delete(this.deletePublicFeedsUrl, obj.body, obj.headers.authorization)
            logger.info(`[deletePublicFeeds] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[deletePublicFeeds] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async updateUserStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.updateUserStatusUrl, obj.body, obj.headers.authorization)
            logger.info(`[updateUserStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[updateUserStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getLivenessStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getLivenessUrl)
            logger.info(`[getLivenessStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[getLivenessStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getHealthStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getStatusUrl)
            logger.info(`[getHealthStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[getHealthStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    

}