import Workflow from "./Workflow";
import WorkflowContext from "./WorkflowContext";
import ActivityGraph from "../lib/activity/utils/ActivityGraph";
import WorkflowTriggerBase from "../lib/activity/trigger/WorkflowTriggerBase";
import {ActivityResult} from "../../../common/src/types/activity/ActivityResult";
import WorkflowProcess from "./WorkflowProcess";

export default abstract class WorkflowRunnerBase {
   workflow: Workflow
   context: WorkflowContext
   activityGraph: ActivityGraph
   runningProcesses: WorkflowProcess[] = []

   constructor(workflow: Workflow) {
      this.workflow = workflow
      this.context = new WorkflowContext()
      this.activityGraph = new ActivityGraph()

      this.prepareActivityGraph()
   }

   abstract prepareStart(): void

   start(): void {
      this.prepareStart()
      const starterActivityId = this.activityGraph.getRootId()
      if(starterActivityId?.length === 0) {
         throw new Error("Unable to deduce starting activity. Will stop now.")
      }

      const starterActivity = this.activityGraph.activityIdMapping.get(starterActivityId) as WorkflowTriggerBase
      starterActivity.start((activityResult: ActivityResult) => {
         const newProcess = new WorkflowProcess(this.activityGraph)
         this.runningProcesses.push(newProcess)

         // TODO: run each process in new thread
         newProcess.start(activityResult)
      })
   }

   stop(): void {
      this.runningProcesses.forEach((v) => {
         v.stop()
      })
      this.cleanup()
   }

   abstract cleanup(): void

   protected prepareActivityGraph() {
      this.workflow.rootGroup.activity.map((v) =>
          this.activityGraph.addActivity(v)
      )
      this.workflow.rootGroup.transition.map((v) =>
          this.activityGraph.addTransition(v)
      )
   }
}
