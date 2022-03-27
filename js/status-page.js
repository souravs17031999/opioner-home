class StatusPageController {
    constructor() {

        this.lastSuccess = {
            "auth": "N.A.",
            "product": "N.A.",
            "user": "N.A.",
            "notification": "N.A.",
            "cron": "N.A."
        }
        
        this.lastFailure = {
            "auth": "N.A.",
            "product": "N.A.",
            "user": "N.A.",
            "notification": "N.A.",
            "cron": "N.A."
        }

        this.cronTimeInSeconds = "60000"
        this.lastUpdated = "N.A."
        this.statusRow = document.getElementsByClassName("serviceList__status")
        for(let service of this.statusRow) {
            service.children[0].children[0].addEventListener("mouseover", this.showLastUpdatedResults.bind(this));
        }

    }

    setLastUpdatedStatus(currentStatus) {
        this.lastUpdated = currentStatus
    }

    getLastUpdatedStatus() {
        return `${this.lastUpdated}`
    }

    getCronTimeSeconds() {
        return this.cronTimeInSeconds
    }

    fetchAuthServiceStatus() {

        const url = configTestEnv["authServiceHost"] + "/auth/status/live"
        fetch(url, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] === "success") {
                this.lastSuccess["auth"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[0].children[0].children[0].src="images/green-circle.png"
            } else {
                this.lastFailure["auth"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[0].children[0].children[0].src="images/red-circle.png"
                console.log(`ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            this.lastFailure["auth"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[0].children[0].children[0].src="images/red-circle.png"
            console.log(error)
        })    
    }
    
    fetchProductServiceStatus() {
    
        const url = configTestEnv["productServiceHost"] + "/product/status/live"
        fetch(url, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] === "success") {
                this.lastSuccess["product"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[1].children[0].children[0].src="images/green-circle.png"
            } else {
                this.lastFailure["product"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[1].children[0].children[0].src="images/red-circle.png"
                console.log(`ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            this.lastFailure["product"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[1].children[0].children[0].src="images/red-circle.png"
            console.log(error)
        })    
    }
    
    fetchUserServiceStatus() {
    
        const url = configTestEnv["userServiceHost"] + "/user/status/live"
        fetch(url, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] === "success") {
                this.lastSuccess["user"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[2].children[0].children[0].src="images/green-circle.png"
            } else {
                this.lastFailure["user"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[2].children[0].children[0].src="images/red-circle.png"
                console.log(`ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            this.lastFailure["user"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[2].children[0].children[0].src="images/red-circle.png"
            console.log(error)
        })    
    }
    
    fetchNotificationServiceStatus() {
    
        const url = configTestEnv["notificationServiceHost"] + "/notification/status/live"
        fetch(url, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] === "success") {
                this.lastSuccess["notification"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[3].children[0].children[0].src="images/green-circle.png"
            } else {
                this.lastFailure["notification"] = new Date().toLocaleString()
                document.getElementsByClassName("serviceList__status")[3].children[0].children[0].src="images/red-circle.png"
                console.log(`ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            this.lastFailure["notification"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[3].children[0].children[0].src="images/red-circle.png"
            console.log(error)
        })    
    }
    
    fetchCronServiceStatus() {
        // STUB
        this.lastSuccess["cron"] = new Date().toLocaleString()
    }
    
    showLastUpdatedResults(event) {
        event.target.nextElementSibling.innerHTML = "last-success: " + this.lastSuccess[event.target.getAttribute("id")] + "; last-failure: " + this.lastFailure[event.target.getAttribute("id")]
    }

}

window.onload = initialLoadForStatusPage

function initialLoadForStatusPage() {

    const statusPageController = new StatusPageController()

    try {
        setInterval(function() {
            statusPageController.fetchAuthServiceStatus();
            statusPageController.setLastUpdatedStatus(new Date().toLocaleString());
            document.getElementsByTagName("time")[0].innerHTML = statusPageController.getLastUpdatedStatus();
        }, statusPageController.getCronTimeSeconds())
    }
    catch(err) {
        console.log(err)
    }
    
    try {
        setInterval(function() {
            statusPageController.fetchProductServiceStatus();
        }, statusPageController.getCronTimeSeconds())
    }
    catch(err) {
        console.log(err)
    }

    try {
        setInterval(function() {
            statusPageController.fetchUserServiceStatus();
        }, statusPageController.getCronTimeSeconds())
    }
    catch(err) {
        console.log(err)
    }

    try {
        setInterval(function() {
            statusPageController.fetchNotificationServiceStatus();
        }, statusPageController.getCronTimeSeconds())
    }
    catch(err) {
        console.log(err)
    }

    try {
        setInterval(function() {
            statusPageController.fetchCronServiceStatus();
        }, statusPageController.getCronTimeSeconds())
    }
    catch(err) {
        console.log(err)
    }
    
}