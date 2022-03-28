class AppController extends AuthController {
    
    constructor() {
        super();
        this.timerId = "";

        if(window.location.href.indexOf("index") > 0) {
            this.btns = document.querySelectorAll("button")
            for(let btn of this.btns) {
                if(btn.classList.contains("login-btn")) {
                    btn.addEventListener('click', this.handleOnLogin.bind(this))
                } else if(btn.classList.contains("sign-up-btn")) {
                    btn.addEventListener('click', this.showSignUpModal.bind(this))
                }
            }

            document.querySelector(".fas").addEventListener('click', this.toggleShowPasswordOnLogin.bind(this));
            document.querySelector(".far").addEventListener('click', this.toggleShowPasswordOnSignup.bind(this));

            document.querySelectorAll(".home-nav-links a")[1].addEventListener('click', this.showSignUpModal.bind(this));
            document.querySelector(".cta-footer-sign-up").addEventListener('click', this.showSignUpModal.bind(this));
        }
    }

    handleOnLogin(e) {

        e.preventDefault()
        
        const username = document.querySelector(".username")
        const password = document.querySelector(".password") 
    
        let errorFlag = false
    
        if(username.value === "") {
            username.setAttribute("id", "error-value-login")
            errorFlag = true
        }
    
        if(password.value === "") {
            password.setAttribute("id", "error-value-login")
            errorFlag = true
        }
    
        if(username.getAttribute("id") === "error-value-login" || password.getAttribute("id") === "error-value-login") {
            errorFlag = true
        }
    
        if(errorFlag) {
            return;
        }
        document.querySelector(".failure-lottie").style.display = "none";
        document.querySelector(".modal-loader").style.display = "block"
    
        let url = configTestEnv["authServiceHost"] + "/auth/login/user"
        const credentials = {username: username.value, password: password.value}
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                document.querySelector(".modal-loader").style.display = "none"
                window.location.href = "home.html"
                localStorage.setItem("user-id", data["user_data"]["user_id"])
                localStorage.setItem("signed-in", true)
                this.setAuthTokenInContext(data["user_data"]["token"])
            } else {
                document.querySelector(".modal-loader").style.display = "none"
                document.querySelector(".failure-lottie").style.display = "flex";
            }
        })
        .catch((error) => {
            console.log(error)
            document.querySelector(".modal-loader").style.display = "none"
            alert(error)
        })
    
    }
    
    showSignUpModal(e) {
    
        e.preventDefault()
    
        this.clearEmptyErrorValue();
        
        const modal = document.getElementById("sign-up-modal")
        modal.style.display = "block"
        document.querySelector(".sign-up-close").addEventListener('click', this.closeSignUpModal.bind(this))
        document.querySelector("#sign-up-user").addEventListener('click', this.handleVerifyOTP.bind(this))
        document.querySelector("#verify-otp").addEventListener('click', this.handleGenerateOTP.bind(this))
    
        this.setToState1()
    
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    
    }
    
    closeSignUpModal() {
        document.getElementById("sign-up-modal").style.display = "none"
    }
    
    handleGenerateOTP(e) {
        
        e.preventDefault()
        let firstname = document.querySelector(".new-user-first-name")
        let lastname = document.querySelector(".new-user-last-name") 
        let username = document.querySelector(".new-username") 
        let password = document.querySelector(".new-password") 
        let userEmailInput = document.querySelector(".user-contact-email")
    
        let errorFlag = false
        let errorArr = []
    
        if(firstname.value === "") {
            firstname.setAttribute("id", "error-value-signup")
            errorFlag = true 
            errorArr.push("Firstname can't be empty !")
        }
    
        if(lastname.value === "") {
            lastname.setAttribute("id", "error-value-signup")
            errorFlag = true
            errorArr.push("Lastname can't be empty !")
        }
        
        if(username.value === "") {
            username.setAttribute("id", "error-value-signup")
            errorFlag = true
            errorArr.push("Username can't be empty !")
        }
            
        if(password.value === "") {
            password.setAttribute("id", "error-value-signup")
            errorFlag = true
            errorArr.push("Password can't be empty !")
        }
    
        if(userEmailInput.value === "") {
            userEmailInput.setAttribute("id", "error-value-signup")
            errorFlag = true
            errorArr.push("Email can't be empty !")
        }
    
        // document.querySelectorAll(".otp-box").forEach((item) => {
        //     if(item.value === "") {
        //         item.setAttribute("id", "error-value-signup")
        //         errorFlag = true
        //     }
        // })
        
        if(firstname.getAttribute("id") === "error-value-signup" || lastname.getAttribute("id") === "error-value-signup" || username.getAttribute("id") === "error-value-signup" || password.getAttribute("id") === "error-value-signup" || userEmailInput.getAttribute("id") === "error-value-signup") {
            errorFlag = true
            errorArr.push("Your input is not valid, hover over the boxes to check the policies !")
        }
        
        if(errorFlag) {
            
            if(document.querySelectorAll("#signup-error-section-items").length === 0) {
                let mainErrorDiv = document.querySelector(".signup-error-section")
                mainErrorDiv.style.display = "block"
                let errorParent = document.createElement("ul")
                errorParent.setAttribute("id", "signup-error-section-items")
                mainErrorDiv.appendChild(errorParent)
    
                for(let error of errorArr) {
                    let errorItem = document.createElement("li")
                    errorItem.innerHTML = error
                    errorParent.appendChild(errorItem)
                }
                let errorLengthOfLists = errorParent.children.length
                setTimeout(this.clearEmptyErrorValue, 1500 * errorLengthOfLists);
            }
            
            return;
        }
        document.querySelector(".modal-loader-signup").style.display = "block"
        document.querySelector(".api-error-section").style.display = "none"
        document.querySelector("#otp-by-email").style.display = "none"
        document.querySelector(".api-msg-section").style.display = "none"
    
        let url = configTestEnv["authServiceHost"] + "/auth/generate/otp"
        let dataForAPI = {"email": userEmailInput.value, 
                        "firstname": firstname.value, 
                        "lastname": lastname.value,
                        "username": username.value, 
                        "password": password.value, 
                        "secret_token": "SECRET_TOKEN"}
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI),
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                this.handleOnSuccessOTP(data)
            } else {
                this.handleOnFailureOTP(data)
            }
        })
        .catch((error) => {
            console.log(error)
            document.querySelector(".modal-loader-signup").style.display = "none"
        })
        
    }
    
    handleOnSuccessOTP(data) {
        document.querySelector(".modal-loader-signup").style.display = "none"
        document.querySelector("#otp-by-email").style.display = "flex"
        document.querySelector("#verify-otp-btn").style.display = "none"
        document.querySelector("#submit-reg-form").style.display = "flex"
        this.setToState2()
        document.querySelector(".api-msg-section").style.display = "flex"
        document.querySelector("#api-msg-sign-up").innerHTML = data["message"]
        this.showOTPTimer(60);
    }
    
    handleOnFailureOTP(data) {
        document.querySelector(".modal-loader-signup").style.display = "none"
        document.querySelector(".api-error-section").style.display = "flex"
        document.querySelector("#api-error-msg-sign-up").innerHTML = data["message"]
    }
    
    handleVerifyOTP(e) {
    
        e.preventDefault()
        document.querySelector(".modal-loader-signup").style.display = "block"
        document.querySelector(".api-error-section").style.display = "none"
        document.querySelector(".api-msg-section").style.display = "none"
        
        let userEmailInput = document.querySelector(".user-contact-email")
        let otpEnteredByUser = "";
        document.querySelectorAll(".otp-box").forEach((item) => {
                otpEnteredByUser += item.value
        })
        let url = configTestEnv["authServiceHost"] + "/auth/verify/otp"
        let dataForAPI = {"email": userEmailInput.value,  
                        "secret_token": "SECRET_TOKEN", 
                        "otp": otpEnteredByUser}
    
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI),
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                localStorage.setItem("user-id", data["user_data"]["user_id"])
                localStorage.setItem("new-user", true)
                localStorage.setItem("signed-in", true)
                window.location.href = "home.html"
            } else {
                this.handleOnFailureSignUp(data)
            }
        })
        .catch((error) => {
            console.log(error)
            document.querySelector(".modal-loader-signup").style.display = "none"
        })
    
    }
    
    handleOnFailureSignUp(data, is_signup=true) {
        if(is_signup) {
            document.querySelector(".modal-loader-signup").style.display = "none"
            document.querySelector(".api-error-section").style.display = "flex"
            document.querySelector("#api-error-msg-sign-up").innerHTML = data["message"]
            document.querySelector(".api-msg-section").style.display = "none" 
        } else {
            document.querySelector(".modal-loader").style.display = "none"
            document.querySelector(".failure-lottie").style.display = flex;
            document.querySelector(".failure-lottie").innerHTML = data["message"]
        }
    }
    
    setToState1() {
        // generate OTP state (initial state)
        document.querySelector(".new-username").value = ""
        document.querySelector(".new-username").removeAttribute("id")
        document.querySelector(".new-password").value = ""
        document.querySelector(".new-password").removeAttribute("id")
        document.querySelector(".new-user-first-name").value = ""
        document.querySelector(".new-user-first-name").removeAttribute("id")
        document.querySelector(".new-user-last-name").value = ""
        document.querySelector(".new-user-last-name").removeAttribute("id")
        document.querySelector(".user-contact-email").value = ""
        document.querySelector(".user-contact-email").removeAttribute("id")
    
        document.querySelector(".new-user-first-name").disabled = false
        document.querySelector(".new-user-first-name").style.cursor = "text"
        document.querySelector(".new-user-last-name").disabled = false
        document.querySelector(".new-user-last-name").style.cursor = "text"
        document.querySelector(".new-username").disabled = false
        document.querySelector(".new-username").style.cursor = "text"
        document.querySelector(".new-password").disabled = false
        document.querySelector(".new-password").style.cursor = "text"
        document.querySelector(".user-contact-email").disabled = false
        document.querySelector(".user-contact-email").style.cursor = "text"
    
        document.querySelectorAll(".otp-box").forEach((item) => {
            item.value = ""
            item.removeAttribute("id")
        })
        document.querySelector(".api-error-section").style.display = "none"
        document.querySelector("#otp-by-email").style.display = "none"
        document.querySelector("#verify-otp-btn").style.display = "flex"
        document.querySelector("#submit-reg-form").style.display = "none"
        document.querySelector(".api-msg-section").style.display = "none"
        clearInterval(this.timerId); 
        document.getElementById("otp-counter").innerHTML = ""
        document.getElementById("verify-otp").disabled = false
        document.getElementById("verify-otp").style.cursor = "pointer"
    }
    
    setToState2() {
        // verify OTP state
        document.querySelector(".new-user-first-name").disabled = true
        document.querySelector(".new-user-first-name").style.cursor = "not-allowed"
        document.querySelector(".new-user-last-name").disabled = true
        document.querySelector(".new-user-last-name").style.cursor = "not-allowed"
        document.querySelector(".new-username").disabled = true
        document.querySelector(".new-username").style.cursor = "not-allowed"
        document.querySelector(".new-password").disabled = true
        document.querySelector(".new-password").style.cursor = "not-allowed"
        document.querySelector(".user-contact-email").disabled = true
        document.querySelector(".user-contact-email").style.cursor = "not-allowed"
    }
    
    setToState3() {
        // generate OTP state (intermediate state on OTP failure)
    
        document.querySelector(".new-user-first-name").disabled = false
        document.querySelector(".new-user-first-name").style.cursor = "text"
        document.querySelector(".new-user-last-name").disabled = false
        document.querySelector(".new-user-last-name").style.cursor = "text"
        document.querySelector(".new-username").disabled = false
        document.querySelector(".new-username").style.cursor = "text"
        document.querySelector(".new-password").disabled = false
        document.querySelector(".new-password").style.cursor = "text"
        document.querySelector(".user-contact-email").disabled = false
        document.querySelector(".user-contact-email").style.cursor = "text"
    }
    
    showOTPTimer(timer) {
        document.querySelector("#otp-timer-section").style.display = "flex"
        document.getElementById("otp-counter").style.display = "flex";
        document.getElementById("otp-counter").innerHTML = ""
        document.getElementById("verify-otp").disabled = true
        document.getElementById("verify-otp").style.cursor = "not-allowed"
        let timerVal = timer
        this.timerId = setInterval(function() {
            document.getElementById("otp-counter").innerHTML = timerVal
            timerVal -= 1    
            // If the count down is over
            if (timerVal < 0) {
                clearInterval(this.timerId);
                document.getElementById("otp-counter").style.display = "none";
                document.getElementById("verify-otp").disabled = false
                document.getElementById("verify-otp").style.cursor = "pointer"
            }
          }, 1000);
    }
    
    showErrorOnSignup() {
        
        let errorParent = document.createElement("ul")
        errorParent.setAttribute("id", "signup-error-section-items")
        let mainErrorDiv = document.querySelector(".signup-error-section")
        mainErrorDiv.style.display = "block"
        mainErrorDiv.appendChild(errorParent)
    
        let errorItem = document.createElement("li")
        errorItem.innerHTML = "Username has been already taken, try again with different username !"
        errorParent.appendChild(errorItem)
    
        setTimeout(this.clearEmptyErrorValue, 2000);
    
        document.querySelector(".modal-loader-signup").style.display = "none"
    
    }
    
    clearEmptyErrorValue() {
    
        let errorItemsDiv = document.querySelectorAll("#signup-error-section-items")
        errorItemsDiv.forEach((item) => {
            item.remove()
        })
    }
    
    handleOnChangeInput(e) {
        
        if(e.currentTarget.classList.contains("new-username")) {
            this.validateUsernameForSignup(e)
        } else if(e.currentTarget.classList.contains("new-password")){
            this.validatePasswordForSignup(e)
        } else if(e.currentTarget.classList.contains("username")) {
            this.validateUsernameForLogin(e)
        } else if(e.currentTarget.classList.contains("password")) {
            this.validatePasswordForLogin(e)
        } else if(e.currentTarget.classList.contains("new-user-first-name") || e.currentTarget.classList.contains("new-user-last-name")) {
            this.validateName(e)
        } else if(e.currentTarget.classList.contains("user-contact-email")) {
            this.validateUserEmail(e)
        } else if(e.currentTarget.classList.contains("otp-box")) {
            this.validateOTPandMovetoNext(e)
        }
        
    }
    
    validateOTPandMovetoNext(e) {
    
        const otp = e.currentTarget.value
        if(!this.OTPValidator(otp)) {
            e.currentTarget.setAttribute("id", "error-value-signup")
        } else {
            e.currentTarget.removeAttribute("id")
            if(e.currentTarget.nextElementSibling != null) {
                e.currentTarget.nextElementSibling.focus()
            }
        }
    }
    
    OTPValidator(value) {
        const validator = /[0-9a-zA-Z]{1}/
        return value.match(validator);
    }
    
    validateUserEmail(e) {
        
        const userEmail = e.currentTarget.value 
        if(!this.emailValidator(userEmail)) {
            e.currentTarget.setAttribute("id", "error-value-signup")
        } else {
            e.currentTarget.removeAttribute("id")
        }
    
    }
    
    emailValidator(userEmail) {
        const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return userEmail.match(validator);
        
    }
    
    validateName(e) {
        
        const nameValue = e.currentTarget.value 
        if(nameValue === "") {
            e.currentTarget.setAttribute("id", "error-value-signup")
        } else {
            e.currentTarget.removeAttribute("id")
        }
    
    }
    
    validateUsernameForLogin(e) {
    
        let username = e.currentTarget.value 
        if(username === "") {
            e.currentTarget.setAttribute("id", "error-value-login")
        } else {
            e.currentTarget.removeAttribute("id")
        }
    }
    
    validatePasswordForLogin(e) {
    
        let password = e.currentTarget.value 
        if(password === "") {
            e.currentTarget.setAttribute("id", "error-value-login")
        } else {
            e.currentTarget.removeAttribute("id")
        }
    }
    
    validateUsernameForSignup(e) {
    
        let username = e.currentTarget.value 
        if(username === "" || username.length < 8) {
            e.currentTarget.setAttribute("id", "error-value-signup")
        } else {
            e.currentTarget.removeAttribute("id")
        }
    
    }
    
    validatePasswordForSignup(e) {
    
        let password = e.currentTarget.value 
        const superPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(password === "" || password.length < 8 || !password.match(superPassword)) {
            e.currentTarget.setAttribute("id", "error-value-signup")
        } else {
            e.currentTarget.removeAttribute("id")
        }
       
    }
    
    toggleShowPasswordOnLogin(e) {
        if(document.querySelector(".password").type === "text") {
            document.querySelector(".password").type = "password"
            e.currentTarget.classList.remove("fa-eye-slash")
            e.currentTarget.classList.add("fa-eye")
        } else {
            document.querySelector(".password").type = "text"
            e.currentTarget.classList.remove("fa-eye")
            e.currentTarget.classList.add("fa-eye-slash")
        }
    }
    
    toggleShowPasswordOnSignup(e) {
        if(document.querySelector(".new-password").type === "text") {
            document.querySelector(".new-password").type = "password"
            e.currentTarget.classList.remove("fa-eye-slash")
            e.currentTarget.classList.add("fa-eye")
        } else {
            document.querySelector(".new-password").type = "text"
            e.currentTarget.classList.remove("fa-eye")
            e.currentTarget.classList.add("fa-eye-slash")
        }
    }

}

window.onload = initialLoadForIndexPage

var appController = new AppController()

function initialLoadForIndexPage() {

}

function onSignIn(googleUser) {
    
    let profile = googleUser.getBasicProfile();
    localStorage.setItem("is_google_signed", true)
    let url = configTestEnv["authServiceHost"] + "/auth/verify/social/sign"
    let firstName = ""
    let lastName = ""
    if (profile.getName().split(" ").length > 1) {
        firstName = profile.getName().split(" ")[0]
        lastName = profile.getName().split(" ")[1]
    } else {
        firstName = profile.getName()
    }
    
    let dataForAPI = {
        "action_event_source": "google",
        "username": profile.getEmail(),
        "firstname": firstName,
        "lastname": lastName,
        "email": profile.getEmail(),
        "google_profile_url": profile.getImageUrl(),
        "google_token_id": googleUser.getAuthResponse().id_token,
    }
    googleUser.disconnect()
    document.querySelector(".failure-lottie").style.display = "none";
    document.querySelector(".modal-loader").style.display = "block"

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI),
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            localStorage.setItem("user-id", data["user_data"]["user_id"])
            localStorage.setItem("signed-in", true)
            if(data["is_new_user"]) {
                localStorage.setItem("new-user", true)
            }
            document.querySelector(".modal-loader").style.display = "none"
            window.location.href = "home.html"
        } else {
            if(data["is_new_user"]) {
                appController.handleOnFailureSignUp(data)
            } else {
                appController.handleOnFailureSignUp(data, false)
            }
        }
    })
    .catch((error) => {
        console.log(error)
        appController.handleOnFailureSignUp({"message": error})
    })

  }

function  signInViaFacebookAPI(response) { 
    
    document.querySelector(".failure-lottie").style.display = "none";
    const authResponse = response.authResponse
    const fbUserId = authResponse["userID"]
    
    FB.api(`${fbUserId}?fields=id,name,email,picture,gender,first_name`,function(response) {

        let lastName = ""
        if (response.name.split(" ").length > 1) {
            lastName = response.name.split(" ")[1]
        }

        let dataForAPI = {
            "action_event_source": "facebook",
            "name": response.name,
            "email": response.email,
            "facebook_profile_url": response.picture.data.url,
            "facebook_token_id": authResponse["accessToken"],
            "facebook_user_id": fbUserId,
            "gender": response.gender,
            "firstname": response.first_name,
            "lastname": lastName,
            "username": response.email,
        }
        localStorage.setItem("is_facebook_signed", true)
        url = configTestEnv["authServiceHost"] + "/auth/verify/social/sign"

        FB.api(`/${fbUserId}/permissions`, 'DELETE', function(response) {
            console.log('revoke response' + response);
        });
        document.querySelector(".modal-loader").style.display = "block"

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI),
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                localStorage.setItem("user-id", data["user_data"]["user_id"])
                localStorage.setItem("signed-in", true)
                if(data["is_new_user"]) {
                    localStorage.setItem("new-user", true)
                }
                document.querySelector(".modal-loader").style.display = "none"
                window.location.href = "home.html"
            } else {
                if(data["is_new_user"]) {
                    appController.handleOnFailureSignUp(data)
                } else {
                    appController.handleOnFailureSignUp(data, false)
                }
                
            }
        })
        .catch((error) => {
            console.log(error)
            appController.handleOnFailureSignUp({"message": error})
        })

    });

    
  }