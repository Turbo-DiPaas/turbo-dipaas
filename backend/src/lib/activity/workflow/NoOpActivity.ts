import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import WorkflowActivity from './WorkflowActivity'

export default class NoOpActivity extends WorkflowActivity {

   constructor(id: string, name: string, resourceIds: string[] = []) {
      super(id, name, resourceIds)
   }


   invoke(): Promise<ActivityResult> {
      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
