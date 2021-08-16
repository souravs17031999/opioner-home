// fetch all the previously stored data as soon as page loads


window.onload = initialPageLoad

btns = document.querySelectorAll("button")

// assign all the event handlers to each btn available
if(btns.length > 0) {
    for(let btn of btns) {
        if(btn.classList.contains("add-item-btn")) {
            btn.addEventListener('click', handleOnClickSubmitBtn)
        } else if(btn.classList.contains("edit-item-btn")) {
            btn.addEventListener('click', handleOnClickEditBtn)
        } else if(btn.classList.contains("remove-item-btn")) {
            btn.addEventListener('click', handleOnClickRemoveBtn)
        } else if(btn.classList.contains("clear-btn")) {
            btn.addEventListener('click', handleClearBtn)
        } else if(btn.classList.contains("logout-btn")) {
            btn.addEventListener('click', handleLogoutUserClick)
        } else if(btn.classList.contains("upload-btn")) {
            btn.addEventListener('click', handleUploadProfile)
        } else if(btn.classList.contains("notify-push-btn")) {
            btn.addEventListener('click', subscribeUserToNotification)
        }
    }
}

// handle close btns for modal in one go
document.querySelectorAll("#close").forEach((item) => {
    if(item.classList.contains("close-sign-up-modal")) {
        item.addEventListener('click', closeSignUpModal)
    } else if(item.classList.contains("close-notify-modal")) {
        item.addEventListener('click', closeNotifyModal)
    } else if(item.classList.contains("close-update-data-modal")) {
        item.addEventListener('click', closeUpdateDataModal)
    } else if(item.classList.contains("close-unsubscribe-notify-modal")) {
        item.addEventListener('click', closeUnsubscribeNotifyModal)
    }
})

var tagColorMap = {
    "Todo": "linear-gradient(to Right, #ff0000, #ffc3ab)",
    "Doing": "linear-gradient(to right, rgb(72 97 242), rgb(180, 191, 223))",
    "Done": "linear-gradient(to Right, #19f639, #c5ffc1)"
}

function initialPageLoad() {
    // load modal if signed up new user flow
    if(localStorage.getItem("new-user")) {
        modal = document.getElementById("sign-up-modal")
        modal.style.display = "block";
        localStorage.removeItem("new-user")
        document.querySelector(".close-sign-up-modal").addEventListener('click', closeSignUpModal)
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
    document.querySelector(".menu-dropdown-container").addEventListener('click', handleMenuDropdownPanel)
    document.querySelector(".logout-btn-container").addEventListener('click', handleLogoutUserClick)

    fetchUserData();
    fetchUserLists();
}

function handleOnClickSubmitBtn(e) {

    userInputValue = document.querySelector(".user-added-input").value
    if(userInputValue.length == 0) {

        if (document.getElementsByClassName("empty-error-value").length == 0) {
            formInnerContainer = document.getElementById("form-inner-container")
            divErrorItem = document.createElement("p")
            divErrorItem.classList.add("empty-error-value")
            paragraphMenuItemValue = document.createTextNode("Empty item found, please enter something")
            divErrorItem.appendChild(paragraphMenuItemValue)
            formInnerContainer.appendChild(divErrorItem)
            setTimeout(clearEmptyErrorValue, 1000);
        }
        return;
    }
    let shouldUpdate = false;

    buttonId = e.currentTarget.getAttribute("index")
    if(buttonId !== null && buttonId >= 0) {
        shouldUpdate = true;
        
    }

    if(document.getElementsByClassName("empty-error-value").length > 0) {
        document.getElementsByClassName("empty-error-value")[0].remove()
    } 
    
    let dataForAPI = {"item": userInputValue, "user_id": localStorage.getItem("user-id")}
    if(shouldUpdate) {
        dataForAPI["update_flag"] = 1
        dataForAPI["id"] = buttonId
    } else {
        dataForAPI["update_flag"] = 0
    }
    
    insertUserLists(dataForAPI)

    document.querySelector(".user-added-input").value = ""
    // document.querySelector(".user-added-input").focus()

}

function handleOnClickEditBtn(e) {
    currentText = e.currentTarget.parentElement.parentElement.children[1].innerText
    document.querySelector(".user-added-input").value = currentText
    document.querySelector(".user-added-input").focus()

    updateIndex = e.currentTarget.parentElement.parentElement.getAttribute("id")
    document.getElementsByClassName("add-item-btn")[0].setAttribute("index", updateIndex)
    let btns = document.getElementsByClassName("remove-item-btn")
    for(let btn of btns) {
        btn.disabled = true   
        btn.style.cursor = "not-allowed"
    }
    document.getElementsByClassName("add-item-btn")[0].children[0].classList.remove("fa-plus")
    document.getElementsByClassName("add-item-btn")[0].children[0].classList.add("fa-pen-square")

}

function handleOnClickRemoveBtn(e) {

    deleteItem = e.currentTarget.parentElement.parentElement

    // // localStorage.removeItem(deleteItem.getAttribute("id"))

    let dataForAPI = {"user_id": localStorage.getItem("user-id"), "id": deleteItem.getAttribute("id"), "all_flag": 0}

    removeItemFromList(dataForAPI)
}

function clearEmptyErrorValue() {
    document.getElementsByClassName("empty-error-value")[0].remove()
}

function handleLogoutUserClick(e) {
    localStorage.clear()
    window.location.href = "index.html"
}

function handleClearBtn() {

    let listIds = ""
    menuItems = document.querySelectorAll(".menu-item")
    console.log(menuItems)
    menuItems.forEach(function(item) {
        // localStorage.removeItem(item.getAttribute("id"))
        listIds += `${item.getAttribute("id")},`
        item.remove()
    })
    document.getElementsByClassName("clear-btn")[0].style.display = "none";
    let dataForAPI = {"user_id": localStorage.getItem("user-id"), "all_flag": 1, "list_ids": listIds}

    removeItemFromList(dataForAPI)
}

function insertDivMenuItem(item) {

    if(item.description != null && item.id != null) {
        taskInnerContainer = document.getElementById("task-container")
        divMenuItem = document.createElement("div")
        divMenuItem.classList.add("task-bucket")
        divMenuItem.setAttribute("id", `${item.id}`)

        divMenuItem.innerHTML = `
                <div class="task-bucket-header">
                    <i class="fas fa-calendar-check"></i>
                    <p class="status-tag">${item.status}</p>
                </div>
                <div class="task-bucket-description">
                    <p>${item.description}</p>
                </div>
                <div class="task-bucket-footer">
                    <button class="edit-item-btn"><i class="fas fa-edit"></i></button>
                    <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
                    <button class="push-notify-btn"><i class="far fa-bell"></i></button>
                    <button class="unsubscribe-notify-btn"><i class="far fa-bell-slash"></i></button>
                </div>
        `
        taskInnerContainer.appendChild(divMenuItem)
        // formInnerContainer.lastChild.setAttribute("id", item.id)
        divMenuItem.children[0].children[1].style.background = tagColorMap[item.status]
        if(item["is_reminder_set"]) {
            divMenuItem.children[0].children[0].style.display = "block"
            divMenuItem.children[0].children[1].style.left = "15px"
            document.getElementById(item.id).lastElementChild.children[3].style.display = "block"
            document.getElementById(item.id).lastElementChild.children[2].style.display = "none"
        } else {
            document.getElementById(item.id).lastElementChild.children[2].style.display = "block"
            document.getElementById(item.id).lastElementChild.children[3].style.display = "none"
        }
        divMenuItem.children[0].children[1].addEventListener('click', handleStatusTagChange)
        document.getElementById(item.id).lastElementChild.children[0].addEventListener('click', handleOnClickEditBtn)
        document.getElementById(item.id).lastElementChild.children[1].addEventListener('click', handleOnClickRemoveBtn)
        document.getElementById(item.id).lastElementChild.children[2].addEventListener('click', handlePushNotifyModal)
        document.getElementById(item.id).lastElementChild.children[3].addEventListener('click', handleUnsubscribeNotifyModal)

    }
    insertEmptyPromptOnEmptyList();
}

function updateDivMenuItem(item) {

    menuItem = document.getElementById(`${item.id}`)
    menuItem.children[1].children[0].innerText = item.item
    document.getElementsByClassName("add-item-btn")[0].setAttribute("index", "-1")

    let btns = document.getElementsByClassName("remove-item-btn")
    for(let btn of btns) {
        btn.disabled = false   
        btn.style.cursor = "pointer"
    }
    document.getElementsByClassName("add-item-btn")[0].children[0].classList.remove("fa-pen-square")
    document.getElementsByClassName("add-item-btn")[0].children[0].classList.add("fa-plus")

}

function deleteDivMenuItem(item) {

    deleteItem = document.getElementById(item.id)
    if(deleteItem != null) {
        deleteItem.remove()
    }
    if(document.getElementsByClassName("menu-item").length === 0) {
        document.getElementsByClassName("clear-btn")[0].style.display = "none";
    }
    insertEmptyPromptOnEmptyList();

}

function showUserLists(data) {


    data["task"].forEach(function(item){
        
        insertDivMenuItem(item)
        
    });

    document.querySelector("input").value = ""
    document.querySelector("input").focus()

    document.querySelector(".user-added-input").focus()

}

function handlePushNotifyModal(e) {

    let modal = document.getElementById("notify-push-modal")
    modal.style.display = "block";

    document.querySelector("#close").addEventListener('click', closeNotifyModal)
    let task_id = e.currentTarget.parentElement.parentElement.getAttribute("id")
    document.querySelector(".notify-push-btn").setAttribute("task-id", task_id) 
    document.querySelectorAll(".checkmark").forEach((item) => {
        item.addEventListener('click', handleCheckBox)
    })

    fetchUserData();

    window.onclick = function(event) {
        if (event.target == modal) {
            document.querySelector(".notify-push-btn").removeAttribute("task-id") 
            document.querySelector(".notify-email").style.borderColor = "#3c1bc0"
            document.querySelector(".notify-phone").style.borderColor = "#3c1bc0"
            modal.style.display = "none";
        }
    }
}

function handleStatusTagChange(e) {

    let modal = document.getElementById("update-data-modal")
    modal.style.display = "block";
    document.getElementById("tags").value = e.currentTarget.innerText

    let taskId = e.currentTarget.parentElement.parentElement.getAttribute("id")
    document.querySelector(".update-status-btn").addEventListener('click', updateUserStatus)
    document.querySelector(".update-status-btn").setAttribute("task-id", taskId)
    window.onclick = function(event) {
        if (event.target == modal) {
            document.querySelector(".update-status-btn").removeAttribute("task-id")
            modal.style.display = "none";
        }
    }
}

function fetchUserLists() {
    
    url = configTestEnv["productServiceHost"] + "/product/fetch-list?"
    url += `user_id=${localStorage.getItem("user-id")}`
    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        if(response.status === 401) {
            return;
        }
        return response.json()
    })
    .then(data => {
        if(data["status"] == "success") {
            showUserLists(data)
        } else {
            console.log(`No data found, ERROR: ", ${data["message"]}`)
            insertEmptyPromptOnEmptyList();
        }
    })
    .catch((error) => {
        console.log(error)
    })

}

function insertEmptyPromptOnEmptyList() {

    // show empty prompt note to user for making click on submit 
    if(document.getElementsByClassName("task-bucket").length === 0) {
        document.querySelector(".empty-list-prompt-section").classList.add("show-empty-prompt")
    } else {
        document.querySelector(".empty-list-prompt-section").classList.remove("show-empty-prompt")
    }  
}

function insertUserLists(itemData) {
    url = configTestEnv["productServiceHost"] + "/product/upsert-task"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(itemData),
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            if(itemData["update_flag"]) {
                updateDivMenuItem(itemData)
            } else {
                insertDivMenuItem({"id": data["id"], "description": itemData["item"], "status": data["status_tag"]})
            }
        } else {
            alert(`No data found, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })

}

function removeEmptyTaskPromptList() {
    
    document.querySelector(".empty-list-prompt-section").classList.remove("show-empty-prompt")

}

function removeItemFromList(itemData) {

    url = configTestEnv["productServiceHost"] + "/product/delete-task"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(itemData),
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            deleteDivMenuItem(itemData)
        } else {
            alert(`No data found, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })

}

function fetchUserData() {

    url = configTestEnv["userServiceHost"] + "/user/fetch-user-data?"
    url += `user_id=${localStorage.getItem("user-id")}`
    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        if(response.status === 401) {
            window.location.href = "index.html"
            return;
        }
        return response.json()})
    .then(data => {
        if(data["status"] == "success") {
            setUserDataInContext(data);
        } else {
            alert(`No data found, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
    })

}

function setUserDataInContext(userData) {

    document.querySelector(".welcome-header-name").innerHTML = `Welcome ${userData["user_data"]["firstname"]}`

    firstname = userData["user_data"]["firstname"]

    let userAvatarImage = document.querySelector(".profile-pic")

    userAvatarImage.src = userData["user_data"]["profile_picture_url"]
    userAvatarImage.onerror = function () {
        userAvatarImage.src = getImagePath(firstname)
    }
    userAvatarImage.addEventListener('click', showUploadProfileModal)

    document.querySelector(".notify-phone").value = userData["user_data"]["phone"]
    document.querySelector(".notify-email").value = userData["user_data"]["email"]
}

function updateUserStatus(e) {

    let dataForAPI = {"user_id": localStorage.getItem("user-id")}
    let statusTag = document.getElementById("tags").value 
    dataForAPI["tag"] = statusTag
    dataForAPI["task_id"] = document.querySelector(".update-status-btn").getAttribute("task-id")
    url = configTestEnv["productServiceHost"] + "/product/update-task-status"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            updateStatusInDiv(dataForAPI);
            if(dataForAPI["tag"] === "Done") {
                resetNotifyPushOnUpdateStatus();
            }
            closeUpdateDataModal();
        } else {
            alert(`Updating of task status failed, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })    
}

function updateStatusInDiv(item) {

    document.getElementById(item["task_id"]).children[0].children[1].innerText = item["tag"]
    document.getElementById(item["task_id"]).children[0].children[1].style.background = tagColorMap[item.tag]
}

function getImagePath(firstname) {

    return `images/${firstname[0].toUpperCase()}.png`

}

function handleUploadProfile(e) {

    e.preventDefault()
    file = document.querySelector(".upload-btn").files[0]
    if(file === undefined) {
        console.log("NO FILE SELECTED, CANNOT PROCEED FOR UPLOADING !")
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', localStorage.getItem("user-id"))
    
    document.querySelector(".loader").style.display = "block"

    url = configTestEnv["userServiceHost"] + "/user/update-profile-pic"
    fetch(url, {
        method: 'POST',
        body: formData, 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            clearProgressBar();
            setTimeout(closeSignUpModal, 3000);
            fetchUserData();
        } else {
            alert(`Uploading of profile failed, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
    })    
    
}

function clearProgressBar() {
    document.querySelector(".loader").style.display = "none"
    document.querySelector(".success-lottie").style.display = "flex"
}

function closeSignUpModal() {
    document.getElementById("sign-up-modal").style.display = "none";
}

function closeNotifyModal() {

    document.querySelector(".modal-loader").style.display = "none";
    document.getElementById("notify-push-modal").style.display = "none";
    document.querySelector(".notify-email").style.borderColor = "#3c1bc0"
    document.querySelector(".notify-phone").style.borderColor = "#3c1bc0"
}

function closeUpdateDataModal() {

    document.querySelector(".update-status-btn").removeAttribute("task-id")
    document.getElementById("update-data-modal").style.display = "none";
}

function resetNotifyPushOnUpdateStatus() {
    let task_id = document.querySelector(".update-status-btn").getAttribute("task-id")
    let selectedTaskItem = document.getElementById(task_id)
    selectedTaskItem.children[0].children[0].style.display = "none"
    selectedTaskItem.children[0].children[1].style.left = "250px"

    document.getElementById(task_id).lastElementChild.children[2].style.display = "block"
    document.getElementById(task_id).lastElementChild.children[3].style.display = "none"
}

function closeUnsubscribeNotifyModal() {
    document.querySelector("#modal-loader").style.display = "none";
    document.querySelector(".unsubscribe-yes-btn").removeAttribute("task-id")
    document.getElementById("unsubscribe-notify-modal").style.display = "none";
}

function showUploadProfileModal() {

    document.querySelector(".modal-header-image-upload").innerHTML = "wanna update your profile pic?"
    let modal = document.getElementById("sign-up-modal")
    modal.style.display = "block";
    document.querySelector("#close").addEventListener('click', closeSignUpModal)
    document.querySelector(".success-lottie").style.display = "none"
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function handleCheckBox(e) {

    let checkbox = e.currentTarget.parentElement.children[0].checked
    let checkboxValue = e.currentTarget.parentElement.children[0].value 

    if(!checkbox && checkboxValue === "phone") {
        document.querySelector(".notify-phone").style.display = "block"
    }
    if(!checkbox && checkboxValue === "email") {
        document.querySelector(".notify-email").style.display = "block"
    }
    if(checkbox && checkboxValue === "email") {
        document.querySelector(".notify-email").style.display = "none"
    }
    if(checkbox && checkboxValue === "phone") {
        document.querySelector(".notify-phone").style.display = "none"
    }
}

function subscribeUserToNotification(e) {

    let userPhone = document.querySelector(".notify-phone").value
    let userEmail = document.querySelector(".notify-email").value
    let task_id = e.currentTarget.getAttribute("task-id")

    let isEmailChecked = e.currentTarget.parentElement.parentElement.children[1].children[0].children[0].checked ? 1 : 0
    let isPhoneChecked = e.currentTarget.parentElement.parentElement.children[1].children[1].children[0].checked ? 1 : 0

    isValidationFailed = false 
    if(isEmailChecked && userEmail === "") {
        document.querySelector(".notify-email").style.borderColor = "red"
        isValidationFailed = true
    }

    if(isPhoneChecked && userPhone === "") {
        document.querySelector(".notify-phone").style.borderColor = "red"
        isValidationFailed = true
    }

    if(isValidationFailed) {
        return;
    }

    document.querySelector(".modal-loader").style.display = "block";
    let dataForAPI = {"user_id": localStorage.getItem("user-id"), "phone": userPhone, "email": userEmail, "task_id": task_id, "is_phone": isPhoneChecked, "is_email": isEmailChecked}

    url = configTestEnv["notificationServiceHost"] + "/notification/subscribe-notification"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            resetPushNotifyForTask(true);
            closeNotifyModal();
        } else {
            alert(`PUSH REMINDERS FAILED, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })    

}

function handleUnsubscribeNotifyModal(e) {

    let modal = document.getElementById("unsubscribe-notify-modal")
    modal.style.display = "block";
    document.querySelector("#close").addEventListener('click', closeUnsubscribeNotifyModal)

    let taskId = e.currentTarget.parentElement.parentElement.getAttribute("id")
    document.querySelector(".unsubscribe-yes-btn").addEventListener('click', unsubscribeUserToNotification)
    document.querySelector(".unsubscribe-yes-btn").setAttribute("task-id", taskId)

    document.querySelector(".unsubscribe-no-btn").addEventListener('click', closeUnsubscribeNotifyModal)

    window.onclick = function(event) {
        if (event.target == modal) {
            document.querySelector(".unsubscribe-yes-btn").removeAttribute("task-id")
            modal.style.display = "none";
        }
    }
}

function unsubscribeUserToNotification(e) {
    
    let task_id = e.currentTarget.getAttribute("task-id")
    document.querySelector("#modal-loader").style.display = "block";
    let dataForAPI = {"user_id": localStorage.getItem("user-id"), "task_id": task_id}
    
    url = configTestEnv["notificationServiceHost"] + "/notification/unsubscribe-notification"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            resetPushNotifyForTask(false);
            closeUnsubscribeNotifyModal();
        } else {
            alert(`STOP REMINDERS FAILED, ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })    
}

function resetPushNotifyForTask(isNotified) {
    
    if(isNotified) {
        let task_id = document.querySelector(".notify-push-btn").getAttribute("task-id")
        let selectedTaskItem = document.getElementById(task_id)
        selectedTaskItem.children[0].children[0].style.display = "block"
        selectedTaskItem.children[0].children[1].style.left = "15px"

        document.getElementById(task_id).lastElementChild.children[2].style.display = "none"
        document.getElementById(task_id).lastElementChild.children[3].style.display = "block"
    } else {
        let task_id = document.querySelector(".unsubscribe-yes-btn").getAttribute("task-id")
        let selectedTaskItem = document.getElementById(task_id)
        selectedTaskItem.children[0].children[0].style.display = "none"
        selectedTaskItem.children[0].children[1].style.left = "250px"

        document.getElementById(task_id).lastElementChild.children[2].style.display = "block"
        document.getElementById(task_id).lastElementChild.children[3].style.display = "none"
    }
}

function handleMenuDropdownPanel() {
    document.querySelector(".dropdown-items-outer-container").classList.toggle("show-panel")
}