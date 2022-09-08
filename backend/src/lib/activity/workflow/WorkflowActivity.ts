import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import ActivityBase from '../ActivityBase'

export default abstract class WorkflowActivity extends ActivityBase {

   constructor(id: string, name: string, resourceIds: string[] = []) {
      super(id, name, resourceIds)
   }


   abstract invoke(): Promise<ActivityResult>
}
