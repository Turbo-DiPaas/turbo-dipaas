import TransitionBase from "./TransitionBase";
import WorkflowContext from "../../app/WorkflowContext";

/**
 * This transition is effective only on error
 */
export default class ErrorTransition extends TransitionBase {
    canTransact(context: WorkflowContext): Promise<boolean> {
        const parentResult = context.getActivityResult(this.from)
        return Promise.resolve(!!(parentResult?.error))
    }
}
