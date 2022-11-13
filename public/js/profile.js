class ProfileController extends BaseController {

    constructor() {
       
        super();

        if(window.location.href.indexOf("profile") > 0) {
            // assign all the event handlers to each btn available
            const btns = document.querySelectorAll("button")

            if(btns.length > 0) {
                for(let btn of btns) {
                    if(btn.classList.contains("add-item-btn")) {
                        btn.addEventListener('click', this.handleOnClickSubmitBtn.bind(this))
                    } else if(btn.classList.contains("edit-item-btn")) {
                        btn.addEventListener('click', this.handleOnClickEditBtn.bind(this))
                    } else if(btn.classList.contains("remove-item-btn")) {
                        btn.addEventListener('click', this.handleOnClickRemoveBtn.bind(this))
                    } else if(btn.classList.contains("clear-btn")) {
                        btn.addEventListener('click', this.handleClearBtn.bind(this))
                    } else if(btn.classList.contains("dropdown-btn")) {
                        btn.addEventListener('click', handleOnLogout)
                    }
                }
            }

            // handle close btns for modal in one go
            document.querySelectorAll("#close").forEach((item) => {
                if(item.classList.contains("close-sign-up-modal")) {
                    item.addEventListener('click', this.closeSignUpModal.bind(this))
                } else if(item.classList.contains("close-update-data-modal")) {
                    item.addEventListener('click', this.closeUpdateDataModal.bind(this))
                } else if(item.classList.contains("close-unsubscribe-notify-modal")) {
                    item.addEventListener('click', this.closeUnsubscribeNotifyModal.bind(this))
                } else if(item.classList.contains("close-edit-update-data-modal")) {
                    item.addEventListener('click', this.closeEditUpdateBucketModal.bind(this))
                }
            })
        }

        this.authenticateUser();

    }

    authenticateUser() {
        this.retryWithDelay(this.isAuthenticated)
        .then(response => JSON.parse(response))
        .then(profileData => {
            this.setAuthTokenInContext()
            this.setUserDataInContext(profileData)
            this.checkAndUpsertUserData(profileData)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    handleOnClickSubmitBtn(e) {

        const userInputValue = document.querySelector(".user-added-input").value
        if(userInputValue.length == 0) {
    
            if (document.getElementsByClassName("empty-error-value").length == 0) {
                const formInnerContainer = document.getElementById("form-inner-container")
                const divErrorItem = document.createElement("p")
                divErrorItem.classList.add("empty-error-value")
                const paragraphMenuItemValue = document.createTextNode("Empty item found, please enter something")
                divErrorItem.appendChild(paragraphMenuItemValue)
                formInnerContainer.appendChild(divErrorItem)
                setTimeout(this.clearEmptyErrorValue, 1000);
            }
            return;
        }
    
        let buttonId = e.currentTarget.getAttribute("index")
    
        if(document.getElementsByClassName("empty-error-value").length > 0) {
            document.getElementsByClassName("empty-error-value")[0].remove()
        } 
        
        let dataForAPI = {"item": userInputValue, "user_id": localStorage.getItem("user-id")}
        dataForAPI["update_flag"] = 0
        
        this.insertUserLists(dataForAPI)
    
        document.querySelector(".user-added-input").value = ""
    
    }

    handleOnClickEditBtn(e) {
        const currentText = e.currentTarget.parentElement.parentElement.children[1].innerText
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

    fetchUserLists() {
        
        document.getElementsByClassName("modal-first-loader")[0].style.display="flex"
        
        let url = configTestEnv["productServiceHost"] + "/product/my/feed"
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authToken}` 
            }
        })
        .then(response => {
            if(response.status === 401) {
                return;
            }
            return response.json()
        })
        .then(data => {
            if(data["status"] == "success") {
                document.getElementsByClassName("modal-first-loader")[0].style.display="none"
                this.showUserLists(data)
            } else {
                document.getElementsByClassName("modal-first-loader")[0].style.display="none"
                console.log(`No data found, ERROR: ", ${data["message"]}`)
                this.insertEmptyPromptOnEmptyList();
            }
        })
        .catch((error) => {
            document.getElementsByClassName("modal-first-loader")[0].style.display="none"
            console.log(error)
        })
    
    }

    handleOnClickRemoveBtn(e) {

        const deleteItem = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    
        let dataForAPI = {"id": deleteItem.getAttribute("id"), "all_flag": 0}
    
        this.removeItemFromList(dataForAPI)
    }
    
    handleClearBtn() {

        let listIds = ""
        menuItems = document.querySelectorAll(".menu-item")
        console.log(menuItems)
        menuItems.forEach(function(item) {
            listIds += `${item.getAttribute("id")},`
            item.remove()
        })
        document.getElementsByClassName("clear-btn")[0].style.display = "none";
        let dataForAPI = {"user_id": localStorage.getItem("user-id"), "all_flag": 1, "list_ids": listIds}
    
        this.removeItemFromList(dataForAPI)
    }
    
    insertDivMenuItem(item, initialLoadForProfilePage) {
    
        if(item.description != null && item.id != null) {
            const taskInnerContainer = document.getElementById("task-container")
            const divMenuItem = document.createElement("div")
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
    
            divMenuItem.children[0].children[0].addEventListener('click', this.openPopupOptionsOnClick.bind(this))
    
            divMenuItem.children[1].children[0].children[0].children[0].children[0].addEventListener('click', this.handleEditBucketDataModal.bind(this))
            divMenuItem.children[1].children[0].children[0].children[0].children[1].addEventListener('click', this.handleOnClickRemoveBtn.bind(this))
    
            if(!initialLoadForProfilePage) {
                let rect = document.getElementById(item.id).getBoundingClientRect();
                window.scrollTo({
                    top: rect.top,
                    left: rect.left,
                    behavior: 'smooth'
                })
            }
    
        }
        
        this.insertEmptyPromptOnEmptyList();
    }
    
    updateDivMenuItem(item) {
        let taskBucketContainer = document.getElementById(item.id)
        taskBucketContainer.children[2].children[0].innerText = item['item']
        taskBucketContainer.setAttribute("privacy_status", item['privacy_status'])
    
    }
    
    deleteDivMenuItem(item) {
    
        const deleteItem = document.getElementById(item.id)
        if(deleteItem != null) {
            deleteItem.remove()
        }
    
        this.insertEmptyPromptOnEmptyList();
    
    }
    
    showUserLists(data) {
    
    
        data["task"].forEach(function(item){
            
            this.insertDivMenuItem(item, initialLoadForProfilePage=true)
            
        }, this);
    
        document.querySelector("input").value = ""
        document.querySelector("input").focus()
    
        document.querySelector(".user-added-input").focus()
    
    }
    
    
    
    insertEmptyPromptOnEmptyList() {
    
        // show empty prompt note to user for making click on submit 
        if(document.getElementsByClassName("task-bucket").length === 0) {
            document.querySelector(".empty-list-prompt-section").classList.add("show-empty-prompt")
        } else {
            document.querySelector(".empty-list-prompt-section").classList.remove("show-empty-prompt")
        }  
    }
    
    insertUserLists(itemData) {
        const url = configTestEnv["productServiceHost"] + "/product/feed/upsert"
        // loader if updating flow 
        if(itemData["update_flag"]) {
            document.querySelectorAll(".modal-loader")[2].style.display = "flex";
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(itemData),
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                if(itemData["update_flag"]) {
                    document.querySelectorAll(".modal-loader")[2].style.display = "none";
                    document.querySelectorAll(".success-lottie")[1].style.display = "flex"
                    this.updateDivMenuItem(itemData)
                    setTimeout(this.closeEditUpdateBucketModal, 2000);
                    resetAllPopup();
                } else {
                    this.insertDivMenuItem({"id": data["id"], "description": itemData["item"], "status": data["status_tag"], "privacy_status": "private", "is_reminder_set": false}, false)
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
    
    removeEmptyTaskPromptList() {
        
        document.querySelector(".empty-list-prompt-section").classList.remove("show-empty-prompt")
    
    }
    
    removeItemFromList(itemData) {
    
        const url = configTestEnv["productServiceHost"] + "/product/my/feed"
        fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(itemData),
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                this.deleteDivMenuItem(itemData)
            } else {
                alert(`No data found, ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })
    
    }
    
    updateUserStatus(e) {
    
        let dataForAPI = {"user_id": localStorage.getItem("user-id")}
        let statusTag = document.getElementById("tags").value 
        dataForAPI["tag"] = statusTag
        dataForAPI["task_id"] = document.querySelector(".update-status-btn").getAttribute("task-id")
        const url = configTestEnv["productServiceHost"] + "/product/update-task-status"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                this.updateStatusInDiv(dataForAPI);
                if(dataForAPI["tag"] === "Done") {
                    this.resetNotifyPushOnUpdateStatus();
                }
                this.closeUpdateDataModal();
            } else {
                alert(`Updating of task status failed, ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    }
    
    updateStatusInDiv(item) {
    
        document.getElementById(item["task_id"]).children[0].children[1].innerText = item["tag"]
        document.getElementById(item["task_id"]).children[0].children[1].style.background = tagColorMap[item.tag]
    }
    
    closeUpdateDataModal() {
    
        document.querySelector(".update-status-btn").removeAttribute("task-id")
        document.getElementById("update-data-modal").style.display = "none";
    }
    
    resetNotifyPushOnUpdateStatus() {
        let task_id = document.querySelector(".update-status-btn").getAttribute("task-id")
        let selectedTaskItem = document.getElementById(task_id)
    }
    
    closeUnsubscribeNotifyModal() {
        document.querySelector("#modal-loader").style.display = "none";
        document.querySelector(".unsubscribe-yes-btn").removeAttribute("task-id")
        document.getElementById("unsubscribe-notify-modal").style.display = "none";
    }
    
    closeEditUpdateBucketModal() {
        document.querySelectorAll(".success-lottie")[1].style.display = "flex"
        document.getElementById("edit-task-bucket-data-modal").style.display = "none";
    }
    
    handleUnsubscribeNotifyModal(e) {
    
        let modal = document.getElementById("unsubscribe-notify-modal")
        modal.style.display = "block";
        document.querySelector("#close").addEventListener('click', this.closeUnsubscribeNotifyModal.bind(this))
    
        let taskId = e.currentTarget.parentElement.parentElement.getAttribute("id")
        document.querySelector(".unsubscribe-yes-btn").addEventListener('click', this.unsubscribeUserToNotification.bind(this))
        document.querySelector(".unsubscribe-yes-btn").setAttribute("task-id", taskId)
    
        document.querySelector(".unsubscribe-no-btn").addEventListener('click', this.closeUnsubscribeNotifyModal.bind(this))
    
        window.onclick = function(event) {
            if (event.target == modal) {
                document.querySelector(".unsubscribe-yes-btn").removeAttribute("task-id")
                modal.style.display = "none";
            }
        }
    }
    
    unsubscribeUserToNotification(e) {
        
        let task_id = e.currentTarget.getAttribute("task-id")
        document.querySelector("#modal-loader").style.display = "block";
        let dataForAPI = {"user_id": localStorage.getItem("user-id"), "task_id": task_id}
        
        const url = configTestEnv["notificationServiceHost"] + "/notification/unsubscribe-notification"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                this.resetPushNotifyForTask(false);
                this.closeUnsubscribeNotifyModal();
                this.handleInitiateNotification({"user_id": localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1,"event_type": userEventsTrackingData[2].ename, "event_description": userEventsTrackingData[2].etext})
    
            } else {
                alert(`STOP REMINDERS FAILED, ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    }
    
    resetPushNotifyForTask(isNotified) {
        
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
    
    handleShowProgress() {
    
        // Todo
    
    }
    
    openPopupOptionsOnClick(e) {
        let currentPopup = e.currentTarget.parentElement.parentElement.children[1]
        if (currentPopup.style.display === "none") {
            currentPopup.style.display = "block";
            this.closeOtherPopupOptionsMenus(e.currentTarget.parentElement.parentElement.getAttribute("id"));
        } else {
            currentPopup.style.display = "none";
        }
    }
    
    closeOtherPopupOptionsMenus(selected_id) {
        document.querySelectorAll(".task-bucket").forEach((item) => {
            if(item.getAttribute("id") != selected_id) {
                item.children[1].style.display = 'none';
            }
        })
    }
    
    handleEditBucketDataModal(e) {
    
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
        modal.children[0].children[6].children[0].addEventListener('click', this.handleUpdateTaskBucketDataBtn.bind(this))
    
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                resetAllPopup();
            }
        }
    
    }
    
    handleUpdateTaskBucketDataBtn(e) {
    
        let taskId = e.currentTarget.getAttribute("task-id");
        let modal = e.currentTarget.parentElement.parentElement.parentElement    
    
        let dataForAPI = {"id": taskId,"user_id": localStorage.getItem("user-id"), 
                        "item": modal.children[0].children[1].children[1].value, 
                        "privacy_status": modal.children[0].children[3].children[0].value, 
                        "update_flag": true}
        
        this.insertUserLists(dataForAPI)
    }

}

window.onload = initialLoadForProfilePage

var loggedInUsername, loggedInUserEmailId, firstname, lastname, profilePicUrl;


var tagColorMap = {
    "Todo": "linear-gradient(to Right, #ff0000, #ffc3ab)",
    "Doing": "linear-gradient(to right, rgb(72 97 242), rgb(180, 191, 223))",
    "Done": "linear-gradient(to Right, #19f639, #c5ffc1)"
}

function resetAllPopup() {
    document.querySelectorAll(".task-bucket").forEach((item) => {
            item.children[1].style.display = 'none';
    })
}

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

function initialLoadForProfilePage() {

    const profileController = new ProfileController();

    // load modal if signed up new user flow
    if(localStorage.getItem("new-user")) {
        setTimeout(profileController.showUploadProfileModal, 5000);
        localStorage.removeItem("new-user");
    }
    profileController.authenticateUser();
    sleep(1000).then(() => {
        profileController.fetchUserLists();
        profileController.fetchUnreadCountForNotifications(customPageName="Opioner | My profile");
    })
    
    
}