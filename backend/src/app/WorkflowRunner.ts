import WorkflowActivity from "../lib/activity/workflow/WorkflowActivity";
import Workflow from "./Workflow";
import WorkflowContext from "./WorkflowContext";
import WorkflowRunnerBase from "./WorkflowRunnerBase";

//TODO: implement

export default class WorkflowRunner extends WorkflowRunnerBase {
   constructor(workflow: Workflow, context: WorkflowContext) {
      super(workflow, context)
   }

   start() {
   }

   stop() {
   }

   getNextActivities(): WorkflowActivity[] {
      return []
   }
}
