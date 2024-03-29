let logger = require('../helpers/Logger');
let genericRestService = require('./GenericRestService')

module.exports = class NotificationService {

    constructor() {
        this.notificationServiceUrl = (process.env.NOTIFICATION_SERVICE_URL || "http://localhost") + "/notification"
        this.genericRestServiceClient = new genericRestService()
        this.handleInitiateNotifyUrl = this.notificationServiceUrl + "/me"
        this.fetchAllUserNotificationsUrl = this.notificationServiceUrl + "/all"
        this.updateNotificationStatusUrl = this.notificationServiceUrl + "/status"
        this.fetchUnreadNotificationsUrl = this.notificationServiceUrl + "/unread-count"
        this.unsubscribeNotificationsUrl = this.notificationServiceUrl + "/unsubscribe-notification"
        this.getLivenessUrl = this.notificationServiceUrl + "/status/live"
        this.getStatusUrl = this.notificationServiceUrl + "/status/health"
        logger.info(`[init] Register NotificationService at ${this.notificationServiceUrl}`)
    }

    async handleInitiateNotify(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.handleInitiateNotifyUrl, obj.body, obj.headers.authorization)
            logger.info(`[handleInitiateNotify] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[handleInitiateNotify] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async fetchAllUserNotifications(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.fetchAllUserNotificationsUrl + `?user_id=${obj.query.user_id}&all_flag=${obj.query.all_flag}`, obj.headers.authorization)
            logger.info(`[fetchAllUserNotifications] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[fetchAllUserNotifications] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async updateNotificationStatus(obj) {
        try {
            let resp = await this.genericRestServiceClient.put(this.updateNotificationStatusUrl, obj.body, obj.headers.authorization)
            logger.info(`[updateNotificationStatus] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[updateNotificationStatus] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async fetchUnreadNotifications(obj) {
        try {
            let resp = await this.genericRestServiceClient.get(this.fetchUnreadNotificationsUrl, obj.headers.authorization)
            logger.info(`[fetchAllUserNotifications] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[fetchAllUserNotifications] ERROR: ${error}`)
            throw new Error(error)
        }
    }

    async unsubscribeNotifications(obj) {
        try {
            let resp = await this.genericRestServiceClient.post(this.unsubscribeNotificationsUrl, obj.body, obj.headers.authorization)
            logger.info(`[unsubscribeNotifications] resp: ${resp}`)
            return resp
        } catch (error) {
            logger.error(`[unsubscribeNotifications] ERROR: ${error}`)
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