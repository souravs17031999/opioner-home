const express = require('express')
var morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const app = express()
var debug = require('debug')('app')
var helmet = require('helmet');
const logger = require('./helpers/Logger')
var cors = require('cors')
const config = require('config');
const controllers = require('./controllers/Routes')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined'))
app.use(morgan('combined', { stream: accessLogStream }))
// app.use(helmet());
app.use(cors())
app.options('*', cors())

// check if directory exists
if (fs.existsSync("public")) {
    logger.debug("Checking serving dir ...... App Directory exists!");
} else {
    logger.debug("Public Directory not found.");
    throw new Error("[ERROR]: Entrypoint App Directory not found !")
}

app.use(express.static(path.join(__dirname, 'public')))

if (config.port === undefined) {
    logger.debug("PORT env var not defined !, using default port 3000")
} else if (config.env === undefined) {
    logger.debug("NODE_ENV env var not defined !")
    throw new Error("[ERROR]: NODE_ENV env var not defined !")
}

app.set('env', config.env)

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Apply ratelimiting based on IP
const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: 10000,
    message: 'You have exceeded the 10000 requests in 24 hrs limit!', 
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(rateLimiter)

app.use(bodyParser.json())

app.use(controllers)

// generate swagger 
require('./generate-swagger.js');

// serve swaggerUI on /doc
const swaggerFile = require('./swagger_output.json')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use((err, req, res, next) => {
    logger.error(err.stack)
    next(err)
})

app.listen(config.port, () => {
    logger.info(`Opioner app listening on port ${config.port}`)
    logger.info(`Serving opioner app in environment: ${config.env}`)
    logger.info("==========================================")
})