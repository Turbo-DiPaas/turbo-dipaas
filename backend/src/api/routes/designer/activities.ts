import express from 'express'
import {ActivityDetailsStruct} from 'turbo-dipaas-common/src/types/api/design/ActivityStruct'
import {
    ActivityCategoryEnum,
    ActivityEnum,
    InputFieldTypeEnum,
    ResourceEnum,
    TabEnum,
    TriggerActivityEnum
} from '../../../../../common/src/enums/DesignStructEnum';

const activitiesRouter = express.Router();
const activities: ActivityDetailsStruct[] = [
    {
        'id': 'c9b3bc42-332a-11ed-a261-0242ac120002',
        'name': 'Invoke EVM Smart Contract',
        'description': 'Invoke EVM Smart Contract, either call or send transaction',
        'updated': '2022-09-21T00:00:00Z',
        'category': ActivityCategoryEnum.EVM,
        'type': ActivityEnum.INVOKE_EVM,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'selectedFunction',
                            'displayName': 'Function name',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'transactionParams',
                            'displayName': 'Transaction params',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'transactionRecipient',
                            'displayName': 'Recipient address',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'abi',
                            'displayName': 'ABI resource',
                            'type': InputFieldTypeEnum.RESOURCE_REF,
                            'resourceType': ResourceEnum.EVM_ABI
                        },
                        {
                            'name': 'EVMConnection',
                            'displayName': 'EVM Connection',
                            'type': InputFieldTypeEnum.RESOURCE_REF,
                            'resourceType': ResourceEnum.EVM_CONNECTION
                        },
                    ]
                }
            ]
        }
    },
    {
        'id': 'f8082550-94fe-44f0-9865-ec04046b0877',
        'name': 'HTTP Request Reply',
        'description': 'Call any HTTP endpoint for data',
        'updated': '2022-09-21T00:00:00Z',
        'category': ActivityCategoryEnum.EVM,
        'type': ActivityEnum.INVOKE_EVM,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'HTTPConnection',
                            'displayName': 'HTTP Connection',
                            'type': InputFieldTypeEnum.RESOURCE_REF,
                            'resourceType': ResourceEnum.HTTP_CONNECTION
                        },
                    ]
                }
            ]
        }
    },
    {
        'id': '048d2e29-1a34-4cc5-9f33-4fc89ed6b2de',
        'name': 'Mapper',
        'description': 'Activity that evaluates whatever you pass to it',
        'updated': '2022-09-21T00:00:00Z',
        'category': ActivityCategoryEnum.GENERAL,
        'type': ActivityEnum.MAPPER,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'HTTPConnection',
                            'displayName': 'HTTP Connection',
                            'type': InputFieldTypeEnum.FREE_INPUT_LIST,
                        },
                    ]
                }
            ]
        }
    },
    {
        'id': 'f3544ff8-dbd9-44d7-8a20-bff218faee41',
        'name': 'NoOp',
        'description': 'No operation, used only to move to next ectivity',
        'updated': '2022-09-21T00:00:00Z',
        'category': ActivityCategoryEnum.GENERAL,
        'type': ActivityEnum.ON_OP,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': []
                }
            ]
        }
    },
    {
        'id': 'fcf3fc60-3353-11ed-a261-0242ac120002',
        'name': 'Log',
        'description': 'logs message to the stdout',
        'updated': '2022-09-01T00:00:00Z',
        'category': ActivityCategoryEnum.GENERAL,
        'type': ActivityEnum.LOG_ACTIVITY,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'message',
                            'displayName': 'Message',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        }
                    ]
                }
            ]
        }
    },
    {
        'id': 'fcf3fc60-3353-11ed-a261-0242ac120003',
        'name': 'Scheduler',
        'description': 'Schedule trigger',
        'updated': '2022-09-01T00:00:00Z',
        'category': ActivityCategoryEnum.GENERAL,
        'type': TriggerActivityEnum.SCHEDULER,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'runOnce',
                            'displayName': 'Run immediately',
                            'type': InputFieldTypeEnum.BOOLEAN
                        },
                        {
                            'name': 'cronExpression',
                            'displayName': 'Cron expression',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        }
                    ]
                }
            ]
        }
    },
    {
        'id': 'e64b1ac3-f523-429a-be35-e47af7fd7afe',
        'name': 'EVMEventTrigger',
        'description': 'runs every time that specific EVM event is generated',
        'updated': '2022-09-21T00:00:00Z',
        'category': ActivityCategoryEnum.GENERAL,
        'type': TriggerActivityEnum.EVM,
        'structure': {
            tabs: [
                {
                    'type': TabEnum.GENERAL,
                    'name': TabEnum.GENERAL,
                    'description': 'General tab',
                    'fields': [
                        {
                            'name': 'eventName',
                            'displayName': 'Event Name',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'eventAddress',
                            'displayName': 'Event address',
                            'type': InputFieldTypeEnum.FREE_INPUT
                        },
                        {
                            'name': 'abi',
                            'displayName': 'ABI resource',
                            'type': InputFieldTypeEnum.RESOURCE_REF,
                            'resourceType': ResourceEnum.EVM_ABI
                        },
                        {
                            'name': 'EVMConnection',
                            'displayName': 'EVM Connection',
                            'type': InputFieldTypeEnum.RESOURCE_REF,
                            'resourceType': ResourceEnum.EVM_CONNECTION
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
*     Activity:
*       allOf:
*         - $ref: '#/components/schemas/Object'
*         - type: object
*         - properties: 
*             category: 
*               type: string
*               example: 'Smart Contracts'
*             type:
*               type: string
*               example: LogActivity
*             structure: 
*               $ref: '#/components/schemas/Structure'
*     ActivitiesResponse:
*       type: object
*       properties:
*           updated:
*             type: string
*             format: date-time
*           activities:
*             type: array
*             items:
*               $ref: '#/components/schemas/Activity'
*     ActivityResponse:
*       allOf:
*         - properties:
*             updated:
*               type: string
*               format: date-time
*         - $ref: '#/components/schemas/Activity'
*         - type: object
*           
*/

/**
 * @openapi
 * /designer/activities:
 *  get:
 *    description: Returns the list of all posible activities
 *    responses:
 *      200:
 *        description: Successfully returned list of all possible activities
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ActivitiesResponse'
 */
activitiesRouter.get('/', (request, response) => {
    response.send({
        'updated': '2022-09-01T00:00:00Z',
        'activities': 
            activities.map(activity => {
                return activity
            })
    })
});

/**
 * @openapi
 * /designer/activities/{id}:
 *  get:
 *    description: Returns the details of selected activity
 *    parameters:
 *      - in: path
 *        name: id
 *        requrired: true
 *        schema:
 *          type: string
 *        description: The activity ID
 *    responses:
 *      200:
 *        description: Successfully returned selected activities
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ActivityResponse'
 */
activitiesRouter.get('/:id', (request, response) => {
    response.send({
        'updated': '2022-09-01T00:00:00Z',
        ...activities.find(activity => {
            return activity.id == request.params.id;
        })
    })
});

export default activitiesRouter;