import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import WorkflowTriggerBase from '../WorkflowTriggerBase'

export default abstract class EVMEventTrigger extends WorkflowTriggerBase {
   constructor(id: string, name: string, resourceIds: string[] = []) {
      super(id, name, resourceIds)
   }

   //TODO: implement
   start(): void {}
   stop(): void {}
   invoke(): Promise<ActivityResult> {return {} as ActivityResult}
}
