window.fbAsyncInit = function() {
    FB.init({
      appId      : '237529941864199',
      status     : false,
      cookie     : true,                     
      xfbml      : true,                     
      version    : 'v12.0'           
    });


    FB.getLoginStatus(function(response) {   
      statusChangeCallback(response);
    });
  };

function statusChangeCallback(response) {  
    if (response.status === 'connected') {   
      signInViaFacebookAPI(response);  
    } else {                                 
      console.log("========= NOT ABLE TO LOG IN")
    }
  }

  function checkLoginState() {               
    FB.getLoginStatus(function(response) {   
      statusChangeCallback(response);
    });
  }

  function signOutFacebook() {
    FB.logout(function(response) {
        console.log("=========== user logged out .....")
    });
}