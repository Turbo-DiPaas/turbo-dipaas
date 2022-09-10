import WorkflowActivity from "../lib/activity/workflow/WorkflowActivity";
import Workflow from "./Workflow";
import WorkflowContext from "./WorkflowContext";

//TODO: implement

export default abstract class WorkflowRunnerBase {
   workflow: Workflow
   context: WorkflowContext

   constructor(workflow: Workflow, context: WorkflowContext) {
      this.workflow = workflow
      this.context = context
   }

   abstract start(): void

   abstract stop(): void

   getNextActivities(): WorkflowActivity[] {
      return []
   }

   protected prepareActivityGraph() {
   }
}
