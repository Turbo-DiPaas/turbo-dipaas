import { ActivityResult } from "turbo-dipaas-common/dist/types/activity/ActivityResult";

//TODO: implement
export default class WorkflowContext {
   activityResultContext: Map<string, ActivityResult> = new Map()

   addActivityResult(result: ActivityResult): void {
   }
}
