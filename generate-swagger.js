const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./controllers/Routes.js']

const doc = {
    info: {
      title: 'Opioner API',
      description: 'Base developer documentation for Opioner API\'s',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc)
