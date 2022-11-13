let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class UserService {

    constructor() {
        this.authServiceUrl = (process.env.AUTH_SERVICE_URL || "http://localhost") + "/user"
        this.genericRestServiceClient = new genericRestService()
        this.profilePicUrl = this.authServiceUrl + "/profile-pic"
        this.dataUserUrl = this.authServiceUrl + "/data"
        this.subscriptionUrl = this.authServiceUrl + "/subscription"
        this.getLivenessUrl = this.authServiceUrl + "/status/live"
        this.getStatusUrl = this.authServiceUrl + "/status"
    }

    async updateProfilePic(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.profilePicUrl, obj)
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
            let resp = await this.genericRestServiceClient.post(this.subscriptionUrl, obj)
            logger.info("[setSubscription] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[setSubscription] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    

}