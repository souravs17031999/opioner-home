btns = document.querySelectorAll("button")

let timerId;

for(let btn of btns) {
    if(btn.classList.contains("login-btn")) {
        btn.addEventListener('click', handleOnLogin)
    } else if(btn.classList.contains("sign-up-btn")) {
        btn.addEventListener('click', showSignUpModal)
    }
}

document.querySelector(".fas").addEventListener('click', toggleShowPasswordOnLogin);
document.querySelector(".far").addEventListener('click', toggleShowPasswordOnSignup);

document.querySelectorAll(".home-nav-links a")[1].addEventListener('click', showSignUpModal);
document.querySelector(".cta-footer-sign-up").addEventListener('click', showSignUpModal);

function handleOnLogin(e) {

    e.preventDefault()
    
    username = document.querySelector(".username")
    password = document.querySelector(".password") 

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

    url = configTestEnv["authServiceHost"] + "/auth/login-user"
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

function showSignUpModal(e) {

    e.preventDefault()

    clearEmptyErrorValue();
    
    modal = document.getElementById("sign-up-modal")
    modal.style.display = "block"
    document.querySelector(".sign-up-close").addEventListener('click', closeSignUpModal)
    document.querySelector("#sign-up-user").addEventListener('click', handleVerifyOTP)
    document.querySelector("#verify-otp").addEventListener('click', handleGenerateOTP)

    setToState1()

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function closeSignUpModal() {
    document.getElementById("sign-up-modal").style.display = "none"
}

function handleGenerateOTP(e) {
    
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
            setTimeout(clearEmptyErrorValue, 1500 * errorLengthOfLists);
        }
        
        return;
    }
    document.querySelector(".modal-loader-signup").style.display = "block"
    document.querySelector(".api-error-section").style.display = "none"
    document.querySelector("#otp-by-email").style.display = "none"
    document.querySelector(".api-msg-section").style.display = "none"

    url = configTestEnv["authServiceHost"] + "/auth/generate/otp"
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
            handleOnSuccessOTP(data)
        } else {
            handleOnFailureOTP(data)
        }
    })
    .catch((error) => {
        console.log(error)
        document.querySelector(".modal-loader-signup").style.display = "none"
    })
    
}

function handleOnSuccessOTP(data) {
    document.querySelector(".modal-loader-signup").style.display = "none"
    document.querySelector("#otp-by-email").style.display = "flex"
    document.querySelector("#verify-otp-btn").style.display = "none"
    document.querySelector("#submit-reg-form").style.display = "flex"
    setToState2()
    document.querySelector(".api-msg-section").style.display = "flex"
    document.querySelector("#api-msg-sign-up").innerHTML = data["message"]
    showOTPTimer(60);
}

function handleOnFailureOTP(data) {
    document.querySelector(".modal-loader-signup").style.display = "none"
    document.querySelector(".api-error-section").style.display = "flex"
    document.querySelector("#api-error-msg-sign-up").innerHTML = data["message"]
}

function handleVerifyOTP(e) {

    e.preventDefault()
    document.querySelector(".modal-loader-signup").style.display = "block"
    document.querySelector(".api-error-section").style.display = "none"
    document.querySelector(".api-msg-section").style.display = "none"
    
    let userEmailInput = document.querySelector(".user-contact-email")
    let otpEnteredByUser = "";
    document.querySelectorAll(".otp-box").forEach((item) => {
            otpEnteredByUser += item.value
    })
    url = configTestEnv["authServiceHost"] + "/auth/verify/otp"
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
            window.location.href = "home.html"
        } else {
            handleOnFailureSignUp(data)
        }
    })
    .catch((error) => {
        console.log(error)
        document.querySelector(".modal-loader-signup").style.display = "none"
    })

}

function handleOnFailureSignUp(data) {
    document.querySelector(".modal-loader-signup").style.display = "none"
    document.querySelector(".api-error-section").style.display = "flex"
    document.querySelector("#api-error-msg-sign-up").innerHTML = data["message"]
    document.querySelector(".api-msg-section").style.display = "none"
}

function setToState1() {
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
    clearInterval(timerId); 
    document.getElementById("otp-counter").innerHTML = ""
    document.getElementById("verify-otp").disabled = false
    document.getElementById("verify-otp").style.cursor = "pointer"
}

function setToState2() {
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

function setToState3() {
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

function showOTPTimer(timer) {
    document.querySelector("#otp-timer-section").style.display = "flex"
    document.getElementById("otp-counter").style.display = "flex";
    document.getElementById("otp-counter").innerHTML = ""
    document.getElementById("verify-otp").disabled = true
    document.getElementById("verify-otp").style.cursor = "not-allowed"
    let timerVal = timer
    timerId = setInterval(function() {
        document.getElementById("otp-counter").innerHTML = timerVal
        timerVal -= 1    
        // If the count down is over
        if (timerVal < 0) {
            clearInterval(timerId);
            document.getElementById("otp-counter").style.display = "none";
            document.getElementById("verify-otp").disabled = false
            document.getElementById("verify-otp").style.cursor = "pointer"
        }
      }, 1000);
}

function showErrorOnSignup() {
    
    let errorParent = document.createElement("ul")
    errorParent.setAttribute("id", "signup-error-section-items")
    let mainErrorDiv = document.querySelector(".signup-error-section")
    mainErrorDiv.style.display = "block"
    mainErrorDiv.appendChild(errorParent)

    let errorItem = document.createElement("li")
    errorItem.innerHTML = "Username has been already taken, try again with different username !"
    errorParent.appendChild(errorItem)

    setTimeout(clearEmptyErrorValue, 2000);

    document.querySelector(".modal-loader-signup").style.display = "none"

}

function clearEmptyErrorValue() {

    let errorItemsDiv = document.querySelectorAll("#signup-error-section-items")
    errorItemsDiv.forEach((item) => {
        item.remove()
    })
}

function handleOnChangeInput(e) {
    
    if(e.currentTarget.classList.contains("new-username")) {
        validateUsernameForSignup(e)
    } else if(e.currentTarget.classList.contains("new-password")){
        validatePasswordForSignup(e)
    } else if(e.currentTarget.classList.contains("username")) {
        validateUsernameForLogin(e)
    } else if(e.currentTarget.classList.contains("password")) {
        validatePasswordForLogin(e)
    } else if(e.currentTarget.classList.contains("new-user-first-name") || e.currentTarget.classList.contains("new-user-last-name")) {
        validateName(e)
    } else if(e.currentTarget.classList.contains("user-contact-email")) {
        validateUserEmail(e)
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

function validateUserEmail(e) {
    
    userEmail = e.currentTarget.value 
    if(!emailValidator(userEmail)) {
        e.currentTarget.setAttribute("id", "error-value-signup")
    } else {
        e.currentTarget.removeAttribute("id")
    }

}

function emailValidator(userEmail) {
    const validator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return userEmail.match(validator);
    
}

function validateName(e) {
    
    nameValue = e.currentTarget.value 
    if(nameValue === "") {
        e.currentTarget.setAttribute("id", "error-value-signup")
    } else {
        e.currentTarget.removeAttribute("id")
    }

}

function validateUsernameForLogin(e) {

    let username = e.currentTarget.value 
    if(username === "") {
        e.currentTarget.setAttribute("id", "error-value-login")
    } else {
        e.currentTarget.removeAttribute("id")
    }
}

function validatePasswordForLogin(e) {

    let password = e.currentTarget.value 
    if(password === "") {
        e.currentTarget.setAttribute("id", "error-value-login")
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

function validatePasswordForSignup(e) {

    let password = e.currentTarget.value 
    const superPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if(password === "" || password.length < 8 || !password.match(superPassword)) {
        e.currentTarget.setAttribute("id", "error-value-signup")
    } else {
        e.currentTarget.removeAttribute("id")
    }
   
}

function toggleShowPasswordOnLogin(e) {
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

function toggleShowPasswordOnSignup(e) {
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

function onSignIn(googleUser) {

    let profile = googleUser.getBasicProfile();
    localStorage.setItem("is_google_signed", true)
    url = configTestEnv["authServiceHost"] + "/auth/verify/google/sign"
    let dataForAPI = {
        "username": profile.getEmail(),
        "firstname": profile.getName(),
        "email": profile.getEmail(),
        "google_profile_url": profile.getImageUrl(),
        "google_token_id": googleUser.getAuthResponse().id_token,
    }
    googleUser.disconnect()
    document.querySelector(".modal-loader").style.display = "block"

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI),
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            localStorage.setItem("user-id", data["user_data"]["user_id"])
            if(data["is_new_user"]) {
                localStorage.setItem("new-user", true)
            }
            document.querySelector(".modal-loader").style.display = "none"
            window.location.href = "home.html"
        } else {
            handleOnFailureSignUp(data)
        }
    })
    .catch((error) => {
        console.log(error)
        document.querySelector(".modal-loader").style.display = "none"
    })

  }

  FB.login(function(response) {
    console.log(response)
    if (response.status === 'connected') {
      console.log("Logged into your webpage and Facebook.")
    } else {
        console.log("The person is not logged into your webpage or we are unable to tell. ")
      // The person is not logged into your webpage or we are unable to tell. 
    }
  });