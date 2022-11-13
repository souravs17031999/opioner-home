let request = require('request');
let logger = require('../helpers/Logger')
let genericRestResponse = require('../models/GenericRestResponse')

module.exports = class GenericRestService {

    constructor() {
        logger.debug("[GenericRestService] constructor")
        this.headers = {'Content-Type': 'application/json'}
    }

    async get(url) {
        logger.debug(`[GenericRestService] GET ${url}`)
        return await this.OpiniorRestClientCall(request.get, url)
    }

    async post(url, body) {
        logger.debug(`[GenericRestService] POST ${url}`)
        return await this.OpiniorRestClientCall(request.post, url, body, this.headers)
    }

    async put(url, body) {
        logger.debug(`[GenericRestService] PUT ${url}`)
        return await this.OpiniorRestClientCall(request.put, url, body, this.headers)
    }

    async delete(url) {
        logger.debug(`[GenericRestService] DEL ${url}`)
        return await this.OpiniorRestClientCall(request.delete, url, token)
    }

    async OpiniorRestClientCall(method, url, body, headers) {
        let resp = await this.OpiniorRestWrapper(method, {
            url: url,
            body: JSON.stringify(body),
            headers: headers
        }).catch((error) => {
            logger.debug(`[GenericRestService] method ${method} throws an error: ${error}`)
        })
        if (resp.statusCode === 401) {
            logger.debug(`UnAuthorized request`)
        }
        logger.debug(`[GenericRestService] OpiniorRestAsync status: {}`, resp.statusCode)
        return resp
    }

    async OpiniorRestWrapper(method, req) {
        return new Promise(function(resolve, reject) {
            method(req, (err, resp, body) => {
                if (err) {
                    logger.debug(`[GenericRestService] OpiniorRestWrapper err ${err}`)
                    reject(err)
                } else {
                    logger.debug(`[GenericRestService] OpiniorRestWrapper status:${resp.statusCode}`)
                    resolve(new genericRestResponse(resp.statusCode, body))
                }
            })
        })
    }
    
}