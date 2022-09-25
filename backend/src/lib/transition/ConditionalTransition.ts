import TransitionBase from "./TransitionBase";
import WorkflowContext from "../../app/WorkflowContext";
import {evaluateSingleProp} from "../../app/utils/context/contextResolver";

/**
 * This transition is effective always, as long as `from` activity status is not error - this breaks normal execution flow
 */
export default class ConditionalTransition extends TransitionBase {
    async canTransact(context: WorkflowContext): Promise<boolean> {
        const result = await evaluateSingleProp(this.condition, context)
        return result == true
    }
}
