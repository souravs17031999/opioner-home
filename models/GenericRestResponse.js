module.exports = class GenericRestResponse {

    constructor(statusCode, body) {
        this.statusCode = statusCode
        this.body = JSON.parse(body)
    }

    isSuccess() {
        return this.statusCode != undefined && this.statusCode >= 200 && this.statusCode < 300
    }
}