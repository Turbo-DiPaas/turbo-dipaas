import ActivityBase from "../activity/ActivityBase"
import WorkflowActivity from "../activity/workflow/WorkflowActivity"

export default abstract class TransitionBase {
   from: ActivityBase
   to: WorkflowActivity[]

   constructor(from: ActivityBase, to: WorkflowActivity[] = []) {
      this.from = from
      this.to = to
   }

   abstract canTransact(condition: string): boolean
}
