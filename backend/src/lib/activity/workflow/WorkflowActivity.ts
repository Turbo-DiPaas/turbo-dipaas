import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import ActivityBase from '../ActivityBase'

export default abstract class WorkflowActivity extends ActivityBase {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }


   abstract invoke(): Promise<ActivityResult>
}
