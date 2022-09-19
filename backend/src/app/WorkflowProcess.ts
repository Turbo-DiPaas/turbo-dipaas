import WorkflowContext from "./WorkflowContext";
import ActivityGraph from "../lib/activity/utils/ActivityGraph";
import {ActivityResult} from "turbo-dipaas-common/src/types/activity/ActivityResult";
import {ActivityTransition} from "../types/ActivityTransition";
import {WorkflowProcessState} from "turbo-dipaas-common/src/enums/WorkflowProcessState";
import ActivityBase from "../lib/activity/ActivityBase";

export default class WorkflowProcess {
   readonly context: WorkflowContext
   readonly activityGraph: ActivityGraph
   readonly currentActivities: Map<string, ActivityBase> = new Map()
   protected currentState: WorkflowProcessState

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
         })
   }

   async processActivityTransition(activityTransition?: ActivityTransition): Promise<void> {
      if (activityTransition?.transition.canTransact(this.context)
         && !this.context.getActivityResult(activityTransition?.activity.id)) {
         const activity = activityTransition!.activity
         this.currentActivities.set(activity.id, activity)

         activity.invoke(this.context)
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
               this.currentActivities.delete(activity.id)
               const activityTransitions = this.activityGraph.getChildren(activity.id)

               if (this.currentState !== WorkflowProcessState.Stopping
                  && this.currentState !== WorkflowProcessState.Stopped) {

                  activityTransitions.map((v) => {
                     this.currentActivities.set(v.activity.id, v.activity)
                     this.processActivityTransition(v)
                  })
               }

               if(this.currentActivities.size === 0 && activityTransitions.length === 0) {
                  this.currentState = WorkflowProcessState.Finished
               }
            })
      }
   }

   stop(): void {
      this.currentState = WorkflowProcessState.Stopping

      this.currentActivities.clear()

      this.currentState = WorkflowProcessState.Stopped
   }

   getState(): WorkflowProcessState {
      return this.currentState
   }
}
