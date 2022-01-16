// fetch all the previously stored data as soon as page loads


window.onload = initialLoadForProfilePage

btns = document.querySelectorAll("button")

var loggedInUsername, loggedInUserEmailId;

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
        } else if(btn.classList.contains("dropdown-btn")) {
            btn.addEventListener('click', handlelogoutUserClick)
        } else if(btn.classList.contains("upload-btn")) {
            btn.addEventListener('click', handleUploadProfile)
        }
    }
}

// handle close btns for modal in one go
document.querySelectorAll("#close").forEach((item) => {
    if(item.classList.contains("close-sign-up-modal")) {
        item.addEventListener('click', closeSignUpModal)
    } else if(item.classList.contains("close-update-data-modal")) {
        item.addEventListener('click', closeUpdateDataModal)
    } else if(item.classList.contains("close-unsubscribe-notify-modal")) {
        item.addEventListener('click', closeUnsubscribeNotifyModal)
    } else if(item.classList.contains("close-edit-update-data-modal")) {
        item.addEventListener('click', closeEditUpdateBucketModal)
    }
})

var tagColorMap = {
    "Todo": "linear-gradient(to Right, #ff0000, #ffc3ab)",
    "Doing": "linear-gradient(to right, rgb(72 97 242), rgb(180, 191, 223))",
    "Done": "linear-gradient(to Right, #19f639, #c5ffc1)"
}

function initialLoadForProfilePage() {
    // load modal if signed up new user flow
    if(localStorage.getItem("new-user")) {

        setTimeout(showUploadProfileModal, 5000);
        localStorage.removeItem("new-user");
    }
    document.querySelectorAll(".menu-dropdown-container")[0].addEventListener('click', handleNotificationDropdownPanel)
    document.querySelectorAll(".menu-dropdown-container")[1].addEventListener('click', handleMenuDropdownPanel)
    // rendering menu panel dropdown
    document.querySelectorAll(".dropdown-btn-container")[0].addEventListener('click', handleMyProfileClickAction)
    document.querySelectorAll(".dropdown-btn-container")[1].addEventListener('click', handlelogoutUserClick)
    // document.querySelectorAll(".dropdown-btn-container")[2].addEventListener('click', handleShowNotifications)

    fetchUserData();
    fetchUserLists();
    fetchUnreadCountForNotifications(customPageName="Opioner | My profile");
}

let notificationDropdownRef = document.getElementsByClassName("dropdown-items-notification")[0];
let dropDownContentContainerNotification = document.getElementsByClassName("dropdown-content-container-notification")[0];

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

    buttonId = e.currentTarget.getAttribute("index")

    if(document.getElementsByClassName("empty-error-value").length > 0) {
        document.getElementsByClassName("empty-error-value")[0].remove()
    } 
    
    let dataForAPI = {"item": userInputValue, "user_id": localStorage.getItem("user-id")}
    dataForAPI["update_flag"] = 0
    
    insertUserLists(dataForAPI)

    document.querySelector(".user-added-input").value = ""

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

    deleteItem = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement

    let dataForAPI = {"user_id": localStorage.getItem("user-id"), "id": deleteItem.getAttribute("id"), "all_flag": 0}

    removeItemFromList(dataForAPI)
}

function clearEmptyErrorValue() {
    document.getElementsByClassName("empty-error-value")[0].remove()
}

function handlelogoutUserClick(e) {
    const user_id = localStorage.getItem("user-id")
    const is_google_signed = localStorage.getItem("is_google_signed")
    const is_facebook_verified = localStorage.getItem("is_facebook_signed")
    localStorage.clear()
    removeUserSessions(loggedInUsername, user_id, is_google_signed, is_facebook_verified);
}

function handleClearBtn() {

    let listIds = ""
    menuItems = document.querySelectorAll(".menu-item")
    console.log(menuItems)
    menuItems.forEach(function(item) {
        listIds += `${item.getAttribute("id")},`
        item.remove()
    })
    document.getElementsByClassName("clear-btn")[0].style.display = "none";
    let dataForAPI = {"user_id": localStorage.getItem("user-id"), "all_flag": 1, "list_ids": listIds}

    removeItemFromList(dataForAPI)
}

function insertDivMenuItem(item, initialLoadForProfilePage) {

    if(item.description != null && item.id != null) {
        taskInnerContainer = document.getElementById("task-container")
        divMenuItem = document.createElement("div")
        divMenuItem.classList.add("task-bucket")
        divMenuItem.setAttribute("id", `${item.id}`)
        divMenuItem.setAttribute("privacy_status", `${item.privacy_status}`)

        divMenuItem.innerHTML = `
                <div class="task-bucket-header">
                    <div class="task-item-options">
                        <svg width="24" height="24" viewBox="0 0 24 24" role="presentation" class="svg-task-item-popup">
                            <g fill="currentColor" fill-rule="evenodd">
                                <circle cx="5" cy="12" r="2"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                                <circle cx="19" cy="12" r="2"></circle>
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="task-bucket-sidenav" style="display:none;">
                    <div class="sidenav-outer-container">
                        <div class="sidenav-outer-shadow-box">
                            <div class="sidenav-inner-container">
                                <div class="sidenav-items-options">Edit</div>
                                <div class="sidenav-items-options">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="task-bucket-description">
                    <p>${item.description}</p>
                </div>
        `
        taskInnerContainer.appendChild(divMenuItem)

        divMenuItem.children[0].children[0].addEventListener('click', openPopupOptionsOnClick)

        divMenuItem.children[1].children[0].children[0].children[0].children[0].addEventListener('click', handleEditBucketDataModal)
        divMenuItem.children[1].children[0].children[0].children[0].children[1].addEventListener('click', handleOnClickRemoveBtn)

        if(!initialLoadForProfilePage) {
            let rect = document.getElementById(item.id).getBoundingClientRect();
            window.scrollTo({
                top: rect.top,
                left: rect.left,
                behavior: 'smooth'
            })
        }

    }
    
    insertEmptyPromptOnEmptyList();
}

function updateDivMenuItem(item) {
    let taskBucketContainer = document.getElementById(item.id)
    taskBucketContainer.children[2].children[0].innerText = item['item']
    taskBucketContainer.setAttribute("privacy_status", item['privacy_status'])

}

function deleteDivMenuItem(item) {

    deleteItem = document.getElementById(item.id)
    if(deleteItem != null) {
        deleteItem.remove()
    }

    insertEmptyPromptOnEmptyList();

}

function showUserLists(data) {


    data["task"].forEach(function(item){
        
        insertDivMenuItem(item, initialLoadForProfilePage=true)
        
    });

    document.querySelector("input").value = ""
    document.querySelector("input").focus()

    document.querySelector(".user-added-input").focus()

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
    // loader if updating flow 
    if(itemData["update_flag"]) {
        document.querySelectorAll(".modal-loader")[2].style.display = "flex";
    }
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(itemData),
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            if(itemData["update_flag"]) {
                document.querySelectorAll(".modal-loader")[2].style.display = "none";
                document.querySelectorAll(".success-lottie")[1].style.display = "flex"
                updateDivMenuItem(itemData)
                setTimeout(closeEditUpdateBucketModal, 2000);
                resetAllPopup();
            } else {
                insertDivMenuItem({"id": data["id"], "description": itemData["item"], "status": data["status_tag"], "privacy_status": "private", "is_reminder_set": false}, initialPageLoad=false)
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
    url += `user_id=${localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1}`
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


    firstname = userData["user_data"]["firstname"]
    loggedInUsername = userData["user_data"]["username"]
    loggedInUserEmailId = userData["user_data"]["email"]

    let userAvatarImage = document.querySelector(".profile-pic")

    userAvatarImage.src = userData["user_data"]["profile_picture_url"]
    userAvatarImage.onerror = function () {
        if(userData["user_data"]["is_google_verified"] && userData["user_data"]["google_profile_url"] != null) {
            userAvatarImage.src = userData["user_data"]["google_profile_url"]
        } else if(userData["user_data"]["is_facebook_verified"] && userData["user_data"]["facebook_profile_url"] != null) {
            userAvatarImage.src = userData["user_data"]["facebook_profile_url"]
        } else {
            userAvatarImage.src = getImagePath(firstname)
        }
    }
    userAvatarImage.addEventListener('click', showUploadProfileModal)

    if (document.querySelectorAll(".notify-email")[1] != undefined) {
        document.querySelectorAll(".notify-email")[1].value = userData["user_data"]["email"]
    }
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
        alert("NO FILE SELECTED, CANNOT PROCEED FOR UPLOADING !")
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
            handleInitiateNotification({"user_id": localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1,"event_type": userEventsTrackingData[0].ename, "event_description": userEventsTrackingData[0].etext})
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

function closeUpdateDataModal() {

    document.querySelector(".update-status-btn").removeAttribute("task-id")
    document.getElementById("update-data-modal").style.display = "none";
}

function resetNotifyPushOnUpdateStatus() {
    let task_id = document.querySelector(".update-status-btn").getAttribute("task-id")
    let selectedTaskItem = document.getElementById(task_id)
}

function closeUnsubscribeNotifyModal() {
    document.querySelector("#modal-loader").style.display = "none";
    document.querySelector(".unsubscribe-yes-btn").removeAttribute("task-id")
    document.getElementById("unsubscribe-notify-modal").style.display = "none";
}

function closeEditUpdateBucketModal() {
    document.querySelectorAll(".success-lottie")[1].style.display = "flex"
    document.getElementById("edit-task-bucket-data-modal").style.display = "none";
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
            handleInitiateNotification({"user_id": localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1,"event_type": userEventsTrackingData[2].ename, "event_description": userEventsTrackingData[2].etext})

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
    if(document.querySelector(".dropdown-items-outer-container-notification").classList.contains("show-panel")) {
        document.querySelector(".dropdown-items-outer-container-notification").classList.remove("show-panel")
        resetDropdownPanel();
    }
}

function handleNotificationDropdownPanel() {
    
    if(document.querySelector(".dropdown-items-outer-container-notification").classList.contains("show-panel")) {
        document.querySelector(".dropdown-items-outer-container-notification").classList.remove("show-panel")  

        resetDropdownPanel();

    } else {
        document.querySelector(".dropdown-items-outer-container-notification").classList.add("show-panel");
        if(document.querySelector(".dropdown-items-outer-container").classList.contains("show-panel")) {
            document.querySelector(".dropdown-items-outer-container").classList.remove("show-panel")
        }

        fetchUserNotifications(false);          
    }

}

function resetDropdownPanel() {

    notificationDropdownRef.innerHTML = ''
    document.getElementsByClassName("dropdown-panel-footer")[0].remove(); 
}

function fetchUserNotifications(allFlag) {
    
    let url = configTestEnv["notificationServiceHost"] + "/notification/fetch-notifications?"
    url += `user_id=${localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1}`
    url += `&all_flag=${allFlag}`
    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        return response.json()})
    .then(data => {
        if(data["status"] == "success") {
            renderAllNotifications(data);
        }
    })
    .catch((error) => {
        console.log(error)
    })

}

function renderAllNotifications(notificationData) {

    for(let item of notificationData.data) {

        let tempDropdownContainer = document.createElement("div");
        tempDropdownContainer.classList.add("dropdown-btn-outer-container");
        tempDropdownContainer.innerHTML = `
        <div class="dropdown-btn-container-notification">
            <div class="dropdown-btn-icon-container">
                <div class="dropdown-btn-icon">
                    ${eventTypeImageMap[item.event_type]}
                </div>
            </div>
            <div class="dropdown-text-container">
                <div class="dropdown-text-section">
                    ${item.event_description}
                </div>
            </div>
        </div>
        `

        if(!item.read_flag) {
            let notifyDiv = document.createElement("div")
            notifyDiv.classList.add("notify-alert-container")
            notifyDiv.innerHTML = 
            `
            <span class="alert-notify"></span>
            `
            tempDropdownContainer.children[0].appendChild(notifyDiv)
        }
        
        tempDropdownContainer.setAttribute("event-id", item.id);
        tempDropdownContainer.addEventListener('click', updateNotificationStatus);
        notificationDropdownRef.appendChild(tempDropdownContainer);

    }
    
    if(notificationData.see_all) {
        let seeMoreContainer = document.createElement("div");
        seeMoreContainer.classList.add("dropdown-panel-footer");

        seeMoreContainer.innerHTML = 
        `
        <p>See all</p>
        `
        dropDownContentContainerNotification.appendChild(seeMoreContainer);
        seeMoreContainer.addEventListener('click', showAllNotificationsForUser);
    }
    
}

function updateNotificationStatus(e) {

    // mark the notification as read by removing the blue dot alert / icon and toggle the class so that API call only goes when
    // not already read 
    if(e.currentTarget.children[0].children[2] != undefined) {
        e.currentTarget.children[0].children[2].style.display = "none";
    
        let dataForAPI = {"user_id": localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1, "event_id": e.currentTarget.getAttribute("event-id")}
        
        url = configTestEnv["notificationServiceHost"] + "/notification/update-status-notifications"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                fetchUnreadCountForNotifications(customPageName="Opioner | My profile");
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    }

}

function handleMyProfileClickAction(e) {
    window.location.href = "profile.html"
}

function handleShowProgress() {

    // Todo

}

function showAllNotificationsForUser(e) {
    
    resetDropdownPanel();
    fetchUserNotifications(true);
}

function fetchUnreadCountForNotifications(customPageName) {

    let url = configTestEnv["notificationServiceHost"] + "/notification/unread-count-notifications?"
    url += `user_id=${localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1}`
    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        return response.json()})
    .then(data => {
        if(data["status"] == "success") {
            updateNotificationsInContext(data["unread_count"], customPageName);
        }
    })
    .catch((error) => {
        console.log(error)
    })

}

function updateNotificationsInContext(unreadCount, customPageName) {
    if(unreadCount > 0) {
        document.title = `(${unreadCount}) ${customPageName == undefined ? "Opioner" : customPageName}`
        document.getElementsByClassName("notification-badge")[0].style.display = "block";
        document.getElementsByClassName("notification-badge")[0].innerText = unreadCount;
    } else if(unreadCount === 0) {
        document.title = `${customPageName == undefined ? "Opioner" : customPageName}`;
        document.getElementsByClassName("notification-badge")[0].style.display = "none";
        document.getElementsByClassName("notification-badge")[0].innerText = '';
    }
}

function handleInitiateNotification(dataForAPI) {

    url = configTestEnv["notificationServiceHost"] + "/notification/insert-notification"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            fetchUnreadCountForNotifications();
        } 
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })    

}

function openPopupOptionsOnClick(e) {
    let currentPopup = e.currentTarget.parentElement.parentElement.children[1]
    if (currentPopup.style.display === "none") {
        currentPopup.style.display = "block";
        closeOtherPopupOptionsMenus(e.currentTarget.parentElement.parentElement.getAttribute("id"));
    } else {
        currentPopup.style.display = "none";
    }
}

function closeOtherPopupOptionsMenus(selected_id) {
    document.querySelectorAll(".task-bucket").forEach((item) => {
        if(item.getAttribute("id") != selected_id) {
            item.children[1].style.display = 'none';
        }
    })
}

function handleEditBucketDataModal(e) {

    //close the last success lottie on load
    document.querySelectorAll(".success-lottie")[1].style.display = "none";

    let modal = document.getElementById("edit-task-bucket-data-modal")
    modal.style.display = "block";
    let taskBucketContainer = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    let taskDescription = taskBucketContainer.children[2].children[0].innerText
    let taskPrivacyStatus = taskBucketContainer.getAttribute("privacy_status")

    modal.children[0].children[1].children[1].value = taskDescription
    modal.children[0].children[3].children[0].value = taskPrivacyStatus
    modal.children[0].children[6].children[0].setAttribute('task-id', taskBucketContainer.getAttribute('id'))
    modal.children[0].children[6].children[0].addEventListener('click', handleUpdateTaskBucketDataBtn)

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            resetAllPopup();
        }
    }

}

function handleUpdateTaskBucketDataBtn(e) {

    let taskId = e.currentTarget.getAttribute("task-id");
    let modal = e.currentTarget.parentElement.parentElement.parentElement    

    let dataForAPI = {"id": taskId,"user_id": localStorage.getItem("user-id"), 
                    "item": modal.children[0].children[1].children[1].value, 
                    "privacy_status": modal.children[0].children[3].children[0].value, 
                    "update_flag": true}
    
    insertUserLists(dataForAPI)
}

function resetAllPopup() {
    document.querySelectorAll(".task-bucket").forEach((item) => {
            item.children[1].style.display = 'none';
    })
}

function onLoad() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
      googleSignOutByUser()
    });
}

function removeUserSessions(loggedInUsername, user_id, is_google_signed, is_facebook_verified) {

    let url = configTestEnv["authServiceHost"] + "/auth/logout-user"
    let dataForAPI = {"user_id": user_id, "username": loggedInUsername}
    document.querySelector(".modal-first-loader").style.display = 'flex';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => {
        if(response.status != 204) {
            return Error("ERROR: Logout failed !");
        }
        if(is_google_signed != null) {
            onLoad();
        } else if(is_facebook_verified != null) {
            signOutFacebook();
        }
        console.log("USER LOGGED OUT SUCCESSFULLY ! ALL YOUR SESSIONS AND COOKIES ARE CLEARED.")
        document.querySelector(".modal-first-loader").style.display = 'none';
        window.location.href = "index.html" 
    })
    .catch((error) => {
        alert(error)
    })
}

function googleSignOutByUser() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      auth2.disconnect();
    });
}