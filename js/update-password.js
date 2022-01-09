btns = document.querySelectorAll("button")

for(let btn of btns) {
    if(btn.classList.contains("search-account-btn")) {
        btn.addEventListener('click', handleSearchAccountBtn)
    } else if(btn.classList.contains("cancel-btn")) {
        btn.addEventListener('click', handleCancelPasswordUpdateBtn)
    } else if(btn.classList.contains("update-password-account-btn")) {
        btn.addEventListener('click', handleSubmitPasswordChange)
    } else if(btn.classList.contains("send-otp-btn")) {
        btn.addEventListener('click', handleSendOTPV2)
    }
}

document.querySelectorAll(".home-nav-links a")[0].href = "/opioner-home/login.html";
document.querySelectorAll(".home-nav-links a")[1].href = "/opioner-home/login.html";

let username, userEmail, firstname;
document.querySelector(".fa-eye").addEventListener('click', toggleShowPassword)

function maskCharacter(str, mask, n = 1) {

    return ('' + str).slice(0, -n)
        .replace(/./g, mask)
        + ('' + str).slice(-n);
}

function handleSearchAccountBtn(e) {

    e.preventDefault()

    username = document.querySelector(".username").value 
    if(username === "") {
        return;
    }

    document.querySelector(".error-value-section").style.display = "none";

    document.querySelector(".modal-loader").style.display = "block"
    let dataForAPI = {"username": username}
    
    url = configTestEnv["userServiceHost"] + "/user/fetch/user-status"
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
            masked_email = maskCharacter(data["user_data"]["email"], '*', 15)
            userEmail = data["user_data"]["email"]
            firstname = data["user_data"]["firstname"]
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

function handleSendOTPV2(e) {

    e.preventDefault()
    document.querySelector(".modal-loader-otp").style.display = "block"
    
    let dataForAPI = {"email": userEmail, "secret_token": "SECRET_TOKEN", "firstname": firstname}
    
    url = configTestEnv["authServiceHost"] + "/auth/v2/generate/otp"
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

function handleCancelPasswordUpdateBtn(e) {

    e.preventDefault()
    window.location.href = "index.html"
}

function handleSubmitPasswordChange(e) {

    e.preventDefault()
    
    errorFlag = false 
    errorParent = document.createElement("ul")
    errorParent.setAttribute("id", "update-password-error-section-items")
    mainErrorDiv = document.querySelector(".update-password-error-section")
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
        setTimeout(clearEmptyErrorValue, 1500 * errorLengthOfLists);
        return;
    }

    document.querySelector(".update-password-error-section").style.display = "none";

    let otpEnteredByUser = "";
    document.querySelectorAll(".otp-box").forEach((item) => {
            otpEnteredByUser += item.value
    })
    document.querySelector(".modal-loader-password").style.display = "block"
    let password = document.querySelectorAll(".password")[0].value
    let dataForAPI = {"password": password, "username": username, "email": userEmail, "secret_token": "SECRET_TOKEN", "otp": otpEnteredByUser}
    url = configTestEnv["authServiceHost"] + "/auth/update-password-user"
    fetch(url, {
        method: 'POST',
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

function clearEmptyErrorValue() {
    let errorItemsDiv = document.querySelector("#update-password-error-section-items")
    errorItemsDiv.remove()
}

function handleOnChangeInput(e) {
    
    if(e.currentTarget.classList.contains("username")) {
        validateUsernameForSignup(e)
    } else if(e.currentTarget.classList.contains("password")) {
        validatePasswordForSignup(e)
    } else if(e.currentTarget.classList.contains("otp-box")) {
        validateOTPandMovetoNext(e)
    }
    
}

function validateOTPandMovetoNext(e) {

    const otp = e.currentTarget.value
    if(!OTPValidator(otp)) {
        e.currentTarget.setAttribute("id", "error-value-signup")
    } else {
        e.currentTarget.removeAttribute("id")
        if(e.currentTarget.nextElementSibling != null) {
            e.currentTarget.nextElementSibling.focus()
        }
    }
}

function OTPValidator(value) {
    const validator = /[0-9a-zA-Z]{1}/
    return value.match(validator);
}

function validatePasswordForSignup(e) {

    let password = e.currentTarget.value 
    const superPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if(password === "" || password.length < 8 || !password.match(superPassword)) {
        e.currentTarget.setAttribute("id", "error-value-signup")
    } else {
        e.currentTarget.removeAttribute("id")
    }
   
}

function validateUsernameForSignup(e) {

    let username = e.currentTarget.value 
    if(username === "" || username.length < 8) {
        e.currentTarget.setAttribute("id", "error-value-signup")
    } else {
        e.currentTarget.removeAttribute("id")
    }

}

function toggleShowPassword(e) {
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