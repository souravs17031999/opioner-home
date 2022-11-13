let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class AuthService {

    constructor() {
        this.authServiceUrl = (process.env.AUTH_SERVICE_URL || "http://localhost") + "/auth"
        this.genericRestServiceClient = new genericRestService()
        this.getLivenessStateUrl = this.authServiceUrl + "/status/live"
        this.getStatusUrl = this.authServiceUrl + "/status/health"
        logger.info(`[init] Register AuthService at ${this.authServiceUrl}`)
    }

    async getLivenessStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.getLivenessStateUrl)
            logger.info(`[getLivenessStatus] resp: ${resp}`,)
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