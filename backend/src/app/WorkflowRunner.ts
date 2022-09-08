import WorkflowActivity from "../lib/activity/workflow/WorkflowActivity";
import Workflow from "./Workflow";
import WorkflowContext from "./WorkflowContext";

//TODO: implement

export default class WorkflowRunner {
   workflow: Workflow
   context: WorkflowContext

   run() {
   }

   deduceNextStep(): WorkflowActivity[] {
      return []
   }
}
