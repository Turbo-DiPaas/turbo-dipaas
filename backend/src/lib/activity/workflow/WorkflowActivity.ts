import {ActivityResult} from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import ActivityBase from '../ActivityBase'
import {WorkflowProcessState} from 'turbo-dipaas-common/src/enums/WorkflowProcessState';
import WorkflowContext from "../../../app/WorkflowContext";
import {evaluateProps} from "../../../app/utils/context/contextResolver";

export default abstract class WorkflowActivity extends ActivityBase {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   /**
    * Actual activity running code - each activity should implement it
    */
   protected abstract run(): Promise<ActivityResult>

   /**
    * Process wrapper, adding common logic for every activity
    */
   invoke(context: WorkflowContext): Promise<ActivityResult> {
      this.currentState = WorkflowProcessState.Running

      this.params = evaluateProps(this.params, context)

      return this.run()
         .then(res => {
            // we just set proper state when finished, returning original resource
            this.currentState = res.error ? WorkflowProcessState.Failed : WorkflowProcessState.Finished
            return res
         }).catch(err => {
            // in case that activity won't catch an error
            this.currentState = WorkflowProcessState.Failed
            return {
               status: 500,
               returnData: new Map(),
               error: err
            }
         })
   }
}
