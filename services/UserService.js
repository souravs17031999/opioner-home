let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class UserService {

    constructor() {
        this.userServiceUrl = (process.env.USER_SERVICE_URL || "http://localhost") + "/user"
        this.genericRestServiceClient = new genericRestService()
        this.upsertUserUrl = this.userServiceUrl + "/data"
        this.subscriptionUrl = this.userServiceUrl + "/subscription"
        this.getLivenessUrl = this.userServiceUrl + "/status/live"
        this.getUserStatusUrl = this.userServiceUrl + "/status"
        this.getStatusUrl = this.userServiceUrl + "/status/health"
        logger.info(`[init] Register UserService at ${this.userServiceUrl}`)
    }

    async checkUpsertUser(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.upsertUserUrl, obj.body, obj.headers.authorization)
            logger.info(`[checkUpsertUser] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[checkUpsertUser] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async setSubscription(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.subscriptionUrl, obj.body, obj.headers.authorization)
            logger.info(`[setSubscription] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[setSubscription] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getUserStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.getUserData, obj.body, obj.headers.authorization)
            logger.info(`[getUserStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[getUserStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getLivenessStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getLivenessUrl, obj.headers.authorization)
            logger.info(`[getLivenessStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[getLivenessStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async getHealthStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getStatusUrl, obj.headers.authorization)
            logger.info(`[getHealthStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[getHealthStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    

}