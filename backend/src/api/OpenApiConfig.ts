import swaggerJsdoc from 'swagger-jsdoc';

/** Shared OpenAPI definitions
 * @openapi
 * components:
 *   schemas:
 *     Object:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '707949b6-329f-11ed-a261-0242ac120002'
 *         name:
 *           type: string
 *           example: 'Polygon EVM connection'
 *         description:
 *           type: string
 *           example: '(IPFS connection)'
 *         updated:
 *           type: string
 *           format: date-time
 *     AbstractField:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: 'Input field 1'
 *         type:
 *           type: string
 *     InputField:
 *       allOf:
 *         - $ref: '#/components/schemas/AbstractField'
 *         - type: object
 *         - properties:
 *             type:
 *               type: string
 *               enum:
 *                 - string
 *                 - number
 *     SelectField:
 *       allOf:
 *         - $ref: '#/components/schemas/AbstractField'
 *         - type: object
 *         - properties:
 *             type:
 *               type: string
 *               enum:
 *                 - dropdown
 *                 - radiobutton
 *             options:
 *               type: array
 *               items:
 *                 type: string
 *     Tab:
 *       type: object
 *       properties:
 *         type: 
 *           type: string
 *           example: 'general'
 *         name:
 *           type: string
 *           example: 'General'
 *         description:
 *           type: string
 *           example: 'General tab'
 *         fields:
 *           type: array
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/InputField'
 *               - $ref: '#/components/schemas/SelectField'
 *     Structure:
 *       type: object
 *       properties:
 *         tabs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tab'
 */

// Open API configuration
const options = {
   failOnErrors: true,
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Trubo DiIpaaS",
         version: "0.1.0"
      }
   },
   apis: ["**/routes/designer/*.ts", '**/OpenApiConfig.ts', "**/routes/runner/*.ts", "**/api/design/*.ts"]
}
const swaggerConfiguration = swaggerJsdoc(options);

export default swaggerConfiguration;