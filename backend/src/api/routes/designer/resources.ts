import express from 'express'
import { InputFieldTypeEnum, TabEnum } from '../../../../../common/src/enums/DesignStructEnum';
import { ResourceDetailsStruct } from 'turbo-dipaas-common/dist/types/api/design/ResourceStruct'

const resourcesRouter = express.Router();

const evmEbiResource: ResourceDetailsStruct = {
    'id': 'some-random-uuid',
    'name': 'EVMABIResource',
    'description': 'EVM ABI resource',
    'updated': '2022-09-01T00:00:00Z',
    'structure': {
        tabs: [
            {
                'type': TabEnum.GENERAL,
                'name': TabEnum.GENERAL,
                'description': 'General tab',
                'fields': [
                    {
                        'name': 'abi',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const privateKeyResource: ResourceDetailsStruct = {
    'id': 'some-random-uuid',
    'name': 'PreivateKeyResource',
    'description': 'private key',
    'updated': '2022-09-01T00:00:00Z',
    'structure': {
        tabs: [
            {
                'type': TabEnum.GENERAL,
                'name': TabEnum.GENERAL,
                'description': 'General tab',
                'fields': [
                    {
                        'name': 'privateKey',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const genericEVMConnectionResource: ResourceDetailsStruct = {
    'id': 'some-random-uuid',
    'name': 'GenericEVMConnectionResource',
    'description': 'EVM connection',
    'updated': '2022-09-01T00:00:00Z',
    'structure': {
        tabs: [
            {
                'type': TabEnum.GENERAL,
                'name': TabEnum.GENERAL,
                'description': 'General tab',
                'fields': [
                    {
                        'name': 'privateKey',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'url',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const httpConnectionResource: ResourceDetailsStruct = {
    'id': 'some-random-uuid',
    'name': 'HTTPConnection',
    'description': 'http connection',
    'updated': '2022-09-01T00:00:00Z',
    'structure': {
        tabs: [
            {
                'type': TabEnum.GENERAL,
                'name': TabEnum.GENERAL,
                'description': 'General tab',
                'fields': [
                    {
                        'name': 'url',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'protocol',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'host',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'port',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'path',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'query',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'method',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'timeout',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'headers',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};

const resources: ResourceDetailsStruct[] = [
    evmEbiResource,
    privateKeyResource,
    genericEVMConnectionResource,
    httpConnectionResource
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