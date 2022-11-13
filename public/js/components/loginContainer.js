class loginContainer extends HTMLElement {

    render() {

        this.innerHTML = 
            `<div id="sign-up-modal" class="modal">
            <div class="modal-content">
                <div id="modal-header">
                    <p>Sign Up</p> 
                    <span class="sign-up-close">&times;</span>
                </div>
                <div>
                    <p class="subtitle">Sign up today to get premium access</p>
                </div>
                <form id="reg-form">
                    <div id="user-basic-details">
                        <input class="new-user-first-name" placeholder="first name ...." oninput="appController.handleOnChangeInput(event)" required></input>
                        <input class="new-user-last-name" placeholder="last name ...." oninput="appController.handleOnChangeInput(event)" required></input>
                    </div>
                    <div id="form-block-separator"></div>
                    <div id="user-credentials">
                        <div class="tooltip">
                            <input class="new-username" placeholder="choose username ...." oninput="appController.handleOnChangeInput(event)" required></input>
                            <span class="tooltiptext">Username must be non empty and minimum 8 characters</span>
                        </div>
                        <div class="tooltip">
                            <input autocomplete="on" class="new-password" placeholder="choose password ...." type="password" oninput="appController.handleOnChangeInput(event)" required></input>
                            <span class="tooltiptext">Password must be non empty and between 7 to 15 characters including atleast one numeric and one special character</span>
                            <i class="far fa-eye" id="sign-up-eye-icon"></i>
                        </div>
                        
                    </div>
                    <div id="user-contact">
                        <div class="tooltip">
                            <input autocomplete="on" class="user-contact-email" placeholder="Enter valid email ...." type="email" oninput="appController.handleOnChangeInput(event)" required></input>
                            <span class="tooltiptext" style="left: 132px;top: 70px;">Enter a valid email so that we can send you OTP</span>
                        </div>
                    </div>
                    <div id="otp-by-email">
                        <div class="digit-group">
                            <input class="otp-box" type="text" maxlength="1" oninput="appController.handleOnChangeInput(event)"></input>
                            <input class="otp-box" type="text" maxlength="1" oninput="appController.handleOnChangeInput(event)"></input>
                            <input class="otp-box" type="text" maxlength="1" oninput="appController.handleOnChangeInput(event)"></input>
                            <input class="otp-box" type="text" maxlength="1" oninput="appController.handleOnChangeInput(event)"></input>
                            <input class="otp-box" type="text" maxlength="1" oninput="appController.handleOnChangeInput(event)"></input>
                            <input class="otp-box" type="text" maxlength="1" oninput="appController.handleOnChangeInput(event)"></input>
                        </div>
                    </div>
                    <div class="signup-error-section">
                        <!-- <ul id="signup-error-section-items">
                            Dynamic error lists
                        </ul> -->
                    </div>
                    <div class="api-error-section">
                        <p id="api-error-msg-sign-up">OTP failed</p>
                    </div>
                    <div class="api-msg-section">
                        <p id="api-msg-sign-up">OTP success</p>
                    </div>
                    <div class="modal-loader-signup">
                    </div>
                    <div id=verify-otp-btn>
                        <button type="submit" id="verify-otp">Send OTP</button>
                    </div>
                    <div id=submit-reg-form>
                        <button type="submit" id="sign-up-user">Sign Up</button>
                    </div>
                    <div id="otp-timer-section">
                        <p id="otp-counter"></p>
                    </div>
                </form>
            </div>
        </div>
        <section id="form-outer-container">
            <section id="login-inner-container">
                <form id="login-user-container">
                    <h1 class="login-header-title">Sign in</h1>
                    <button class="login-btn" onclick="handleOnLogin()">Login</button>
                    <div class="modal-loader">
                    </div>
                    <p class="forgot-password-container"><a href="password-change.html">Forgotten password?</a></p>
                    <div class="failure-lottie">
                        <img src="images/lower-sign-hand.gif">
                        <p>We could not find you ! Do you want to sign up instead ?</p>
                    </div>
                    <div id="separator"></div>
                    <button class="sign-up-btn" onclick="loadProfileData()">Create New Account</button>
                </form>
                <div class="login-image-container">
                    <img src="images/login_3.png">
                </div>
            </section>
        </section>`

    }
  
    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  
    disconnectedCallback() {
    }
  
    static get observedAttributes() {
      return [];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
}

customElements.define("login-container", loginContainer);
