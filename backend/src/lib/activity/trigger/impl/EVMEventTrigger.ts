import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowTriggerBase from '../WorkflowTriggerBase'
import WorkflowContext from "../../../../app/WorkflowContext";

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

   invoke(context: WorkflowContext): Promise<ActivityResult> {
      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
