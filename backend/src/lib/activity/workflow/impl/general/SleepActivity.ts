import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from '../../WorkflowActivity'

export default class SleepActivity extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   protected async run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      const sleepPeriod = params.get('duration')
      if (sleepPeriod && sleepPeriod > 0) {
         await new Promise((resolve) => setTimeout(resolve, sleepPeriod))
      }

      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
