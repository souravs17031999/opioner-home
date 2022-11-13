class AuthController {
    constructor() {

        this.authToken = "";
        this.loggedInUserEmailId = ""
        this.loggedInUsername = ""
    }

    setAuthTokenInContext() {
        this.authToken = sessionStorage.getItem("access_token")
    }

    getAuthTokenInContext(jwtToken) {
        return this.authToken
    }

    setUserNameInContext(username) {
        this.loggedInUsername = username
    }

    setUserEmailInContext(email) {
        this.loggedInUserEmailId = email
    }

}