let logger = require('../helpers/Logger');

module.exports = class HealthService {

    constructor() {
        logger.info("[init] Register HealthService")
    }

    async getHealthStatus(obj) {
        try {
            const healthResponse = {
                "app": {
                    "status": "App is functional",
                    "timestamp": new Date().toISOString()
                }
            }
            logger.info("[getHealthStatus] resp: ", healthResponse)
            return healthResponse
        } catch (error) {
            logger.error(`[getHealthStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

}