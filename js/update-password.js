btns = document.querySelectorAll("button")

for(let btn of btns) {
    if(btn.classList.contains("search-account-btn")) {
        btn.addEventListener('click', handleSearchAccountBtn)
    } else if(btn.classList.contains("cancel-btn")) {
        btn.addEventListener('click', handleCancelPasswordUpdateBtn)
    } else if(btn.classList.contains("update-password-account-btn")) {
        btn.addEventListener('click', handleSubmitPasswordChange)
    }
}

var username;
document.querySelector(".fa-eye").addEventListener('click', toggleShowPassword)

function handleSearchAccountBtn(e) {

    e.preventDefault()

    username = document.querySelector(".username").value 
    if(username === "") {
        return;
    }

    document.querySelector(".error-value-section").style.display = "none";

    document.querySelector(".modal-loader").style.display = "block"
    let dataForAPI = {"username": username}
    
    url = configTestEnv["userServiceHost"] + "/user/fetch-user-status"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            document.querySelector("#show-first-auth-container").style.display = "none";
            document.querySelector("#validated-user-container").style.display = "block";
            document.querySelector(".modal-loader").style.display = "none"
        } else {
            document.querySelector(".modal-loader").style.display = "none"
            document.querySelector(".error-value-section").style.display = "block";
        }
    })
    .catch((error) => {
        console.log(error)
        document.querySelector(".modal-loader").style.display = "none"
        alert(error)
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
    let password = document.querySelectorAll(".password")[0].value
    let dataForAPI = {"password": password, "username": username}
    console.log(dataForAPI)
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
            window.location.href = "index.html"
        } else {
            alert("PASSWORD WAS NOT CHANGED, ERROR: ", data["message"]);
        }
    })
    .catch((error) => {
        console.log(error)
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