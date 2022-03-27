class UpdatePasswordController {

    constructor() {

        this.username = "" 
        this.userEmail = "" 
        this.firstname = ""

        if(window.location.href.indexOf("password-change") > 0) {

            this.btns = document.querySelectorAll("button")

            for(let btn of this.btns) {
                if(btn.classList.contains("search-account-btn")) {
                    btn.addEventListener('click', this.handleSearchAccountBtn.bind(this))
                } else if(btn.classList.contains("cancel-btn")) {
                    btn.addEventListener('click', this.handleCancelPasswordUpdateBtn.bind(this))
                } else if(btn.classList.contains("update-password-account-btn")) {
                    btn.addEventListener('click', this.handleSubmitPasswordChange.bind(this))
                } else if(btn.classList.contains("send-otp-btn")) {
                    btn.addEventListener('click', this.handleSendOTPV2.bind(this))
                }
            }

            document.querySelectorAll(".home-nav-links a")[0].href = "/opioner-home/login.html";
            document.querySelectorAll(".home-nav-links a")[1].href = "/opioner-home/login.html";

            document.querySelector(".fa-eye").addEventListener('click', this.toggleShowPassword.bind(this))
        }

    }

    maskCharacter(str, mask, n = 1) {

        return ('' + str).slice(0, -n)
            .replace(/./g, mask)
            + ('' + str).slice(-n);
    }
    
    handleSearchAccountBtn(e) {
    
        e.preventDefault()
    
        this.username = document.querySelector(".username").value 
        if(this.username === "") {
            return;
        }
    
        document.querySelector(".error-value-section").style.display = "none";
    
        document.querySelector(".modal-loader").style.display = "block"
        let dataForAPI = {"username": this.username}
        
        let url = configTestEnv["userServiceHost"] + "/user/status"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                document.querySelector("#show-first-auth-container").style.display = "none";
                document.querySelector("#show-second-auth-container").style.display = "block";
                document.querySelector(".modal-loader").style.display = "none"
                const masked_email = this.maskCharacter(data["user_data"]["email"], '*', 15)
                this.userEmail = data["user_data"]["email"]
                this.firstname = data["user_data"]["firstname"]
                document.querySelector(".user-email").value = masked_email
            } else {
                document.querySelector(".modal-loader").style.display = "none"
                document.querySelector(".error-value-section").style.display = "block";
            }
        })
        .catch((error) => {
            console.log(error)
            document.querySelector(".modal-loader").style.display = "none"
        })    
    }
    
    handleSendOTPV2(e) {
    
        e.preventDefault()
        document.querySelector(".modal-loader-otp").style.display = "block"
        
        let dataForAPI = {"email": this.userEmail, "secret_token": "SECRET_TOKEN", "firstname": this.firstname}
        
        let url = configTestEnv["authServiceHost"] + "/auth/v2/generate/otp"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                document.querySelector("#show-second-auth-container").style.display = "none";
                document.querySelector("#validated-user-container").style.display = "block";
                document.querySelector(".modal-loader-otp").style.display = "none"
            } else {
                document.querySelector(".modal-loader-otp").style.display = "none"
                document.querySelector(".error-otp-section").style.display = "block";
            }
        })
        .catch((error) => {
            console.log(error)
            document.querySelector(".modal-loader-otp").style.display = "none"
        })    
    }
    
    handleCancelPasswordUpdateBtn(e) {
    
        e.preventDefault()
        window.location.href = "index.html"
    }
    
    handleSubmitPasswordChange(e) {
    
        e.preventDefault()
        
        const errorFlag = false 
        const errorParent = document.createElement("ul")
        errorParent.setAttribute("id", "update-password-error-section-items")
        const mainErrorDiv = document.querySelector(".update-password-error-section")
        mainErrorDiv.appendChild(errorParent)
    
        if(document.querySelectorAll(".password")[0].value != document.querySelectorAll(".password")[1].value) {
            errorFlag = true 
            document.querySelector(".update-password-error-section").style.display = "block"
            let errorItem = document.createElement("li")
            errorItem.innerHTML = "Your passwords do not match !, Click on the eye button to check and try again!"
            errorParent.appendChild(errorItem)
        }
        if(document.querySelectorAll(".password")[0].getAttribute("id") === "error-value-signup" || document.querySelectorAll(".password")[1].getAttribute("id") === "error-value-signup") {
            errorFlag = true
            document.querySelector(".update-password-error-section").style.display = "block"
            let errorItem = document.createElement("li")
            errorItem.innerHTML = "Your password doesn't meet our policy requirements, please hover over the box to check the requirements."
            errorParent.appendChild(errorItem)
        }
    
        if(errorFlag) {
            let errorLengthOfLists = errorParent.children.length
            setTimeout(this.clearEmptyErrorValue, 1500 * errorLengthOfLists);
            return;
        }
    
        document.querySelector(".update-password-error-section").style.display = "none";
    
        let otpEnteredByUser = "";
        document.querySelectorAll(".otp-box").forEach((item) => {
                otpEnteredByUser += item.value
        })
        document.querySelector(".modal-loader-password").style.display = "block"
        let password = document.querySelectorAll(".password")[0].value
        let dataForAPI = {"password": password, "username": this.username, "email": this.userEmail, "secret_token": "SECRET_TOKEN", "otp": otpEnteredByUser}
        let url = configTestEnv["authServiceHost"] + "/auth/password/user"
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(dataForAPI), 
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                document.querySelector(".update-password-error-section").style.display = "block";
                document.querySelector(".update-password-error-section").style.color = "green";
                document.querySelector(".update-password-error-section").innerHTML = "Password Updated successfully ! Redirecting to login page ...."
                document.querySelector(".modal-loader-password").style.display = "none"
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 2000);
            } else {
                document.querySelector(".modal-loader-password").style.display = "none"
                console.log("PASSWORD WAS NOT CHANGED, ERROR: ", data["message"]);
                document.querySelector(".update-password-error-section").style.display = "block";
                document.querySelector(".update-password-error-section").innerHTML = data["message"]
            }
        })
        .catch((error) => {
            console.log(error)
            document.querySelector(".modal-loader-password").style.display = "none"
            alert("PASSWORD WAS NOT CHANGED, ERROR: ", data["message"]);
        })    
    
    }
    
    clearEmptyErrorValue() {
        let errorItemsDiv = document.querySelector("#update-password-error-section-items")
        errorItemsDiv.remove()
    }
    
    handleOnChangeInput(e) {
        
        if(e.currentTarget.classList.contains("username")) {
            this.validateUsernameForSignup(e)
        } else if(e.currentTarget.classList.contains("password")) {
            this.validatePasswordForSignup(e)
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
    
    validatePasswordForSignup(e) {
    
        let password = e.currentTarget.value 
        const superPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(password === "" || password.length < 8 || !password.match(superPassword)) {
            e.currentTarget.setAttribute("id", "error-value-signup")
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
    
    toggleShowPassword(e) {
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

}

window.onload = initialLoadForPasswordPage

var updatePasswordController = new UpdatePasswordController()

function initialLoadForPasswordPage() {

}