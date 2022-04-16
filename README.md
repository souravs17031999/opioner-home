# Opioner-frontend
Complete codebase for Opioner frontend web app

![MAKEFILE CI](https://github.com/souravs17031999/opioner-home/actions/workflows/makefile.yml/badge.svg)
![Security CI](https://github.com/souravs17031999/opioner-home/actions/workflows/codeql-analysis.yml/badge.svg)
![Node.js CI](https://github.com/souravs17031999/opioner-home/actions/workflows/node.js.yml/badge.svg)
![SonarCloud analysis](https://github.com/souravs17031999/opioner-home/actions/workflows/sonarcloud.yml/badge.svg)


# Goal - MAKE YOUR OPINION COUNT AND SHARE WITH WORLD

http://opioner-home.vercel.app/

# Opioner-frontend-docker-app

# This project is meant to maintain the frontend code for the [Opioner - Make Your Opinion Count And Share With World](http://opioner-home.vercel.app/).  
[Older versions] The project is deployed using Github servers and all requests are served through Github API gateway.
[Latest versions] The Current versions are deployed using [vercel](https://vercel.com/) platform which is integrated with master branch.
Backend of [Opioner app](https://github.com/souravs17031999/opioner-backend)(private repo) is served through Heroku servers.

# Deliverables
This project contains two types of deliverables : 
- Vanilla JS webapp (no framework) [The last released version is 6.0.0]   
- Express powered dockerized webapp [Versions starting from 7.0.0]   
[Latest Docker image](https://hub.docker.com/repository/docker/souravkumardevadmin/opioner-home_opioner_home) 

### Github CI pipeline:
- Every push to master branch triggers github Makefile CI actions workflow which builds, test and deploy container images.
- Additional CI checks are introduced for Nodejs CI builds, SONAR code quality checks.
- [Cypress](https://www.cypress.io/) is integrated for GUI test automation.

# Running project locally:

- Vanilla JS [6.0.0](https://github.com/souravs17031999/opioner-home/releases/tag/6.0.0):   
  * Clone this repo      
    `git clone git@github.com:souravs17031999/opioner-home.git`        
  * Start the web server locally on any port (ex. 5500).  
  * your app should be visible on http://127.0.0.1:5500/opioner-home  

- Dockerized webapp [>=7.0.0](https://github.com/souravs17031999/opioner-home/releases/tag/7.0.1)   
  * run `make local`  
  * Your webapp should start on http://localhost:3000/index.html
  * Provide required configurations and env vars through your shell as defined in `docker-compose.yml`  


# DEMO (Preview of all features)

![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/index.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/index2.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/login.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/signup.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/home.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/footer.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/profile.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/notification.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/menus.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/status.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/subscriptions.PNG)
![This is an image](https://github.com/souravs17031999/opioner-home/blob/master/public/images/upload.PNG)  

### Easy configuration
* For local development and production, both configuration can be handled using js/config.js where hosts/URL for staging, local and production can be managed. Currently, config.js is random localhost ports which is expected by devs to inject/update the values when the opioner-backend services are up accordingly.

### Token based authentication
- All the REST API calls are made with authentication JWT based token mechanism of Bearer type which makes your user's data exchanges secure and robust.
- All environment variables are just default values, actual values are injected on the fly while deployment (not commited due to security reasons).


_I bet you will love the backend of the project, check it here [Opioner-backend](https://github.com/souravs17031999/opioner-backend)_

### GDPR compliance:
All the data processed for user is transparent and is explained on terms and privacy policy page of (Opioner-home website)[https://souravs17031999.github.io/opioner-home]

_whats next ? Deployment using k8s via dockerized image (use npm package manager, better security, react components)_
