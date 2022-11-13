 // const loadData = () => {
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> LOGGED IN <<<<<<<<<<<<<<<<<<<<")
//     document.getElementsByTagName('h1').innerHTML = keycloak.idTokenParsed.name;
//     console.log(keycloak.subject);
//     if (keycloak.idToken) {
//         document.location.href = "?user="+keycloak.idTokenParsed.preferred_username;
//         console.log('IDToken');
//         console.log(keycloak.idTokenParsed.preferred_username);
//         console.log(keycloak.idTokenParsed.email);
//         console.log(keycloak.idTokenParsed.name);
//         console.log(keycloak.idTokenParsed.given_name);
//         console.log(keycloak.idTokenParsed.family_name);
//     } else {
//         keycloak.loadUserProfile(function() {
//             console.log('Account Service');
//             console.log(keycloak.profile.username);
//             console.log(keycloak.profile.email);
//             console.log(keycloak.profile.firstName + ' ' + keycloak.profile.lastName);
//             console.log(keycloak.profile.firstName);
//             console.log(keycloak.profile.lastName);
//         }, function() {
//             console.log('Failed to retrieve user details. Please enable claims or account role');
//         });
//     }
// };

// const loadFailure =  () => {
//     console.log('Failed to load data.  Check console log');
// };


var keycloak = new Keycloak('keycloak.json');

keycloak.onAuthSuccess = function() { 
    
    keycloak.loadUserProfile()
    .then(function(profile) {
        sessionStorage.setItem("profile_data", JSON.stringify(profile))
        sessionStorage.setItem("access_token", keycloak.token)
        sessionStorage.setItem("id_token", keycloak.idToken)

        // if(window.location.href.indexOf("index") > 0) {
        //     window.location.href = "home.html"
        // }
    }).catch(function() {
        alert('Failed to load user profile');
    });
}


function getLoginRedirecturi() {
    if(window.location.href.indexOf("home") > 0) {
        return configTestEnv["loginHomeRedirectUri"]
    } else if(window.location.href.indexOf("profile") > 0) {
        return configTestEnv["loginProfileRedirectUri"]
    } else {
        return configTestEnv["loginIndexRedirectUri"]
    }
}

function handleOnLogin() {
    sessionStorage.setItem("start_login_flow", "true");  
    keycloak.init({onLoad: 'login-required', promiseType: 'native', enableLogging: true, checkLoginIframe: false, redirectUri: getLoginRedirecturi()})
}

function handleOnLogout() {
    sessionStorage.clear()  
    keycloak.logout({
        redirectUri : configTestEnv["logoutRedirectUri"]
    }).then((success) => {
        console.log("--> log: logout success ", success );
    }).catch((error) => {
            console.log("--> log: logout error ", error );
    });
}

function updateToken() {
    keycloak.updateToken(10)
    .then((refreshed) => {
        console.log("---> log: token was refreshed: ", refreshed)
    }).catch((error) => {
        console.log("--> log: refresh error ", error );
    });
}

if(window.location.href.indexOf("index") > 0) {

    if(sessionStorage.getItem("start_login_flow") != undefined && sessionStorage.getItem("start_login_flow")) {
        setTimeout(function() {
            handleOnLogin()
        }, 500)
    }
}
