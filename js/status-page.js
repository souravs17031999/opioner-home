window.onload = initialLoadForStatusPage

var lastSuccess = {
    "auth": "N.A.",
    "product": "N.A.",
    "user": "N.A.",
    "notification": "N.A.",
    "cron": "N.A."
}

var lastFailure = {
    "auth": "N.A.",
    "product": "N.A.",
    "user": "N.A.",
    "notification": "N.A.",
    "cron": "N.A."
}

var lastUpdated = "N.A."
let statusRow = document.getElementsByClassName("serviceList__status")
for(let service of statusRow) {
    service.children[0].children[0].addEventListener("mouseover", showLastUpdatedResults);
}

function initialLoadForStatusPage() {

    try {
        setInterval(function() {
            fetchAuthServiceStatus();
            lastUpdated = new Date().toLocaleString();
            document.getElementsByTagName("time")[0].innerHTML = `${lastUpdated}`
        }, 60000)
    }
    catch(err) {
        console.log(err)
    }
    
    try {
        setInterval(function() {
            fetchProductServiceStatus();
        }, 60000)
    }
    catch(err) {
        console.log(err)
    }

    try {
        setInterval(function() {
            fetchUserServiceStatus();
        }, 60000)
    }
    catch(err) {
        console.log(err)
    }

    try {
        setInterval(function() {
            fetchNotificationServiceStatus();
        }, 60000)
    }
    catch(err) {
        console.log(err)
    }

    try {
        setInterval(function() {
            fetchCronServiceStatus();
        }, 60000)
    }
    catch(err) {
        console.log(err)
    }
    
}

function fetchAuthServiceStatus() {

    url = configTestEnv["authServiceHost"] + "/auth/status/live"
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] === "success") {
            lastSuccess["auth"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[0].children[0].children[0].src="images/green-circle.png"
        } else {
            lastFailure["auth"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[0].children[0].children[0].src="images/red-circle.png"
            console.log(`ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        lastFailure["auth"] = new Date().toLocaleString()
        document.getElementsByClassName("serviceList__status")[0].children[0].children[0].src="images/red-circle.png"
        console.log(error)
    })    
}

function fetchProductServiceStatus() {

    url = configTestEnv["productServiceHost"] + "/product/status/live"
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] === "success") {
            lastSuccess["product"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[1].children[0].children[0].src="images/green-circle.png"
        } else {
            lastFailure["product"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[1].children[0].children[0].src="images/red-circle.png"
            console.log(`ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        lastFailure["product"] = new Date().toLocaleString()
        document.getElementsByClassName("serviceList__status")[1].children[0].children[0].src="images/red-circle.png"
        console.log(error)
    })    
}

function fetchUserServiceStatus() {

    url = configTestEnv["userServiceHost"] + "/user/status/live"
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] === "success") {
            lastSuccess["user"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[2].children[0].children[0].src="images/green-circle.png"
        } else {
            lastFailure["user"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[2].children[0].children[0].src="images/red-circle.png"
            console.log(`ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        lastFailure["user"] = new Date().toLocaleString()
        document.getElementsByClassName("serviceList__status")[2].children[0].children[0].src="images/red-circle.png"
        console.log(error)
    })    
}

function fetchNotificationServiceStatus() {

    url = configTestEnv["notificationServiceHost"] + "/notification/status/live"
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] === "success") {
            lastSuccess["notification"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[3].children[0].children[0].src="images/green-circle.png"
        } else {
            lastFailure["notification"] = new Date().toLocaleString()
            document.getElementsByClassName("serviceList__status")[3].children[0].children[0].src="images/red-circle.png"
            console.log(`ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        lastFailure["notification"] = new Date().toLocaleString()
        document.getElementsByClassName("serviceList__status")[3].children[0].children[0].src="images/red-circle.png"
        console.log(error)
    })    
}

function fetchCronServiceStatus() {
    // STUB
    lastSuccess["cron"] = new Date().toLocaleString()
}

function showLastUpdatedResults(event) {
    event.target.nextElementSibling.innerHTML = "last-success: " + lastSuccess[event.target.getAttribute("id")] + "; last-failure: " + lastFailure[event.target.getAttribute("id")]
}