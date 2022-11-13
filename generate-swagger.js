const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./controllers/Routes.js']

swaggerAutogen(outputFile, endpointsFiles)
