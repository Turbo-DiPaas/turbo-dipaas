import ActivityBase from '../ActivityBase'
import {ActivityResult} from "turbo-dipaas-common/src/types/activity/ActivityResult";
import WorkflowContext from "../../../app/WorkflowContext";
import {WorkflowProcessState} from "../../../../../common/src/enums/WorkflowProcessState";
import {evaluateProps} from "../../../app/utils/context/contextResolver";

export default abstract class WorkflowTriggerBase extends ActivityBase {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   /**
    * Actual activity running code - each starter activity should implement it
    */
   protected abstract run(params?: Map<string, any>): Promise<ActivityResult>

   /**
    * Process wrapper, adding common logic for every activity
    */
   async invoke(): Promise<ActivityResult> {
      this.currentState = WorkflowProcessState.Running

      return this.run(await evaluateProps(this.params, new WorkflowContext()))
         .then(res => {
            // we just set proper state when finished, returning original resource
            if (res.error) {
               this.currentState = WorkflowProcessState.Failed
            }
            return res
         }).catch(err => {
            // in case that activity won't catch an error
            this.currentState = WorkflowProcessState.Failed
            this.stop()

            return {
               status: 500,
               returnData: new Map(),
               error: err
            }
         })
   }

   //TODO: think about using RxJS Observables
   abstract start(notifyFunction: (res: ActivityResult) => void): Promise<void>
   abstract stop(): Promise<void>
}
