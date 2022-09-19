import { ActivityResult } from "turbo-dipaas-common/src/types/activity/ActivityResult";

export default class WorkflowContext {
   protected activityResultContext: Map<string, ActivityResult> = new Map()
   protected workflowContextObject: any = {}


   addActivityResult(activityId: string, result: ActivityResult): void {
      this.activityResultContext.set(activityId, result)
      this.workflowContextObject[activityId] = {}

      result.returnData.forEach((v, k) => {
         this.workflowContextObject[activityId][k] = v
      })
   }

   getActivityResult(activityId: string): ActivityResult | undefined {
      return this.activityResultContext.get(activityId)
   }

   getWorkflowContextObject(): any {
      return JSON.parse(JSON.stringify(this.workflowContextObject))
   }

   getActivityKeys(): string[] {
      return Array.from(this.activityResultContext.keys())
   }
}
