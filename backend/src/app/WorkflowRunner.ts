import Workflow from "./Workflow";
import WorkflowRunnerBase from "./WorkflowRunnerBase";

//TODO: implement

export default class WorkflowRunner extends WorkflowRunnerBase {
   constructor(workflow: Workflow) {
      super(workflow)
   }

   cleanup(): void {
   }

   prepareStart(): void {
   }
}
