import express from 'express'
import {
    InputFieldTypeEnum,
    ResourceCategoryEnum,
    ResourceEnum,
    TabEnum
} from 'turbo-dipaas-common/src/enums/DesignStructEnum';
import {ResourceDetailsStruct} from 'turbo-dipaas-common/src/types/api/design/ResourceStruct'

const resourcesRouter = express.Router();
const resources: ResourceDetailsStruct[] = [
    {
        'id': 'dcf86831-5fe3-4bda-a6f7-54b90e5235e0',
        'name': 'Generic EVM Connection',
        'description': 'Generic EVM connection resource',
        'updated': '2022-09-21T00:00:00Z',
        'icon': '/assets/resource-small.png',
        'type': ResourceEnum.EVM_CONNECTION,
        'category': ResourceCategoryEnum.EVM,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'displayName': 'Private key',
                            'name': 'privateKey',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'displayName': 'URL',
                            'name': 'url',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        }
                    ]
                }
            ]
        }
    },
    {
        'id': '2225babf-bc5f-485d-9c99-d06962eb5df5',
        'name': 'EVM ABI',
        'description': 'ABI resource used to communicate with EVM compatible Smart Contract',
        'updated': '2022-09-21T00:00:00Z',
        'icon': '/assets/resource-small.png',
        'type': ResourceEnum.EVM_ABI,
        'category': ResourceCategoryEnum.EVM,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'abi',
                            'displayName': 'ABI',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                    ]
                }
            ]
        }
    },
    {
        'id': 'ac666271-badd-4e46-87d9-a87c71e59091',
        'name': 'HTTP Connection',
        'description': 'HTTP Connection',
        'updated': '2022-09-01T00:00:00Z',
        'icon': '/assets/resource-small.png',
        'type': ResourceEnum.HTTP_CONNECTION,
        'category': ResourceCategoryEnum.HTTP,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'url',
                            'displayName': 'URL',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'method',
                            'displayName': 'Method',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'timeout',
                            'displayName': 'Timeout',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
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
                return resource
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