let logger = require('../../helpers/Logger');
const userService = require('../../services/UserService')

module.exports = class UserController {

    constructor() {
        this.userService = new userService()
    }

    checkUpsertUser = async (req, res) => {
        try {
            const resp = await this.userService.checkUpsertUser(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("checkUpsertUser error: ", error)
            res.status(500).send(error)
        }
    }

    setSubscription = async (req, res) => {
        try {
            const resp = await this.userService.setSubscription(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("setSubscription error: ", error)
            res.status(500).send(error)
        }
    }

    getUserStatus = async (req, res) => {
        try {
            const resp = await this.userService.getUserStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getUserStatus error: ", error)
            res.status(500).send(error)
        }
    }

    getLivenessStatus = async (req, res) => {
        try {
            const resp = await this.userService.getLivenessStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getLivenessStatus error: ", error)
            res.status(500).send(error)
        }
    }

    getHealthStatus = async (req, res) => {
        try {
            const resp = await this.userService.getHealthStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getHealthStatus error: ", error)
            res.status(500).send(error)
        }
    }

}