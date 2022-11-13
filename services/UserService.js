let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class UserService {

    constructor() {
        logger.info("[init] Register UserService")
        this.userServiceUrl = (process.env.USER_SERVICE_URL || "http://localhost") + "/user"
        this.genericRestServiceClient = new genericRestService()
        this.profilePicUrl = this.userServiceUrl + "/profile-pic"
        this.dataUserUrl = this.userServiceUrl + "/data"
        this.subscriptionUrl = this.userServiceUrl + "/subscription"
        this.getLivenessUrl = this.userServiceUrl + "/status/live"
        this.getUserStatusUrl = this.userServiceUrl + "/status"
        this.getStatusUrl = this.userServiceUrl + "/status/health"
    }

    async updateProfilePic(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.profilePicUrl, obj.body)
            logger.info("[updateProfilePic] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[updateProfilePic] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getUserData() {
        try {
            let resp = await this.genericRestServiceClient.get(this.dataUserUrl)
            logger.info("[getUserData] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[getUserData] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async setSubscription(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.subscriptionUrl, obj.body)
            logger.info("[setSubscription] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[setSubscription] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getUserStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.getUserData, obj.body)
            logger.info("[getUserStatus] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[getUserStatus] ERROR: ${error}`)
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