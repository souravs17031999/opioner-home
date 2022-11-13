let logger = require('../../helpers/Logger');
const notificationService = require('../../services/NotificationService')

module.exports = class NotificationController {

    constructor() {
        this.notificationService = new notificationService()
    }
    
    handleInitiateNotify = async (req, res) => {
        try {
            const resp = await this.notificationService.handleInitiateNotify(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("handleInitiateNotify error: ", error)
            res.status(500).send(error)
        }
    }

    fetchAllUserNotifications = async (req, res) => {
        try {
            const resp = await this.notificationService.fetchAllUserNotifications(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("fetchAllUserNotifications error: ", error)
            res.status(500).send(error)
        }
    }

    updateNotificationStatus = async (req, res) => {
        try {
            const resp = await this.notificationService.updateNotificationStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("updateNotificationStatus error: ", error)
            res.status(500).send(error)
        }
    }

    fetchUnreadNotifications = async (req, res) => {
        try {
            const resp = await this.notificationService.fetchUnreadNotifications(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("fetchUnreadNotifications error: ", error)
            res.status(500).send(error)
        }
    }

    unsubscribeNotifications = async (req, res) => {
        try {
            const resp = await this.notificationService.unsubscribeNotifications(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("unsubscribeNotifications error: ", error)
            res.status(500).send(error)
        }
    }

    getLivenessStatus = async (req, res) => {
        try {
            const resp = await this.notificationService.getLivenessStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getLivenessStatus error: ", error)
            res.status(500).send(error)
        }
    }

    getHealthStatus = async (req, res) => {
        try {
            const resp = await this.notificationService.getHealthStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getHealthStatus error: ", error)
            res.status(500).send(error)
        }
    }

}