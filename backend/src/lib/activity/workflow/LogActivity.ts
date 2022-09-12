import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import WorkflowActivity from './WorkflowActivity'

export default class LogActivity extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   invoke(): Promise<ActivityResult> {
      console.log(this.params.get('message'))

      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
