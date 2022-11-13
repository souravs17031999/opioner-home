let request = require('request');
let logger = require('../helpers/Logger')
let genericRestResponse = require('../models/GenericRestResponse')

module.exports = class GenericRestService {

    constructor() {
        this.headers = {'Content-Type': 'application/json'}
    }

    async get(url, token) {
        logger.debug(`[GenericRestService] GET ${url}`)
        return await this.OpiniorRestClientCall(request.get, url, token)
    }

    async post(url, body, token) {
        logger.debug(`[GenericRestService] POST ${url}`)
        return await this.OpiniorRestClientCall(request.post, url, token, body, this.headers)
    }

    async put(url, body, token) {
        logger.debug(`[GenericRestService] PUT ${url}`)
        return await this.OpiniorRestClientCall(request.put, url, token, body, this.headers)
    }

    async delete(url, body, token) {
        logger.debug(`[GenericRestService] DEL ${url}`)
        return await this.OpiniorRestClientCall(request.delete, url, token, body, this.headers)
    }

    async OpiniorRestClientCall(method, url, token, body, headers) {
        let resp = await this.OpiniorRestWrapper(method, {
            url: url,
            body: JSON.stringify(body),
            auth: {
                bearer: token != undefined ? token.split(" ")[1] : ""
            },
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
                    resolve(JSON.parse(body))
                }
            })
        })
    }
    
}