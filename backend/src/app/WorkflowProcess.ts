import WorkflowContext from "./WorkflowContext";
import ActivityGraph from "../lib/activity/utils/ActivityGraph";
import {ActivityResult} from "../../../common/src/types/activity/ActivityResult";
import {ActivityTransition} from "../types/ActivityTransition";
import {WorkflowProcessState} from "../../../common/src/enums/WorkflowProcessState";

export default class WorkflowProcess {
   context: WorkflowContext
   activityGraph: ActivityGraph
   currentState: WorkflowProcessState

   constructor(activityGraph: ActivityGraph) {
      this.activityGraph = activityGraph
      this.context = new WorkflowContext()
      this.currentState = WorkflowProcessState.Created
   }

   start(starterActivityResult: ActivityResult): void {
      this.currentState = WorkflowProcessState.Starting
      const starterActivityId = this.activityGraph.getRootId()

      this.context.addActivityResult(starterActivityId, starterActivityResult)
      this.currentState = WorkflowProcessState.Running
      this.activityGraph.getChildren(starterActivityId)
          .map((v) => {
             this.processActivityTransition(v)
                 .finally(() => {
                    this.currentState = WorkflowProcessState.Finished
                    console.log("ACTIVITY GRAPH FINISHED")
                 })
          })
   }

   async processActivityTransition(activityTransition?: ActivityTransition) {
      if (activityTransition?.transition.canTransact(this.context)
          && !this.context.getActivityResult(activityTransition?.activity.id)) {
         const activity = activityTransition!.activity
         activity.invoke()
             .then((v) => {
                this.context.addActivityResult(activity.id, v)
             })
             .catch((e) => {
                this.context.addActivityResult(activity.id,
                    {
                       status: 500,
                       error: e,
                       returnData: new Map()
                    })
             })
             .finally(() => {
                const activityTransitions = this.activityGraph.getChildren(activity.id)
                activityTransitions.map((v) => {
                   this.processActivityTransition(v)
                })
             })
      }
   }

   stop(): void {
      this.currentState = WorkflowProcessState.Stopping

      //the logic goes here

      this.currentState = WorkflowProcessState.Stopped
   }

   getState(): WorkflowProcessState {
      return this.currentState
   }
}
