import express from 'express'
import swaggerUiExpress from 'swagger-ui-express';
import swaggerConfiguration from './SwaggerConfig'

const app = express();

// Open API configuration
const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Trubo DiIpaaS",
         version: "0.1.0"
      }
   },
   apis: []
}

const run = ({port = 4000}) => {
   //TODO: add routes definition here
   app.use(
      "/docs",
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(swaggerConfiguration)
   )

   app.listen(port);
}

export default run
