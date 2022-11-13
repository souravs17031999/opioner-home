class BaseController extends AuthController {

    constructor() {
        super();

        if(window.location.href.indexOf("home") > 0 || window.location.href.indexOf("profile") > 0) {

            
            handleOnLogin()

            document.querySelectorAll(".menu-dropdown-container")[0].addEventListener('click', this.handleNotificationDropdownPanel.bind(this))
            document.querySelectorAll(".menu-dropdown-container")[1].addEventListener('click', this.handleMenuDropdownPanel.bind(this))
            // rendering menu panel dropdown
            document.querySelectorAll(".dropdown-btn-container")[1].addEventListener('click', this.handleMyProfileClickAction.bind(this))
            document.querySelectorAll(".dropdown-btn-container")[2].addEventListener('click', handleOnLogout)

            this.notificationDropdownRef = document.getElementsByClassName("dropdown-items-notification")[0];
            this.dropDownContentContainerNotification = document.getElementsByClassName("dropdown-content-container-notification")[0];

            const btns = document.querySelectorAll("button")

            if(btns.length > 0) {
                for(let btn of btns) {
                    if(btn.classList.contains("upload-btn")) {
                        // btn.addEventListener('click', this.handleUploadProfile.bind(this))
                    }
                }
            }

            window.addEventListener('click', function(e){   
                if (!document.getElementsByClassName('menu-dropdown-container')[0].contains(e.target)) {
                    resetDropdownPanel()
                }
            }, this);
            
            window.addEventListener('click', function(e){   
                if (document.getElementsByClassName('menu-dropdown-container')[1].contains(e.target)) {
                    document.getElementsByClassName('dropdown-btn-outer-container')[0].style.display = "block"
                    document.getElementsByClassName('dropdown-btn-outer-container')[1].style.display = "block"
                    document.getElementsByClassName('dropdown-btn-outer-container')[2].style.display = "block"
                } else {
                    document.getElementsByClassName('dropdown-btn-outer-container')[0].style.display = "none"
                    document.getElementsByClassName('dropdown-btn-outer-container')[1].style.display = "none"
                    document.getElementsByClassName('dropdown-btn-outer-container')[2].style.display = "none"
                }
            });
        }
    }

    wait = ms => new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
      });

    retryWithDelay = async (
        fn, retries = 2, interval = 1000,
        finalErr = 'Retry failed'
      ) => {
        try {
          // try
          let profileData = await fn();
          return profileData
        } catch (err) {
          // if no retries left
          // throw error
          if (retries <= 0) {
            return Promise.reject(finalErr);
          }
          
          //delay the next call
          await this.wait(interval);
          
          //recursively call the same func
          return this.retryWithDelay(fn, (retries - 1), interval, finalErr);
        }
    }

    isAuthenticated() {
        return new Promise(function(resolve, reject) {
          const profileData = sessionStorage.getItem("profile_data");
          const isLoggedInAttempt = sessionStorage.getItem("start_login_flow");
          const token = sessionStorage.getItem("access_token");

          if(profileData != undefined && token != undefined  && isLoggedInAttempt === "true") {
            resolve(profileData);
          } else {
            reject(new Error(`User not authenticated !`));
          }
        });
      }


    handleUploadProfile(e) {

        // deprecated
        
    }

    clearProgressBar() {
        document.querySelector(".loader").style.display = "none"
        document.querySelector(".success-lottie").style.display = "flex"
    }

    handleInitiateNotification(dataForAPI) {
    
        const url = configTestEnv["notificationServiceHost"] + "/notification/me"
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
                this.fetchUnreadCountForNotifications();
            } 
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    
    }

    handleMyProfileClickAction(e) {
        window.location.href = "profile.html"
    }

    clearEmptyErrorValue() {
        document.getElementsByClassName("empty-error-value")[0].remove()
    }

    handleNotificationDropdownPanel() {
        
        if(document.querySelector(".dropdown-items-outer-container-notification").classList.contains("show-panel")) {
            document.querySelector(".dropdown-items-outer-container-notification").classList.remove("show-panel")  
    
            resetDropdownPanel();
    
        } else {
            document.querySelector(".dropdown-items-outer-container-notification").classList.add("show-panel");
            if(document.querySelector(".dropdown-items-outer-container").classList.contains("show-panel")) {
                document.querySelector(".dropdown-items-outer-container").classList.remove("show-panel")
            }
    
            this.fetchUserNotifications(false);          
        }
    
    }

    resetPopUps() {
        document.querySelectorAll(".task-bucket-sidenav").forEach((item) => {
            item.style.display = "none";
        })
    }

    fetchUserNotifications(allFlag) {
        
        let url = configTestEnv["notificationServiceHost"] + "/notification/all?"
        url += `user_id=${localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1}`
        url += `&all_flag=${allFlag}`
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authToken}` 
            }
        })
        .then(response => {
            return response.json()})
        .then(data => {
            if(data["status"] == "success") {
                this.renderAllNotifications(data);
            }
        })
        .catch((error) => {
            console.log(error)
        })
    
    }

    updateNotificationStatus(e) {
    
        // mark the notification as read by removing the blue dot alert / icon and toggle the class so that API call only goes when
        // not already read 
        if(e.currentTarget.children[0].children[2] != undefined) {
            e.currentTarget.children[0].children[2].style.display = "none";
        
            let dataForAPI = {"user_id": localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1, "event_id": e.currentTarget.getAttribute("event-id")}
            
            const url = configTestEnv["notificationServiceHost"] + "/notification/status"
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(dataForAPI), 
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data["status"] == "success") {
                    this.fetchUnreadCountForNotifications("Opioner | My profile");
                }
            })
            .catch((error) => {
                console.log(error)
                alert(error)
            })    
        }
    
    }

    renderAllNotifications(notificationData) {
    
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
            tempDropdownContainer.addEventListener('click', this.updateNotificationStatus.bind(this));
            this.notificationDropdownRef.appendChild(tempDropdownContainer);
    
        }
        
        if(notificationData.see_all) {
            let seeMoreContainer = document.createElement("div");
            seeMoreContainer.classList.add("dropdown-panel-footer");
    
            seeMoreContainer.innerHTML = 
            `
            <p>See all</p>
            `
            this.dropDownContentContainerNotification.appendChild(seeMoreContainer);
            seeMoreContainer.addEventListener('click', this.showAllNotificationsForUser.bind(this));
        }
        
    }

    showAllNotificationsForUser(e) {
        
        resetDropdownPanel();
        this.fetchUserNotifications(true);
    }

    handleMenuDropdownPanel() {
        document.querySelector(".dropdown-items-outer-container").classList.toggle("show-panel")
        if(document.querySelector(".dropdown-items-outer-container-notification").classList.contains("show-panel")) {
            document.querySelector(".dropdown-items-outer-container-notification").classList.remove("show-panel")
            resetDropdownPanel();
        }
    }

    handlelogoutUserClick(e) {
        const user_id = localStorage.getItem("user-id")
        const is_google_signed = localStorage.getItem("is_google_signed")
        const is_facebook_verified = localStorage.getItem("is_facebook_signed")
        localStorage.clear()
        this.removeUserSessions(loggedInUsername, user_id, is_google_signed, is_facebook_verified);
    }

    removeUserSessions(loggedInUsername, user_id, is_google_signed, is_facebook_verified) {
    
        const url = configTestEnv["authServiceHost"] + "/auth/logout/user"
        let dataForAPI = {"user_id": user_id, "username": loggedInUsername}
        document.querySelector(".modal-first-loader").style.display = 'flex';
    
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                "Content-Type": "application/json"
            }
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

    checkAndUpsertUserData(profileData) {

        const url = configTestEnv["userServiceHost"] + "/user/data"
        // url += `user_id=${localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : -1}`
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"profile_pic": profileData["attributes"]["profile_pic"][0]}),
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if(response.status === 401) {
                window.location.href = "index.html"
                return;
            }
            return response.json()})
        .then(data => {
            if(data["status"] == "success") {
                // this.setUserDataInContext(data);
                console.log(data);
            } else {
                console.log(data)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    
    }

    setUserDataInContext(userData) {
    
    
        firstname = userData["firstName"]
        lastname = userData["lastName"]
        loggedInUsername = userData["username"]
        loggedInUserEmailId = userData["email"]

        let userAvatarImage = document.querySelector(".profile-pic")
        if(userData["attributes"] != undefined && userData["attributes"]["profile_pic"].length > 0) {
            userAvatarImage.src = userData["attributes"]["profile_pic"][0]
            profilePicUrl = userData["attributes"]["profile_pic"][0]
        }

        if(document.getElementsByClassName('dropdown-btn-outer-container')[0].children[0].children[1].children[0] != undefined) {
            document.getElementsByClassName('dropdown-btn-outer-container')[0].children[0].children[1].children[0].innerText = `Welcome ${this.toTitleCase(firstname)}`
        }

        if(document.getElementsByClassName('dropdown-btn-outer-container')[0].children[0].children[0].children[0] != undefined) {
            document.getElementsByClassName('dropdown-btn-outer-container')[0].children[0].children[0].children[0].innerHTML = `
            <img class="profile-pic-menu" src=${userData["attributes"]["profile_pic"][0]} onerror="this.onerror=null;this.src='images/avatar.gif';">
            `
        }

        userAvatarImage.onerror = function () {
            if(userData["user_data"]["is_google_verified"] && userData["user_data"]["google_profile_url"] != null) {
                userAvatarImage.src = userData["user_data"]["google_profile_url"]
            } else if(userData["user_data"]["is_facebook_verified"] && userData["user_data"]["facebook_profile_url"] != null) {
                userAvatarImage.src = userData["user_data"]["facebook_profile_url"]
            } else {
                userAvatarImage.src = getImagePath(firstname)
            }
        }
        userAvatarImage.addEventListener('click', this.showUploadProfileModal.bind(this))
    
        if (document.querySelectorAll(".notify-email")[1] != undefined) {
            document.querySelectorAll(".notify-email")[1].value = userData["email"]
        }
    }

    toTitleCase(str) {
        if (str == null) {
            return ""
        } else {
            return str.toLowerCase().split(' ').map(function (word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
              }).join(' ');
        }
        
    }

    showUploadProfileModal() {
    
        document.querySelector(".modal-header-image-upload").innerHTML = "wanna update your profile pic?"
        let modal = document.getElementById("sign-up-modal")
        modal.style.display = "block";
        document.querySelector("#close").addEventListener('click', this.closeSignUpModal.bind(this))
        document.querySelector(".success-lottie").style.display = "none"
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                if (typeof this.resetPopUps === 'function') {
                    this.resetPopUps();
                }
                if (typeof this.resetAllPopup === 'function') {
                    this.resetAllPopup();
                }
            }
        }
    }

    closeSignUpModal() {
        document.getElementById("sign-up-modal").style.display = "none";
    }

    fetchUnreadCountForNotifications(customPageName) {

        const url = configTestEnv["notificationServiceHost"] + "/notification/unread-count"
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authToken}` 
            }
        })
        .then(response => {
            return response.json()})
        .then(data => {
            if(data["status"] == "success") {
                this.updateNotificationsInContext(data["unread_count"], customPageName);
            }
        })
        .catch((error) => {
            console.log(error)
        })
    
    }

    updateNotificationsInContext(unreadCount, customPageName) {
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

}

function onLoad() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
      googleSignOutByUser();
    });
}

function googleSignOutByUser() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      auth2.disconnect();
    });
}

function getImagePath(firstname) {
    
    return `images/${firstname[0].toUpperCase()}.png`

}

function resetDropdownPanel() {
    const notificationDropdownRef = document.getElementsByClassName("dropdown-items-notification")[0];
    notificationDropdownRef.innerHTML = ''
    if(document.getElementsByClassName("dropdown-panel-footer")[0] != undefined)
    document.getElementsByClassName("dropdown-panel-footer")[0].remove(); 
}