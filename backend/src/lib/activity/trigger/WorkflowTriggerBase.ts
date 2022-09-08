import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import ActivityBase from '../ActivityBase'

export default abstract class WorkflowTriggerBase extends ActivityBase {
   constructor(id: string, name: string, resourceIds: string[] = []) {
      super(id, name, resourceIds)
   }

   abstract start(): void
   abstract stop(): void
   abstract invoke(): Promise<ActivityResult>
}
