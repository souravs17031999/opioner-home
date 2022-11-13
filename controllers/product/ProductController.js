let logger = require('../../helpers/Logger');
const productService = require('../../services/ProductService')

module.exports = class ProductController {

    constructor() {
        this.productService = new productService()
    }
    
    loadPublicFeeds = async (req, res) => {
        try {
            const resp = await this.productService.loadPublicFeeds(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("loadPublicFeeds error: ", error)
            res.status(500).send(error)
        }
    }

    insertPublicFeed = async (req, res) => {
        try {
            const resp = await this.productService.insertPublicFeed(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("insertPublicFeed error: ", error)
            res.status(500).send(error)
        }
    }

    handleLikeFeedBtn = async (req, res) => {
        try {
            const resp = await this.productService.handleLikeFeedBtn(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("handleLikeFeedBtn error: ", error)
            res.status(500).send(error)
        }
    }

    getAllComments = async (req, res) => {
        try {
            const resp = await this.productService.getAllComments(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getAllComments error: ", error)
            res.status(500).send(error)
        }
    }

    updateComments = async (req, res) => {
        try {
            const resp = await this.productService.updateComments(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("updateComments error: ", error)
            res.status(500).send(error)
        }
    }

    handleBlockFeed = async (req, res) => {
        try {
            const resp = await this.productService.handleBlockFeed(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("handleBlockFeed error: ", error)
            res.status(500).send(error)
        }
    }

    renderAllPublicFeeds = async (req, res) => {
        try {
            const resp = await this.productService.renderAllPublicFeeds(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("renderAllPublicFeeds error: ", error)
            res.status(500).send(error)
        }
    }

    deletePublicFeeds = async (req, res) => {
        try {
            const resp = await this.productService.deletePublicFeeds(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("deletePublicFeeds error: ", error)
            res.status(500).send(error)
        }
    }

    updateUserStatus = async (req, res) => {
        try {
            const resp = await this.productService.updateUserStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("updateUserStatus error: ", error)
            res.status(500).send(error)
        }
    }

    getLivenessStatus = async (req, res) => {
        try {
            const resp = await this.productService.getLivenessStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getLivenessStatus error: ", error)
            res.status(500).send(error)
        }
    }

    getHealthStatus = async (req, res) => {
        try {
            const resp = await this.productService.getHealthStatus(req)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("getHealthStatus error: ", error)
            res.status(500).send(error)
        }
    }

}