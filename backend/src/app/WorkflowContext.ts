import { ActivityResult } from "turbo-dipaas-common/src/types/activity/ActivityResult";

export default class WorkflowContext {
   protected activityResultContext: Map<string, ActivityResult> = new Map()

   addActivityResult(activityId: string, result: ActivityResult): void {
      this.activityResultContext.set(activityId, result)
   }

   getActivityResult(activityId: string): ActivityResult | undefined {
      return this.activityResultContext.get(activityId)
   }
}
