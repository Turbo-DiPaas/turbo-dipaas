import swaggerJsdoc from 'swagger-jsdoc';

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
const swaggerConfiguration = swaggerJsdoc(options);

export default swaggerConfiguration;