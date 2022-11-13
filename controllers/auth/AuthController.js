let logger = require('../../helpers/Logger');
const authService = require('../../services/AuthService')

module.exports = class AuthController {

    constructor() {
        this.authService = new authService()
    }

    getLivenessStatus = async (req, res) => {
        try {
            const resp = await this.authService.getLivenessStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getLivenessStatus error: ", error)
            res.status(500).send(error)
        }
    }

    getHealthStatus = async (req, res) => {
        try {
            const resp = await this.authService.getHealthStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getHealthStatus error: ", error)
            res.status(500).send(error)
        }
    }

}