const winston = require('winston');

const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL || 'info'
        }),
        new winston.transports.File({
            level: process.env.LOG_LEVEL || 'info',
            filename: 'server.log'
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;