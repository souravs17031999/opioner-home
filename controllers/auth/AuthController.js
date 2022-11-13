let logger = require('../../helpers/Logger');
const authService = require('../../services/AuthService')

module.exports = class AuthController {

    constructor() {
        this.authService = new authService()
    }
    
    loginUser = async (req, res) => {
        try {
            const resp = await this.authService.handleLogin(req.body)
            res.status(200).send(resp)
        } catch (error) {
            logger.debug("loginController login error: ", error)
            res.status(500).send("Error in logging in user !")
        }
    }

}