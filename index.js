const express = require('express')
var morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const app = express()
var debug = require('debug')('app')
var helmet = require('helmet');
var cors = require('cors')
const config = require('config');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined'))
app.use(morgan('combined', { stream: accessLogStream }))
// app.use(helmet());
app.use(cors())

// check if directory exists
if (fs.existsSync("public")) {
    debug("Checking serving dir ...... App Directory exists!");
} else {
    debug("Public Directory not found.");
    throw new Error("[ERROR]: Entrypoint App Directory not found !")
}

app.use(express.static("public"))

if (config.server.port === undefined) {
    debug("SERVER_PORT env var not defined !, using default port 3000")
} else if (config.env === undefined) {
    debug("NODE_ENV env var not defined !")
    throw new Error("[ERROR]: NODE_ENV env var not defined !")
}

app.set('env', config.env)

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.listen(config.server.port, () => {
    debug(`Opioner app listening on port ${config.server.port}`)
    debug(`Serving opioner app in environment: ${config.env}`)
    debug("==========================================")
})