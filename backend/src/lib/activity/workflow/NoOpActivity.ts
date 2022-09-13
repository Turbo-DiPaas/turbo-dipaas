import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from './WorkflowActivity'

export default class NoOpActivity extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }


   invoke(): Promise<ActivityResult> {
      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
