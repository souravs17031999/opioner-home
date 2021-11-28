btns = document.querySelectorAll("button")

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
    document.querySelector("#sign-up-user").addEventListener('click', handleOnSignUp)

    document.querySelector(".new-username").value = ""
    document.querySelector(".new-password").value = ""
    document.querySelector(".new-user-first-name").value = ""
    document.querySelector(".new-user-last-name").value = ""

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function closeSignUpModal() {
    document.getElementById("sign-up-modal").style.display = "none"
}

function handleOnSignUp(e) {
    
    e.preventDefault()
    let firstname = document.querySelector(".new-user-first-name")
    let lastname = document.querySelector(".new-user-last-name") 
    let username = document.querySelector(".new-username") 
    let password = document.querySelector(".new-password") 

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
    
    if(firstname.getAttribute("id") === "error-value-signup" || lastname.getAttribute("id") === "error-value-signup" || username.getAttribute("id") === "error-value-signup" || password.getAttribute("id") === "error-value-signup") {
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

    url = configTestEnv["authServiceHost"] + "/auth/signup-user"
    const credentials = {username: username.value, password: password.value, firstname: firstname.value, lastname: lastname.value}
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            document.querySelector(".modal-loader-signup").style.display = "none"
            document.querySelector(".new-user-first-name").value = ""
            document.querySelector(".new-user-last-name").value = ""
            document.querySelector(".new-username").value = ""
            document.querySelector(".new-password").value = ""

            localStorage.setItem("user-id", data["user_data"]["user_id"])
            localStorage.setItem("new-user", true)
            window.location.href = "home.html"
        } else {
            document.querySelector(".modal-loader-signup").style.display = "none"
            alert(`Error creating New User, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        document.querySelector(".modal-loader-signup").style.display = "none"
        alert(error)
    })
    
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
    }
    
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
