import express from 'express'
import { ActivityDetailsStruct } from 'turbo-dipaas-common/dist/types/api/design/ActivityStruct'
import { ActivityCategoryEnum, ActivityEnum, InputFieldTypeEnum, SelectFieldTypeEnum, TabEnum } from '../../../../../common/src/enums/DesignStructEnum';

const activitiesRouter = express.Router();
const activities: ActivityDetailsStruct[] = [
    {
        'id': 'c9b3bc42-332a-11ed-a261-0242ac120002',
        'name': 'Send transaction',
        'description': 'send transaction',
        'updated': '2022-09-01T00:00:00Z',
        'category': ActivityCategoryEnum.GENERAL,
        'type': ActivityEnum.SEND_TRANSACTION,
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
                            'type': InputFieldTypeEnum.FREE_INPUT
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