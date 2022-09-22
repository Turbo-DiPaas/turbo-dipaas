import express from 'express'
import WorkflowProcess from '../../../app/WorkflowProcess';
import ActivityGraph from '../../../lib/activity/utils/ActivityGraph';
import { Activity } from 'turbo-dipaas-common/src/types/api/workflow/Activity'
import { Transition } from 'turbo-dipaas-common/src/types/api/workflow/Transition';
// import { Workflow } from 'turbo-dipaas-common/src/types/api/workflow/Workflow';
import SuccessTransition from '../../../lib/transition/SuccessTransition';
import WorkflowTriggerBase from '../../../lib/activity/trigger/WorkflowTriggerBase';
import { ActivityList } from '../../../lib/activity/ActivityList';
import { randomUUID } from 'crypto';
import { ActivityEnum, TriggerActivityEnum } from '../../../../../common/src/enums/DesignStructEnum';
import WorkflowRunner from "../../../app/WorkflowRunner";
import {workflowFromJson} from "../../../app/utils/workflow";
import Workflow from "../../../app/Workflow";

const workflowsRouter = express.Router();
const workflows: Map<string, WorkflowRunner> = new Map();
// const exampleWorkflow: Workflow = {
//     id: 'c4cc6e3a-3650-11ed-a261-0242ac120002',
//     name: 'Example workflow',
//     description: 'An example workflow',
//     updated: '2022-09-01T00:00:00Z',
//     structure: {
//         activities: [
//             {
//                 "id": "act-1",
//                 "type": ActivityEnum.LOG_ACTIVITY,
//                 "name": "Test Log activity",
//                 "params": [
//                     {
//                         "name": "message",
//                         "value": "test log message"
//                     }
//                 ],
//                 "position": {
//                     x: 1,
//                     y: 1
//                 }
//             },
//             {
//                 "id": "act-2",
//                 "type": ActivityEnum.LOG_ACTIVITY,
//                 "name": "Test Log activity 2 ",
//                 "params": [
//                     {
//                         "name": "message",
//                         "value": "second test log message"
//                     }
//                 ],
//                 "position": {
//                     x: 2,
//                     y: 2
//                 }
//             },
//             {
//                 "id": "act-3",
//                 "type": ActivityEnum.LOG_ACTIVITY,
//                 "name": "Test Log activity 3 ",
//                 "params": [
//                     {
//                         "name": "message",
//                         "value": "third test log message"
//                     }
//                 ],
//                 "position": {
//                     x: 3,
//                     y: 3
//                 }
//             },
//             {
//                 "id": "trigger",
//                 "type": TriggerActivityEnum.SCHEDULER,
//                 "name": "Scheduler activity",
//                 "params": [
//                     {
//                         "name": "runOnce",
//                         "value": true
//                     }
//                 ],
//                 "position": {
//                     x: 4,
//                     y: 4
//                 }
//             }
//         ],
//         transitions: [
//             {
//                 "id": "trans-1",
//                 "from": "trigger",
//                 "to": "act-1"
//             },
//             {
//                 "id": "trans-2",
//                 "from": "act-1",
//                 "to": "act-2"
//             },
//             {
//                 "id": "trans-3",
//                 "from": "act-1",
//                 "to": "act-3"
//             }
//         ],
//         resources: []
//     }
// }

/**
 * @openapi
 * /runner/workflows:
 *  get:
 *    description: Returns an example workflow
 *    responses:
 *      200:
 *        description: Successfully returned an example workflow
 *        content:
 *          application/json:
 *              schema:
 *                  id: 
 *                    type: string
 */
workflowsRouter.get("/", (request, response) => {
    response.send({})
})

/**
 * @openapi
 * /runner/workflows:
 *  post:
 *    description: Create new workflow
 *    responses:
 *      200:
 *        description: Successfully created new workflow
 *        content:
 *          application/json:
 *              schema:
 *                  id: 
 *                    type: string
 */
workflowsRouter.post("/", (request, response) => {
    let activityGraph: ActivityGraph = new ActivityGraph()
    const workflow: Workflow = workflowFromJson(request.body)

    let workflowId = workflow.id?.length > 0 ? workflow.id : randomUUID()
    workflows.set(workflowId, new WorkflowRunner(workflow))
    
    response.send({
        id: workflowId
    });
})

/**
 * @openapi
 * /runner/workflows/{id}/start:
 *  post:
 *    description: Start workflow by id
 *    parameters:
 *      - in: path
 *        name: id
 *        requrired: true
 *        schema:
 *          type: string
 *        description: The workflow ID
 *    responses:
 *      200:
 *        description: Successfully started specified workflow
 */
workflowsRouter.post("/:id/start", (request, response) => {
    const workflow = workflows.get(request.params.id)
    workflow?.start()

    response.send()
})


export default workflowsRouter;