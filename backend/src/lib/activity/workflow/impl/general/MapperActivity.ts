import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from '../../WorkflowActivity'

export default class MapperActivity extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      // base activity already evaluated all expressions
      return Promise.resolve({
         status: 200,
         returnData: params
      } as ActivityResult)
   }
}
