module.exports = class GenericRestResponse {

    constructor(statusCode, body) {
        this.statusCode = statusCode
        this.model = body.result
    }

    isSuccess() {
        return this.statusCode != undefined && this.statusCode >= 200 && this.statusCode < 300
    }
}