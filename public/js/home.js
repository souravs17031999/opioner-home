class HomeController extends BaseController {

    constructor() {
        super();

        if(window.location.href.indexOf("home") > 0) {
            document.getElementsByClassName("add-item-public-btn")[0].addEventListener('click', this.insertUserPublicFeed.bind(this));

            // load all btns eventlisteners
            let btns = document.querySelectorAll("button")
            if(btns.length > 0) {
                for(let btn of btns) {
                    if(btn.classList.contains("notify-push-btn")) {
                        btn.addEventListener('click', this.subscribeUserToNotification.bind(this))
                    }
                }
            }
        }

        this.authenticateUser();
        
    }

    authenticateUser() {
        this.retryWithDelay(this.isAuthenticated)
        .then(response => JSON.parse(response))
        .then(profileData => {
            this.setUserDataInContext(profileData)
            // this.fetchUserData();
            this.fetchUnreadCountForNotifications("Opioner | Home");
            this.loadAllPublicFeeds();
        })
        .catch((error) => {
            console.log(error)
        })    

        // (async () => {
        // const profileData = await this.retryWithDelay(this.isAuthenticated)
        // console.log(profileData)
        // })();
    }

    loadAllPublicFeeds(page=1, size=10) {
        let url = configTestEnv["productServiceHost"] + "/product/public/feeds?"
        url += `&page=${page}&size=${size}`
    
        if(page == 1) {
            document.querySelector(".modal-first-loader").style.display = 'flex';
        } else {
            document.getElementsByClassName("modal-loader")[0].style.display = 'flex';
        }
    
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authToken}` 
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
                document.getElementsByClassName("modal-loader")[0].style.display = 'none';
                document.querySelector(".modal-first-loader").style.display = 'none';
                this.renderFeedsForUser(data, false);
            } else {
                console.log(`ERROR: ", ${data["message"]}`)
                document.querySelector(".modal-first-loader").style.display = 'none';
                document.getElementsByClassName("modal-loader")[0].style.display = 'none';
                allFetched = true;
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    renderFeedsForUser(feedData, shouldInsertSingleFeed) {
        
        let feedRef = document.getElementById("public-feeds")
    
        if(!shouldInsertSingleFeed) {
            for(let feed of feedData["feeds"]) {
                let feedItemContainer = document.createElement("div")
                feedItemContainer.classList.add("dynamic-feeds-outer-container")
                feedItemContainer.setAttribute("list-id", feed.list_id)
                feedItemContainer.setAttribute("iter-id", feed.id-1)
                feedItemContainer.setAttribute("has-liked", feed.has_liked)
                feedItemContainer.setAttribute("has-commented", feed.has_commented)
                feedItemContainer.innerHTML = `
                        <div id="dynamic-feeds-outer-header">
                            <div id="dynamic-header-profile-pic">
                                <img class="dynamic-feed-user-profile-pic" src="" onerror="this.onerror=null;this.src='images/avatar.gif';">
                            </div>
                            <div id="dynamic-header-user-info">
                                <div id="dynamic-header-user-name">
                                    <span class="dynamic-header-user-name-span">${this.toTitleCase(feed.firstname)} ${this.toTitleCase(feed.lastname)}</span>
                                </div>
                                <div id="dynamic-header-user-feed-created-time">
                                    <span class="dynamic-header-user-feed-created-time-span">${dayjs(feed.created_at).format('ddd, D MMMM, YYYY h:mm A')}</span>
                                </div>
                            </div>
                            <div id="dynamic-header-menus">
                                <svg width="36" height="36" viewBox="0 0 24 24" role="presentation" class="svg-dynamic-header-menus">
                                    <g fill="currentColor" fill-rule="evenodd">
                                        <circle cx="5" cy="12" r="2"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                        <circle cx="19" cy="12" r="2"></circle>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div class="task-bucket-sidenav" style="display:none;">
                            <div class="render-sidenav-outer-container">
                                <div class="sidenav-outer-shadow-box">
                                    <div class="sidenav-inner-container">
                                        <div class="sidenav-items-options-for-feed">${feed.has_subscribed ? "Unsubscribe to creator" : "Subscribe to creator"}</div>
                                        <div class="sidenav-items-options-for-feed">${feed.is_flagged ? "Unreport" : "Report"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="section-separator"></div>
                        <div id="dynamic-feeds-outer-info-section">
                            <p class="dynamic-feeds-user-content">${feed.description}</p>
                        </div>
                        <div class="dynamic-feeds-counts-likes-comments">
                            <div id="feeds-likes-counts">
                                <img height="18" role="presentation" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" width="18">
                                <span class="counts-of-likes">0</span>
                            </div>
                            <div id="feeds-comments-counts">
                                <span class="counts-of-comments">0 comments</span>
                            </div>
                        </div>
                        <div class="section-separator"></div>
                        <div id="dynamic-feeds-outer-footer">
                            <div class="dynamic-feeds-footer-like">
                                <i id="feed-likes-pic"></i>
                                <p>Like</p> 
                            </div>
                            <div class="dynamic-feeds-footer-comment">
                                <i id="feed-comments-pic"></i>
                                <p>Comment</p>
                            </div>
                        </div>
                    `
            
                feedRef.appendChild(feedItemContainer)
                let likesCommentsCountsRef = document.getElementsByClassName("dynamic-feeds-counts-likes-comments")[feed.id-1]
                if(feed.likes > 0 || feed.comments > 0) {
                    likesCommentsCountsRef.style.display = "flex"
                    document.getElementsByClassName("dynamic-feeds-outer-container")[feed.id-1].style.minHeight="230px"
                    document.getElementsByClassName("counts-of-likes")[feed.id-1].innerText = feed.likes
                    document.getElementsByClassName("counts-of-comments")[feed.id-1].innerText = feed.comments ? `${feed.comments} comments` : "" 
                } else {
                    likesCommentsCountsRef.style.display = "none"
                    document.getElementsByClassName("dynamic-feeds-outer-container")[feed.id-1].style.minHeight="200px"
                }
    
                if(feed.has_liked) {
                    document.getElementsByClassName("dynamic-feeds-footer-like")[feed.id-1].children[0].classList.add("clicked-pic")
                    document.getElementsByClassName("dynamic-feeds-footer-like")[feed.id-1].children[1].classList.add("clicked-like-text")
                }
    
                feedItemContainer.children[0].children[2].addEventListener('click', this.handlePopUpForFeedItems.bind(this))
                // handle btns for feed popups
                feedItemContainer.children[1].children[0].children[0].children[0].children[0].addEventListener('click', this.handleSubscribeBtnForFeed.bind(this))    
                feedItemContainer.children[1].children[0].children[0].children[0].children[1].addEventListener('click', this.handleBlockBtnForFeed.bind(this))            
            
    
            }
        
            let LikeRefs = document.getElementsByClassName("dynamic-feeds-footer-like")
            let CmtRefs = document.getElementsByClassName("dynamic-feeds-footer-comment")
            
            for(let like of LikeRefs) {
                like.addEventListener('click', this.handleClickOnLikeBtn.bind(this))
            }
            for(let cmts of CmtRefs) {
                cmts.addEventListener('click', this.handleClickOnCmtBtn.bind(this))
            }
        } else {
            
            let feedItemContainer = document.createElement("div")
            feedItemContainer.classList.add("dynamic-feeds-outer-container")
            feedItemContainer.setAttribute("list-id", feedData.list_id)
            feedItemContainer.innerHTML = `
                        <div id="dynamic-feeds-outer-header">
                            <div id="dynamic-header-profile-pic">
                                <img class="dynamic-feed-user-profile-pic" src="" onerror="this.onerror=null;this.src='images/avatar.gif';">
                            </div>
                            <div id="dynamic-header-user-info">
                                <div id="dynamic-header-user-name">
                                    <span class="dynamic-header-user-name-span">${this.toTitleCase(feedData.firstname)} ${this.toTitleCase(feedData.lastname)}</span>
                                </div>
                                <div id="dynamic-header-user-feed-created-time">
                                    <span class="dynamic-header-user-feed-created-time-span">${dayjs(feedData.created_at).format('ddd, D MMMM, YYYY h:mm A')}</span>
                                </div>
                            </div>
                            <div id="dynamic-header-menus">
                                <svg width="36" height="36" viewBox="0 0 24 24" role="presentation" class="svg-dynamic-header-menus">
                                    <g fill="currentColor" fill-rule="evenodd">
                                        <circle cx="5" cy="12" r="2"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                        <circle cx="19" cy="12" r="2"></circle>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div class="task-bucket-sidenav" style="display:none;">
                            <div class="render-sidenav-outer-container">
                                <div class="sidenav-outer-shadow-box">
                                    <div class="sidenav-inner-container">
                                        <div class="sidenav-items-options-for-feed">${feedData.has_subscribed ? "Unsubscribe to creator" : "Subscribe to creator"}</div>
                                        <div class="sidenav-items-options-for-feed">${feedData.is_flagged ? "Unreport" : "Report"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="section-separator"></div>
                        <div id="dynamic-feeds-outer-info-section">
                            <p class="dynamic-feeds-user-content">${feedData.description}</p>
                        </div>
                        <div class="dynamic-feeds-counts-likes-comments">
                            <div id="feeds-likes-counts">
                                <img height="18" role="presentation" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" width="18">
                                <span class="counts-of-likes">0</span>
                            </div>
                            <div id="feeds-comments-counts">
                                <span class="counts-of-comments">0 comments</span>
                            </div>
                        </div>
                        <div class="section-separator"></div>
                        <div id="dynamic-feeds-outer-footer">
                            <div class="dynamic-feeds-footer-like">
                                <i id="feed-likes-pic"></i>
                                <p>Like</p> 
                            </div>
                            <div class="dynamic-feeds-footer-comment">
                                <i id="feed-comments-pic"></i>
                                <p>Comment</p>
                            </div>
                        </div>
                    `
            
            feedItemContainer.setAttribute("has-liked", false)
            feedItemContainer.setAttribute("has-commented", false)
            feedRef.insertBefore(feedItemContainer, feedRef.firstChild);
            let LikeRefs = document.getElementsByClassName("dynamic-feeds-footer-like")
            let CmtRefs = document.getElementsByClassName("dynamic-feeds-footer-comment")
    
            let likesCommentsCountsRef = document.getElementsByClassName("dynamic-feeds-counts-likes-comments")[0]
            likesCommentsCountsRef.style.display = "none"
            document.getElementsByClassName("dynamic-feeds-outer-container")[0].style.minHeight="200px"
            
            for(let like of LikeRefs) {
                like.addEventListener('click', this.handleClickOnLikeBtn.bind(this))
            }
            for(let cmts of CmtRefs) {
                cmts.addEventListener('click', this.handleClickOnCmtBtn.bind(this))
            }
    
            feedItemContainer.children[0].children[2].addEventListener('click', this.handlePopUpForFeedItems.bind(this))
            feedItemContainer.children[1].children[0].children[0].children[0].children[0].addEventListener('click', this.handleSubscribeBtnForFeed.bind(this))    
            feedItemContainer.children[1].children[0].children[0].children[0].children[1].addEventListener('click', this.handleBlockBtnForFeed.bind(this))
    
            let iter = 0
            document.querySelectorAll(".dynamic-feeds-outer-container").forEach((item) => {
                item.setAttribute("iter-id", iter);
                iter += 1;
            })
    
        }
    
    }

    insertUserPublicFeed(e) {

        if (e.currentTarget.parentElement.children[0].value != "") {
            let url = configTestEnv["productServiceHost"] + "/product/feed/upsert"
            let dataForAPI = { 
                            "item": e.currentTarget.parentElement.children[0].value,
                            "update_flag": 0, 
                            "privacy_status": "public"
                        }
            
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
                    // reset input after creating a new feed 
                    document.getElementsByClassName("user-added-input")[0].value = ""
                    const dataForFeedInsertion = {"list_id": data["id"], "username": loggedInUsername, "firstname": firstname, "lastname": lastname,
                        "description": dataForAPI["item"], "created_at": Date()}
                    this.renderFeedsForUser(dataForFeedInsertion, true)
                } else {
                    alert(`ERROR: ", ${data["message"]}`)
                }
            })
            .catch((error) => {
                console.log(error)
                alert(error)
            })
        } else {
            if (document.getElementsByClassName("empty-error-value").length == 0) {
                const formInnerContainer = document.getElementById("form-inner-container")
                const divErrorItem = document.createElement("p")
                divErrorItem.classList.add("empty-error-value")
                const paragraphMenuItemValue = document.createTextNode("Empty input found, please enter something")
                divErrorItem.appendChild(paragraphMenuItemValue)
                formInnerContainer.appendChild(divErrorItem)
                setTimeout(this.clearEmptyErrorValue, 1000);
            }
        }
    
    }

    handleClickOnLikeBtn(e) {
        e.stopImmediatePropagation();
        e.currentTarget.children[0].classList.toggle("clicked-pic");
        e.currentTarget.children[1].classList.toggle("clicked-like-text");
    
        let dataForAPI = {
            "user_id": parseInt(localStorage.getItem("user-id")), 
            "list_id": parseInt(e.currentTarget.parentElement.parentElement.getAttribute("list-id")),
            "update_status_event": "like_event"
        }
        let iterId = e.currentTarget.parentElement.parentElement.getAttribute("iter-id")
        let url = configTestEnv["productServiceHost"] + "/product/feed/status"
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
                this.updateUserEventsForList(iterId)
            } else {
                alert(`ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
        
    }

    updateUserEventsForList(iterId){
        let listContainer = document.getElementsByClassName("dynamic-feeds-outer-container")[iterId]
        let likesValueRef = document.getElementsByClassName("counts-of-likes")[iterId]
    
        if(listContainer.getAttribute("has-liked") == "true") {
            listContainer.setAttribute("has-liked", "false")
            likesValueRef.innerText = parseInt(likesValueRef.innerText) - 1
        } else {
            listContainer.setAttribute("has-liked", "true")
            likesValueRef.innerText = parseInt(likesValueRef.innerText) + 1
        }
        let likesCommentsCountsRef = document.getElementsByClassName("dynamic-feeds-counts-likes-comments")[iterId]
        if(parseInt(likesValueRef.innerText) > 0) {
            likesCommentsCountsRef.style.display = "flex"
            document.getElementsByClassName("dynamic-feeds-outer-container")[iterId].style.minHeight="230px"
        } else {
            let commentValueRef = document.getElementsByClassName("counts-of-comments")[iterId]
            if(parseInt(commentValueRef.innerText) <= 0) {
                likesCommentsCountsRef.style.display = "none"
                document.getElementsByClassName("dynamic-feeds-outer-container")[iterId].style.minHeight="200px"
            }
        }
        
    }

    handleClickOnCmtBtn(e) {

        e.currentTarget.classList.toggle("clicked-comment-text")
        // e.currentTarget.parentElement.parentElement.children[7] should be the input text field 
        if(e.currentTarget.parentElement.parentElement.children[7] != undefined) {
            let userInputCmt = e.currentTarget.parentElement.parentElement.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild
            userInputCmt.focus();
        }
    
        if(e.currentTarget.parentElement.parentElement.children[7] == undefined) {
    
            let cmtBlock = document.createElement("div")
            cmtBlock.classList.add("footer-for-feed-comments")
            cmtBlock.innerHTML = 
            `
                <div class="section-separator-without-padding"></div>
                <div class="footer-comments">
                    <div class="comment-profile-pic">
                        <img class="feed-comment-profile-pic" src="" onerror="this.onerror=null;this.src='images/avatar.gif';">
                    </div>
                    <div class="comment-user-input">
                        <div class="comment-background">
                            <input placeholder="Write a comment..." class="comment-user-footer-input">
                        </div>
                    </div>
                </div>
            `
    
            e.currentTarget.parentElement.parentElement.appendChild(cmtBlock)
            let userInputCmt = e.currentTarget.parentElement.parentElement.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild
            userInputCmt.addEventListener('keyup', this.handleUserEnteredComment.bind(this))
    
            // API call for rendering comments
            let url = configTestEnv["productServiceHost"] + "/product/comments?"
            url += `list_id=${e.currentTarget.parentElement.parentElement.getAttribute("list-id")}`
            url += `&user_id=${parseInt(localStorage.getItem("user-id"))}`
            
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}` 
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data["status"] == "success") {
                    
                    for (let item of data["comments"]) {
                        let renderedCmntBlock = document.createElement("div")
                        renderedCmntBlock.classList.add("render-footer-comments")
                        renderedCmntBlock.setAttribute("comment-id", item.comment_id)
                        renderedCmntBlock.innerHTML = 
                        `
                            <div class="render-comment-profile-pic">
                                <img class="render-feed-comment-profile-pic" src="" onerror="this.onerror=null;this.src='images/avatar.gif';">
                            </div>
                            <div class="render-comment-user-input">
                                <div class="render-comment-background">
                                    <div class="render-comment-user-footer-input">
                                        <div class="render-header-for-comment-section">
                                            <div class="render-comment-username">
                                                ${item.username}
                                            </div>
                                            <div id="render-dynamic-header-menus">
                                                <svg width="36" height="36" viewBox="0 0 24 24" role="presentation" class="render-svg-dynamic-header-menus">
                                                    <g fill="currentColor" fill-rule="evenodd">
                                                        <circle cx="5" cy="12" r="2"></circle>
                                                        <circle cx="12" cy="12" r="2"></circle>
                                                        <circle cx="19" cy="12" r="2"></circle>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="task-bucket-sidenav" style="display:none;">
                                            <div class="render-comment-sidenav-outer-container">
                                                <div class="sidenav-outer-shadow-box">
                                                    <div class="sidenav-inner-container">
                                                        <div class="sidenav-items-options-for-comments">${item.is_flagged ? "Unflag" : "Flag"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="render-comment-text">
                                            ${item.comment_text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        `
    
                        renderedCmntBlock.children[1].children[0].children[0].children[0].children[1].addEventListener('click', this.handlePopUpForComments.bind(this))
                        renderedCmntBlock.children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].addEventListener('click', this.flagCommentByUser.bind(this))
    
                        cmtBlock.appendChild(renderedCmntBlock)
                    }
    
                } else {
                    console.log(`ERROR: ", ${data["message"]}`)
                }
            })
            .catch((error) => {
                console.log(error)
            })        
    
        }
        
    }

    handlePopUpForComments(e) {
        if(e.currentTarget.parentElement.parentElement.children[1].style.display == 'block') {
            e.currentTarget.parentElement.parentElement.children[1].style.display = 'none'
        } else {
            e.currentTarget.parentElement.parentElement.children[1].style.display = 'block'
        }
    }

    flagCommentByUser(e) {

        let cmtBlockInContext = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
        
        let feedItemContainer = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    
        let dataForAPI = {
            "user_id": localStorage.getItem("user-id"), 
            "list_id": feedItemContainer.getAttribute("list-id"),
            "update_flag": 1,
            "comment_text": e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].innerText,
            "is_flagged": 1,
            "comment_id": e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("comment-id")
        }
    
        let url = configTestEnv["productServiceHost"] + "/product/public/comments"
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
                if(data["flagged_status"] == "FALSE") {
                    alert(data["message"])
                } 
                else if(data["flagged_status"] == "TRUE") {
                    alert(data["message"])
                }
                this.updatePopUpOptionsAfterFlag(data, cmtBlockInContext)
                resetPopUps();
            } else {
                console.log(`ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    }

    handleUserEnteredComment(e) {

        // call comment Insert API when user clicks enters in cmt box 
        if (e.keyCode === 13 && e.currentTarget.value != "") {
    
            let dataForAPI = {
                "user_id": localStorage.getItem("user-id"), 
                "list_id": e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("list-id"),
                "update_flag": 0,
                "comment_text": e.currentTarget.value
            }
            e.currentTarget.value = ""
            let iterId = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("iter-id")
            let url = configTestEnv["productServiceHost"] + "/product/public/comments"
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
                    this.updateAddCommentsForUser(iterId, data, dataForAPI)
                } else {
                    alert(`ERROR: ", ${data["message"]}`)
                }
            })
            .catch((error) => {
                console.log(error)
                alert(error)
            })    
        }
    
    }

    updateAddCommentsForUser(iterId, data, dataForAPI) {
        // update the count of total comments
        let commentVal = document.getElementsByClassName("dynamic-feeds-counts-likes-comments")[iterId].children[1].children[0].innerText
        document.getElementsByClassName("dynamic-feeds-counts-likes-comments")[iterId].children[1].children[0].innerText = `${parseInt(commentVal) + 1} comments`
    
        // append newly created comment
        
        let renderedCmntBlock = document.createElement("div")
        renderedCmntBlock.classList.add("render-footer-comments")
        renderedCmntBlock.setAttribute("comment-id", data.comment.comment_id)
        renderedCmntBlock.innerHTML = 
        `
            <div class="render-comment-profile-pic">
                <img class="render-feed-comment-profile-pic" src="" onerror="this.onerror=null;this.src='images/avatar.gif';">
            </div>
            <div class="render-comment-user-input">
                <div class="render-comment-background">
                    <div class="render-comment-user-footer-input">
                        <div class="render-header-for-comment-section">
                            <div class="render-comment-username">
                                ${loggedInUsername}
                            </div>
                            <div id="render-dynamic-header-menus">
                                <svg width="36" height="36" viewBox="0 0 24 24" role="presentation" class="render-svg-dynamic-header-menus">
                                    <g fill="currentColor" fill-rule="evenodd">
                                        <circle cx="5" cy="12" r="2"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                        <circle cx="19" cy="12" r="2"></circle>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div class="task-bucket-sidenav" style="display:none;">
                            <div class="render-comment-sidenav-outer-container">
                                <div class="sidenav-outer-shadow-box">
                                    <div class="sidenav-inner-container">
                                        <div class="sidenav-items-options-for-comments">Flag</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="render-comment-text">
                            ${dataForAPI.comment_text}
                        </div>
                    </div>
                </div>
            </div>
        
        `
        renderedCmntBlock.children[1].children[0].children[0].children[0].children[1].addEventListener('click', this.handlePopUpForComments.bind(this))
        let currentSelectedCmtBlock = document.getElementsByClassName("footer-for-feed-comments")
    
        for (let cmt of currentSelectedCmtBlock) {
            if (cmt.parentElement.getAttribute("list-id") == dataForAPI.list_id) {
                cmt.appendChild(renderedCmntBlock)
                break;
            }
        }
    
    }

    handlePopUpForFeedItems(e) {
        if(e.currentTarget.parentElement.parentElement.children[1].style.display == 'block') {
            e.currentTarget.parentElement.parentElement.children[1].style.display = 'none'
        } else {
            e.currentTarget.parentElement.parentElement.children[1].style.display = 'block'
        }
        
        this.closeOtherPopupOptionsMenusForFeed(e.currentTarget.parentElement.parentElement.getAttribute("list-id"));
    }
    
    closeOtherPopupOptionsMenusForFeed(selected_id) {
        document.querySelectorAll(".dynamic-feeds-outer-container").forEach((item) => {
            if(item.getAttribute("list-id") != selected_id) {
                item.children[1].style.display = 'none';
            }
        })
    }

    handleSubscribeBtnForFeed(e) {

        if(e.currentTarget.innerText === "Unsubscribe to creator") {
            let feedItemContainer = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
            this.unsubscribeUserToNotification(feedItemContainer);
            return;
        }
        let modal = document.getElementById("notify-push-modal")
        modal.style.display = "block";
    
        document.querySelectorAll("#close")[1].addEventListener('click', this.closeNotifyModal.bind(this))
        let feedItemContainer = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
        let list_id = feedItemContainer.getAttribute("list-id")
        let iter_id = feedItemContainer.getAttribute("iter-id")
        document.querySelector(".notify-push-btn").setAttribute("list-id", list_id) 
        document.querySelector(".notify-push-btn").setAttribute("iter-id", iter_id) 
        document.querySelector(".notify-email").value = loggedInUserEmailId === undefined ? "" : loggedInUserEmailId
    
        window.onclick = function(event) {
            if (event.target == modal) {
                document.querySelector(".notify-push-btn").removeAttribute("list-id") 
                document.querySelector(".notify-push-btn").removeAttribute("iter-id") 
                document.querySelector(".notify-email").style.borderColor = "#3c1bc0"
                modal.style.display = "none";
                resetPopUps();
            }
        }
    }

    closeNotifyModal() {

        document.querySelector(".modal-loader").style.display = "none";
        document.getElementById("notify-push-modal").style.display = "none";
        document.querySelector(".notify-email").style.borderColor = "#3c1bc0"
    }

    handleBlockBtnForFeed(e) {

        let feedItemContainer = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
        let list_id = feedItemContainer.getAttribute("list-id")
        let iter_id = feedItemContainer.getAttribute("iter-id")
        let dataForAPI = {"user_id": parseInt(localStorage.getItem("user-id")), "list_id": list_id}
        
        let url = configTestEnv["productServiceHost"] + "/product/feed/flag"
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
                alert(data["message"])
                this.updatePopUpOptionForReport(data, iter_id);
                resetPopUps();
            } else {
                alert(`Reporting feed FAILED, ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    
    }

    unsubscribeUserToNotification(feedItemContainer) {

        let list_id = feedItemContainer.getAttribute("list-id")
        let iter_id = feedItemContainer.getAttribute("iter-id")
    
        let dataForAPI = {"user_id": localStorage.getItem("user-id"), "list_id": list_id}
        
        let url = configTestEnv["userServiceHost"] + "/user/subscription"
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
                this.updatePopUpOptionForSubscription(data, iter_id);
                resetPopUps();
            } else {
                alert(`User unsubscription FAILED, ERROR: ", ${data["message"]}`)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error)
        })    
    
    }

    subscribeUserToNotification(e) {

        let userEmail = document.querySelector(".notify-email").value
        let list_id = e.currentTarget.getAttribute("list-id")
        let iter_id = e.currentTarget.getAttribute("iter-id")
        let is_checked = document.querySelector("#checkbox-input").checked
    
        if(is_checked && userEmail != "") {
    
            document.querySelector(".modal-loader").style.display = "block";
            let dataForAPI = {"user_id": localStorage.getItem("user-id"), "list_id": list_id}
            if(is_checked) {
                dataForAPI["email_id"] = userEmail
            } 
            let url = configTestEnv["userServiceHost"] + "/user/subscription"
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
                    this.closeNotifyModal();
                    this.updatePopUpOptionForSubscription(data, iter_id);
                    resetPopUps();
                } else {
                    alert(`User Subscription FAILED, ERROR: ", ${data["message"]}`)
                }
            })
            .catch((error) => {
                console.log(error)
                alert(error)
            })    
        }
    
    }

    updatePopUpOptionForSubscription(responseData, iter_id) {
        let feedItemContainer = document.getElementsByClassName("dynamic-feeds-outer-container")[iter_id]
        let subscription_status = ""
        if(responseData["subscription_status"] == "ACTIVE") {
            subscription_status = "Unsubscribe to creator"
        } else {
            subscription_status = "Subscribe to creator"
        }
        feedItemContainer.children[1].children[0].children[0].children[0].children[0].innerText = subscription_status
    }
    
    updatePopUpOptionForReport(responseData, iter_id) {
        let feedItemContainer = document.getElementsByClassName("dynamic-feeds-outer-container")[iter_id]
        let feed_flagged_status = ""
        if(responseData["flagged_status"] == "TRUE") {
            feed_flagged_status = "Unreport"
        } else {
            feed_flagged_status = "Report"
        }
        feedItemContainer.children[1].children[0].children[0].children[0].children[1].innerText = feed_flagged_status
    }
    
    updatePopUpOptionsAfterFlag(responseData, cmtBlockInContext) {
        let cmt_flagged_status = ""
        if(responseData["flagged_status"] == "TRUE") {
            cmt_flagged_status = "Unflag"
        } else {
            cmt_flagged_status = "Flag"
        }
        cmtBlockInContext.children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].innerText = cmt_flagged_status
    }

    generateToken(userId) {
        const header = JSON.stringify(
        {
            "alg": "HS256",
            "typ": "JWT"
        });
    
        const payload = JSON.stringify(
        {
            "sub": userId
        });
    
        const headerBase64 = Buffer.from(header).toString('base64').replace(/=/g, '');
        const payloadBase64 = Buffer.from(payload).toString('base64').replace(/=/g, '');
        const signature = crypto.HmacSHA256(headerBase64 + '.' + payloadBase64, TOKEN_SECRET);
        return headerBase64 + '.' + payloadBase64 + '.' + signature;
    }
    
    
    handleCheckBox(e) {
        let checkbox = e.currentTarget.checked
    
        if(checkbox) {
            document.getElementsByClassName("notify-email")[0].style.display = "block"
        } else {
            document.getElementsByClassName("notify-email")[0].style.display = "none"
        }
    }
    
    handleEmailInput(e) {
        if(e.currentTarget.value === "") {
            e.currentTarget.style.border="2px solid #ff0037"
        } else {
            e.currentTarget.style.border="2px solid #3c1bc0"
        }
    }
    
    
}

window.onload = initialLoadForFeedPage


var pageQuery = 1;
var allFetched = false;

function resetPopUps() {
    document.querySelectorAll(".task-bucket-sidenav").forEach((item) => {
        item.style.display = "none";
    })
}

var homeController = new HomeController();

function initialLoadForFeedPage() {

    // infinite scrolling loading 10 items at a time, each time user reaches the end of page
    window.addEventListener('scroll', () => {

        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 10 && !allFetched) {
            pageQuery += 1
            homeController.loadAllPublicFeeds(page=pageQuery, size=10)
        }

    })
}