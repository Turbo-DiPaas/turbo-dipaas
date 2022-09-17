import express from 'express'
import { InputFieldTypeEnum, SelectFieldTypeEnum, TabEnum } from '../../../../../common/src/enums/DesignStructEnum';
import {ResourceDetailsStruct} from 'turbo-dipaas-common/dist/types/api/design/ResourceStruct'

const resourcesRouter = express.Router();
const resources: ResourceDetailsStruct[] = [
    {
        'id': 'some-random-uuid',
        'name': 'Polygon EVM connection',
        'description': 'Polygon EVM connection',
        'updated': '2022-09-01T00:00:00Z',
        'icon': '/assets/resource-small.png',
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'Input field 1',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'Input field 2',
                            'type': SelectFieldTypeEnum.DROPDOWN,
                            'options': [
                                'option1',
                                'option2'
                            ]
                        }
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
*             structure:
*               $ref: '#/components/schemas/Structure'
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
                return {resource};
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