let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class AuthService {

    constructor() {
        this.authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost"
        this.genericRestServiceClient = new genericRestService()
        this.loginUserUrl = this.authServiceUrl + "/auth/login/user"
        this.logoutUserUrl = this.authServiceUrl + "/auth/logout/user"
        this.generateOTPUrl = this.authServiceUrl + "/auth/generate/otp"
        this.generateOTPV2Url = this.authServiceUrl + "/auth/v2/generate/otp"
        this.verifyOTPUrl = this.authServiceUrl + "/auth/verify/otp"
        this.verifyOTPSocialLoginUrl = this.authServiceUrl + "/auth/verify/social/sign"
        this.updatePasswordUrl = this.authServiceUrl + "/auth/password/user"
        this.authOIDCTokenUrl = this.authServiceUrl + "/auth/open-id/connect/token"
        this.getLivenessStateUrl = this.authServiceUrl + "/auth/status/live"
    }

    async handleLogin(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.loginUserUrl, obj)
            logger.info("[handleLogin] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[handleLogin] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async handleLogout(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.logoutUserUrl, obj)
            logger.info("[handleLogin] resp: ", resp)
            return resp
        } catch (error) {
            logger.error(`[handleLogin] ERROR: ${error}`)
            throw new Error(error)
        }
    }
}