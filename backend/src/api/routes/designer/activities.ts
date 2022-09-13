import express from 'express'

const activitiesRouter = express.Router();
const activities = [
    {
        'id': 'c9b3bc42-332a-11ed-a261-0242ac120002',
        'name': 'Send transaction',
        'description': 'send transaction',
        'updated': '2022-09-01T00:00:00Z',
        'category': 'Smart Contracts',
        'structure': {
            tabs: [
                {
                    'type': 'general',
                    'name': 'General',
                    'descriptioon': 'General tab',
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
            ]
        }
    },
    {
        'id': 'c9b3bf80-332a-11ed-a261-0242ac120002',
        'name': 'Call contract',
        'description': 'Call contract',
        'updated': '2022-09-01T00:00:00Z',
        'category': 'Smart Contracts',
        'structure': {
            tabs: [
                {
                    'type': 'general',
                    'name': 'General',
                    'descriptioon': 'General tab',
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
            ]
        }
    },
    {
        'id': 'c9b3c3cc-332a-11ed-a261-0242ac120002',
        'name': 'Get file',
        'description': 'Get file',
        'updated': '2022-09-01T00:00:00Z',
        'category': 'IPFS',
        'structure': {
            tabs: [
                {
                    'type': 'general',
                    'name': 'General',
                    'descriptioon': 'General tab',
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
*         - properties:
*             structure: 
*                 $ref: '#/components/schemas/Structure'
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
                return {
                    id: activity.id,
                    name: activity.name,
                    description: activity.description,
                    updated: activity.updated,
                    category: activity.category
                };
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