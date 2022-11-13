class AuthController {
    constructor() {

        this.authToken = sessionStorage.getItem("access_token");
        this.loggedInUserEmailId = ""
        this.loggedInUsername = ""
    }

    setAuthTokenInContext(jwtToken) {
        this.authToken = jwtToken
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