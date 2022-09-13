import express from 'express'

const resourcesRouter = express.Router();
const resources = [
    {
        'id': 'some-random-uuid',
        'name': 'Polygon EVM connection',
        'description': 'Polygon EVM connection',
        'updated': '2022-09-01T00:00:00Z',
        'icon': '/assets/resource-small.png',
        'structure': {
            'fields': [
                {
                    'name': 'Input field 1',
                    'type': 'string'
                },
                {
                    'name': 'Input field 2',
                    'type': 'dropdown',
                    'options': [
                        'option1',
                        'option2'
                    ]
                },
                {
                    'name': 'Input field 3',
                    'type': 'number'
                },
                {
                    'name': 'Input field 4',
                    'type': 'radio',
                    'options': [
                        'option1',
                        'option2'
                    ]
                }
            ]
        }
    },
    {
        'id': 'some-random-uuid2',
        'name': 'Files',
        'description': '(IPFS connection)',
        'updated': '2022-09-01T00:00:00Z',
        'icon': '/assets/resource-small.png',
        'structure': {
            'fields': [
                {
                    'name': 'Input field 1',
                    'type': 'string'
                },
                {
                    'name': 'Input field 2',
                    'type': 'dropdown',
                    'options': [
                        'option1',
                        'option2'
                    ]
                },
                {
                    'name': 'Input field 3',
                    'type': 'number'
                },
                {
                    'name': 'Input field 4',
                    'type': 'radio',
                    'options': [
                        'option1',
                        'option2'
                    ]
                }
            ]
        }
    }
]
/**
* @openapi
* components:
*   schemas:
*     Resource:
*       allOf:
*         - $ref: '#/components/schemas/Object'
*         - type: object
*         - properties: 
*             icon: 
*               type: string
*               example: '/assets/resource-small.png'
*     ResourcesResponse:
*       type: object
*       properties:
*           updated:
*             type: string
*             format: date-time
*           resources:
*             type: array
*             items:
*               $ref: '#/components/schemas/Resource'
*     ResourceResponse:
*       allOf:
*         - properties:
*             updated:
*               type: string
*               format: date-time
*         - $ref: '#/components/schemas/Resource'
*         - type: object
*         - properties:
*             structure: 
*                 $ref: '#/components/schemas/Structure'
*           
*/

/**
 * @openapi
 * /designer/resources:
 *  get:
 *    description: Returns the list of all posible resources
 *    responses:
 *      200:
 *        description: Successfully returned list of all possible resources
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ResourcesResponse'
 */
resourcesRouter.get('/', (request, response) => {
    response.send({
        'updated': '2022-09-01T00:00:00Z',
        'resources': 
            resources.map(resource => {
                return {
                    id: resource.id,
                    name: resource.name,
                    description: resource.description,
                    updated: resource.updated,
                    icon: resource.icon
                };
            })
    })
})

/**
 * @openapi
 * /designer/resources/{id}:
 *  get:
 *    description: Returns the details of selected resource
 *    parameters:
 *      - in: path
 *        name: id
 *        requrired: true
 *        schema:
 *          type: string
 *        description: The resource ID
 *    responses:
 *      200:
 *        description: Successfully returned selected resource
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ResourceResponse'
 */
resourcesRouter.get('/:id', (request, response) => {
    response.send({
        'updated': '2022-09-01T00:00:00Z',
        ...resources.find(resource => {
            return resource.id == request.params.id;
        })
    })
})

export default resourcesRouter;