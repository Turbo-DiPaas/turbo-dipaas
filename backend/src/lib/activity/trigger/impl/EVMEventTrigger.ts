import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowTriggerBase from '../WorkflowTriggerBase'

export default class EVMEventTrigger extends WorkflowTriggerBase {
   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   //TODO: implement
   start(): Promise<void> {
      return Promise.resolve()
   }
   stop(): Promise<void> {
      return Promise.resolve()
   }

   invoke(): Promise<ActivityResult> {
      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
