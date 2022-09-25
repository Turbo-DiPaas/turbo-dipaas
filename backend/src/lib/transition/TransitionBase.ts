import WorkflowContext from "../../app/WorkflowContext";

export default abstract class TransitionBase {
   from: string
   to?: string
   condition?: string

   constructor(from: string, to?: string, condition?: string) {
      this.from = from
      this.to = to
      this.condition = condition
   }

   abstract canTransact(context: WorkflowContext): Promise<boolean>
}
