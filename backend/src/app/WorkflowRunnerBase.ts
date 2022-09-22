import Workflow from "./Workflow";
import ActivityGraph from "../lib/activity/utils/ActivityGraph";
import WorkflowTriggerBase from "../lib/activity/trigger/WorkflowTriggerBase";
import {ActivityResult} from "turbo-dipaas-common/src/types/activity/ActivityResult";
import WorkflowProcess from "./WorkflowProcess";
import {WorkflowProcessState} from "../../../common/src/enums/WorkflowProcessState";

export default abstract class WorkflowRunnerBase {
   readonly workflow: Workflow
   readonly activityGraph: ActivityGraph
   protected runningProcesses: WorkflowProcess[] = []
   protected currentState: WorkflowProcessState
   private starterActivity?: WorkflowTriggerBase

   constructor(workflow: Workflow) {
      this.workflow = workflow
      this.activityGraph = new ActivityGraph()

      this.prepareActivityGraph()

      this.currentState = WorkflowProcessState.Created
   }

   abstract prepareStart(): void

   start(): void {
      this.currentState = WorkflowProcessState.Starting
      this.prepareStart()
      const starterActivityId = this.activityGraph.getRootId()
      if(starterActivityId?.length === 0) {
         throw new Error("Unable to deduce starting activity. Will stop now.")
      }

      this.starterActivity = this.activityGraph.activityIdMapping.get(starterActivityId) as WorkflowTriggerBase
      this.starterActivity.start((activityResult: ActivityResult) => {
         this.currentState = WorkflowProcessState.Running
         const newProcess = new WorkflowProcess(this.activityGraph)
         this.runningProcesses.push(newProcess)

         newProcess.start(activityResult)
      })
   }

   stop(): void {
      this.currentState = WorkflowProcessState.Stopping
      this.runningProcesses.forEach((v) => {
         // Stop running processes
         v.stop()
      })
      // Stop trigger
      this.starterActivity?.stop()
      this.cleanup()
      this.currentState = WorkflowProcessState.Stopped
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
