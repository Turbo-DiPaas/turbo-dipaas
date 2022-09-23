import {ActivityResult} from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import ActivityBase from '../ActivityBase'
import {WorkflowProcessState} from 'turbo-dipaas-common/src/enums/WorkflowProcessState';
import WorkflowContext from "../../../app/WorkflowContext";
import {evaluateProps} from "../../../app/utils/context/contextResolver";
import {getLogger} from "../../../app/logger";
import {Logger} from "../../../types/Logger";

export default abstract class WorkflowActivity extends ActivityBase {
   logger: Logger

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)

      this.logger = getLogger()
   }

   /**
    * Actual activity running code - each activity should implement it
    */
   protected abstract run(params?: Map<string, any>): Promise<ActivityResult>

   /**
    * Process wrapper, adding common logic for every activity
    */
   async invoke(context: WorkflowContext): Promise<ActivityResult> {
      this.currentState = WorkflowProcessState.Running

      this.logger.debug(`Starting activity ${this.name}`)


      return this.run(await evaluateProps(this.params, context))
         .then(res => {
            const obj: any = {}
            for (let [k,v] of res.returnData) {
               obj[k] = v
            }

            // we just set proper state when finished, returning original resource
            this.currentState = res.error ? WorkflowProcessState.Failed : WorkflowProcessState.Finished
            this.logger.debug(`Activity ${this.name} finished with status ` + (this.currentState === WorkflowProcessState.Failed ? 'Failed' : 'Success')
               + '\n Return values:\n' + JSON.stringify(obj))

            return res
         }).catch(err => {
            // in case that activity won't catch an error
            this.currentState = WorkflowProcessState.Failed
            this.logger.error(`Activity ${this.name} raised unhandled exception: ${err}`)

            return {
               status: 500,
               returnData: new Map(),
               error: err
            }
         })
   }
}
