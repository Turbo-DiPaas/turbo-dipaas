import express from 'express'
import { randomUUID } from 'crypto';
import WorkflowRunner from "../../../app/WorkflowRunner";
import {workflowFromJson} from "../../../app/utils/workflow";
import Workflow from "../../../app/Workflow";
import { ExampleWorkflows } from '../../examples/workflows';
import * as fs from "fs";

const workflowsRouter = express.Router();
const workflows: Map<string, WorkflowRunner> = new Map();

/**
 * @openapi
 * /runner/workflows/examples:
 *  get:
 *    description: Returns list of saved workflows
 *    responses:
 *      200:
 *        description: Successfully returned list of saved workflows
 *        content:
 *          application/json:
 *              schema:
 *                  id: 
 *                    type: string
 */
workflowsRouter.get("/examples", (request, response) => {
    response.send(
        ExampleWorkflows.map(worklfow => {
            return {
                id: worklfow.id,
                name: worklfow.name,
                description: worklfow.description
            }
        })
    )
})

/**
 * @openapi
 * /runner/workflows/examples/{id}:
 *  get:
 *    description: Returns selected example workflow
 *    responses:
 *      200:
 *        description: Successfully returned selected example workflow
 *        content:
 *          application/json:
 *              schema:
 *                  id: 
 *                    type: string
 */
 workflowsRouter.get("/examples/:id", (request, response) => {
    response.send(ExampleWorkflows.find(workflow => {
        return workflow.id == request.params.id
    }))
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
    const workflowRunner = workflows.get(request.params.id)
    workflowRunner?.start()

    response.send()
})

/**
 * @openapi
 * /runner/workflows/{id}/stop:
 *  post:
 *    description: Stop workflow by id
 *    parameters:
 *      - in: path
 *        name: id
 *        requrired: true
 *        schema:
 *          type: string
 *        description: The workflow ID
 *    responses:
 *      200:
 *        description: Successfully stopped specified workflow
 */
workflowsRouter.post("/:id/stop", (request, response) => {
    const workflow = workflows.get(request.params.id)
    workflow?.stop()

    response.send()
})

/**
 * @openapi
 * /runner/workflows/{id}/logs:
 *  get:
 *    description: Get logs for workflow
 *    parameters:
 *      - in: path
 *        name: id
 *        requrired: true
 *        schema:
 *          type: string
 *        description: The workflow ID
 *    responses:
 *      200:
 *        description: Successfully stopped specified workflow
 *        content:
 *          text/plain:
 *              schema:
 *                  id:
 *                    type: string
 */
workflowsRouter.get("/:id/logs", (request, response) => {
    const workflow = workflows.get(request.params.id)
    const resp = fs.readFileSync('log.txt')

    response.send(resp.toString())
})


export default workflowsRouter;