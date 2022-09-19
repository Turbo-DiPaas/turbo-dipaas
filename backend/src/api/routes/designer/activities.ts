import express from 'express'
import { ActivityDetailsStruct } from 'turbo-dipaas-common/dist/types/api/design/ActivityStruct'
import { ActivityCategoryEnum, ActivityEnum, InputFieldTypeEnum, TabEnum, TriggerActivityEnum } from 'turbo-dipaas-common/src/enums/DesignStructEnum';

const activitiesRouter = express.Router();

const logActivity: ActivityDetailsStruct = 
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
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const noOpActivity: ActivityDetailsStruct = {
    'id': 'fcf3fc60-3353-11ed-a261-0242ac120002',
    'name': 'NoOp',
    'description': 'does nothing',
    'updated': '2022-09-01T00:00:00Z',
    'category': ActivityCategoryEnum.GENERAL,
    'type': ActivityEnum.NO_OP,
    'structure': {
        tabs: []
    }
};
const schedulerActivity: ActivityDetailsStruct = {
    'id': 'fcf3fc60-3353-11ed-a261-0242ac120003',
    'name': 'Scheduler',
    'description': 'schedule trigger',
    'updated': '2022-09-01T00:00:00Z',
    'category': ActivityCategoryEnum.SCHEDULER,
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
                        'type': InputFieldTypeEnum.BOOLEAN
                    },
                    {
                        'name': 'cronExpression',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const evmTriggerActivity: ActivityDetailsStruct = {
    'id': 'fcf3fc60-3353-11ed-a261-0242ac120003',
    'name': 'EVNEventTrigger',
    'description': 'EVM event trigger',
    'updated': '2022-09-01T00:00:00Z',
    'category': ActivityCategoryEnum.SCHEDULER,
    'type': TriggerActivityEnum.EVM_EVENT_TRIGGER,
    'structure': {
        tabs: [
            {
                'type': TabEnum.GENERAL,
                'name': TabEnum.GENERAL,
                'description': 'General tab',
                'fields': [
                    {
                        'name': 'eventName',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'eventAddress',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const invokeEVMActivity: ActivityDetailsStruct = 
{
    'id': 'fcf3fc60-3353-11ed-a261-0242ac120002',
    'name': 'InvokeEVM',
    'description': 'invokes EVM',
    'updated': '2022-09-01T00:00:00Z',
    'category': ActivityCategoryEnum.EVN,
    'type': ActivityEnum.LOG_ACTIVITY,
    'structure': {
        tabs: [
            {
                'type': TabEnum.GENERAL,
                'name': TabEnum.GENERAL,
                'description': 'General tab',
                'fields': [
                    {
                        'name': 'selectedFunction',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'transactionParams',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    },
                    {
                        'name': 'transactionRecipient',
                        'type': InputFieldTypeEnum.FREE_INPUT
                    }
                ]
            }
        ]
    }
};
const mapperActivity: ActivityDetailsStruct = {
    'id': 'fcf3fc60-3353-11ed-a261-0242ac120002',
    'name': 'Mapper',
    'description': 'Maps data',
    'updated': '2022-09-01T00:00:00Z',
    'category': ActivityCategoryEnum.GENERAL,
    'type': ActivityEnum.MAPPER,
    'structure': {
        tabs: []
    }
};

const activities: ActivityDetailsStruct[] = [
    logActivity,
    noOpActivity,
    schedulerActivity,
    evmTriggerActivity,
    invokeEVMActivity,
    mapperActivity
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