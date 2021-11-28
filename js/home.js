window.onload = initialLoadForFeedPage


var pageQuery = 1;
var allFetched = false;

function initialLoadForFeedPage() {

    document.querySelectorAll(".menu-dropdown-container")[0].addEventListener('click', handleNotificationDropdownPanel)
    document.querySelectorAll(".menu-dropdown-container")[1].addEventListener('click', handleMenuDropdownPanel)
    // rendering menu panel dropdown
    document.querySelectorAll(".dropdown-btn-container")[0].addEventListener('click', handleMyProfileClickAction)
    document.querySelectorAll(".dropdown-btn-container")[1].addEventListener('click', handleShowProgress)
    document.querySelectorAll(".dropdown-btn-container")[2].addEventListener('click', handlelogoutUserClick)

    fetchUserData();
    fetchUnreadCountForNotifications(customPageName="Taskly | Home");
    loadAllPublicFeeds();

    // load all btns eventlisteners
    document.getElementsByClassName("add-item-public-btn")[0].addEventListener('click', insertUserPublicFeed);

    // infinite scrolling loading 10 items at a time, each time user reaches the end of page
    window.addEventListener('scroll', () => {

        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 10 && !allFetched) {
            console.log("===== loading more feeds ....")
            pageQuery += 1
            loadAllPublicFeeds(page=pageQuery, size=10)
        }

    })
}

function loadAllPublicFeeds(page=1, size=10) {
    url = configTestEnv["productServiceHost"] + "/product/fetch-feeds?"
    url += `user_id=${localStorage.getItem("user-id") != null ? localStorage.getItem("user-id") : "null"}`
    url += `&page=${page}&size=${size}`

    document.getElementsByClassName("modal-loader")[0].style.display = 'flex';

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
            document.getElementsByClassName("modal-loader")[0].style.display = 'none';
            renderFeedsForUser(data, false);
        } else {
            console.log(`ERROR: ", ${data["message"]}`)
            document.getElementsByClassName("modal-loader")[0].style.display = 'none';
            allFetched = true;
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

function renderFeedsForUser(feedData, shouldInsertSingleFeed) {
    
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
                                <span class="dynamic-header-user-name-span">${feed.username}</span>
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
                                    <div class="sidenav-items-options-for-feed">Block</div>
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

            feedItemContainer.children[0].children[2].addEventListener('click', handlePopUpForFeedItems)
            // handle btns for feed popups
            feedItemContainer.children[1].children[0].children[0].children[0].children[0].addEventListener('click', handleBlockBtnForFeed)            

        }
    
        let LikeRefs = document.getElementsByClassName("dynamic-feeds-footer-like")
        let CmtRefs = document.getElementsByClassName("dynamic-feeds-footer-comment")

        for(let like of LikeRefs) {
            like.addEventListener('click', handleClickOnLikeBtn)
        }
        for(let cmts of CmtRefs) {
            cmts.addEventListener('click', handleClickOnCmtBtn)
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
                                <span class="dynamic-header-user-name-span">${feedData.username}</span>
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
                                    <div class="sidenav-items-options-for-feed">Block</div>
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
            like.addEventListener('click', handleClickOnLikeBtn)
        }
        for(let cmts of CmtRefs) {
            cmts.addEventListener('click', handleClickOnCmtBtn)
        }

        feedItemContainer.children[0].children[2].addEventListener('click', handlePopUpForFeedItems)
        feedItemContainer.children[1].children[0].children[0].children[0].children[0].addEventListener('click', handleBlockBtnForFeed)

        let iter = 0
        document.querySelectorAll(".dynamic-feeds-outer-container").forEach((item) => {
            item.setAttribute("iter-id", iter);
            iter += 1;
        })

    }

}

function handleClickOnLikeBtn(e) {
    e.currentTarget.children[0].classList.toggle("clicked-pic");
    e.currentTarget.children[1].classList.toggle("clicked-like-text");

    let dataForAPI = {
        "user_id": parseInt(localStorage.getItem("user-id")), 
        "list_id": parseInt(e.currentTarget.parentElement.parentElement.getAttribute("list-id")),
        "update_status_event": "like_event"
    }
    let iterId = e.currentTarget.parentElement.parentElement.getAttribute("iter-id")
    url = configTestEnv["productServiceHost"] + "/product/update-feedtask-status"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            updateUserEventsForList(iterId)
        } else {
            alert(`ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })    
    
}

function handleClickOnCmtBtn(e) {

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
        userInputCmt.addEventListener('keyup', handleUserEnteredComment)

        // API call for rendering comments
        url = configTestEnv["productServiceHost"] + "/product/fetch-all-comments?"
        url += `list_id=${e.currentTarget.parentElement.parentElement.getAttribute("list-id")}`
        
        fetch(url, {
            method: 'GET',
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
                                                    <div class="sidenav-items-options-for-comments">Flag</div>
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

                    renderedCmntBlock.children[1].children[0].children[0].children[0].children[1].addEventListener('click', handlePopUpForComments)
                    renderedCmntBlock.children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].addEventListener('click', FlagCommentByUser)

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

function updateUserEventsForList(iterId){
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

function insertUserPublicFeed(e) {

    if (e.currentTarget.parentElement.children[0].value != "") {
        url = configTestEnv["productServiceHost"] + "/product/upsert-task"
        let dataForAPI = {"user_id": localStorage.getItem("user-id"), 
                        "item": e.currentTarget.parentElement.children[0].value,
                        "update_flag": 0, 
                        "privacy_status": "public"}
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI),
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                // reset input after creating a new feed 
                document.getElementsByClassName("user-added-input")[0].value = ""
                dataForFeedInsertion = {"list_id": data["id"], "username": loggedInUsername, 
                    "description": dataForAPI["item"], "created_at": Date()}
                renderFeedsForUser(dataForFeedInsertion, true)
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
            formInnerContainer = document.getElementById("form-inner-container")
            divErrorItem = document.createElement("p")
            divErrorItem.classList.add("empty-error-value")
            paragraphMenuItemValue = document.createTextNode("Empty input found, please enter something")
            divErrorItem.appendChild(paragraphMenuItemValue)
            formInnerContainer.appendChild(divErrorItem)
            setTimeout(clearEmptyErrorValue, 1000);
        }
    }

}

function handleUserEnteredComment(e) {

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
        url = configTestEnv["productServiceHost"] + "/product/upsert-comments"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(dataForAPI), 
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "success") {
                updateAddCommentsForUser(iterId, data, dataForAPI)
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

function updateAddCommentsForUser(iterId, data, dataForAPI) {
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
    renderedCmntBlock.children[1].children[0].children[0].children[0].children[1].addEventListener('click', handlePopUpForComments)
    console.log(renderedCmntBlock.children[1].children[0].children[0].children[0].children[1])
    let currentSelectedCmtBlock = document.getElementsByClassName("footer-for-feed-comments")

    for (let cmt of currentSelectedCmtBlock) {
        if (cmt.parentElement.getAttribute("list-id") == dataForAPI.list_id) {
            cmt.appendChild(renderedCmntBlock)
            break;
        }
    }

}

function handlePopUpForFeedItems(e) {
    if(e.currentTarget.parentElement.parentElement.children[1].style.display == 'block') {
        e.currentTarget.parentElement.parentElement.children[1].style.display = 'none'
    } else {
        e.currentTarget.parentElement.parentElement.children[1].style.display = 'block'
    }
    
    closeOtherPopupOptionsMenusForFeed(e.currentTarget.parentElement.parentElement.getAttribute("list-id"));
}

function closeOtherPopupOptionsMenusForFeed(selected_id) {
    document.querySelectorAll(".dynamic-feeds-outer-container").forEach((item) => {
        if(item.getAttribute("list-id") != selected_id) {
            item.children[1].style.display = 'none';
        }
    })
}

function handlePopUpForComments(e) {
    if(e.currentTarget.parentElement.parentElement.children[1].style.display == 'block') {
        e.currentTarget.parentElement.parentElement.children[1].style.display = 'none'
    } else {
        e.currentTarget.parentElement.parentElement.children[1].style.display = 'block'
    }
}

function handleBlockBtnForFeed(e) {
    console.log(e.currentTarget)
}

function FlagCommentByUser(e) {
    
    let dataForAPI = {
        "user_id": localStorage.getItem("user-id"), 
        "list_id": e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("list-id"),
        "update_flag": 1,
        "comment_text": e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].innerText,
        "is_flagged": 1,
        "comment_id": e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("comment-id")
    }

    e.currentTarget.style.display = 'none';

    url = configTestEnv["productServiceHost"] + "/product/upsert-comments"
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForAPI), 
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == "success") {
            alert("Comment is successfully flagged by the user !")
        } else {
            console.log(`ERROR: ", ${data["message"]}`)
        }
    })
    .catch((error) => {
        console.log(error)
        alert(error)
    })    
}