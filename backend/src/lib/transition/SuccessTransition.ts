import TransitionBase from "./TransitionBase";
import WorkflowContext from "../../app/WorkflowContext";

/**
 * This transition is effective always, as long as `from` activity status is not error - this breaks normal execution flow
 */
export default class SuccessTransition extends TransitionBase {
    canTransact(context: WorkflowContext): boolean {
        const parentResult = context.getActivityResult(this.from)
        return !(parentResult?.error)
    }
}
