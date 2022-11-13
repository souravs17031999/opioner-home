let logger = require('../../helpers/Logger');
const healthService = require('../../services/HealthService')

module.exports = class HealthController {

    constructor() {
        this.healthService = new healthService()
    }
    
    getStatus = async (req, res) => {
        try {
            const resp = await this.healthService.getHealthStatus()
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getStatus health error: ", error)
            res.status(500).send("Error in getting health status")
        }
    }

}