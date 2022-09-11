import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import WorkflowTriggerBase from '../WorkflowTriggerBase'

export default class Scheduler extends WorkflowTriggerBase {
   constructor(id: string, name: string, resourceIds: string[] = []) {
      super(id, name, resourceIds)
   }

   //TODO: change from immediate one time run to scheduler
   async start(notifyFunction: (res: ActivityResult) => void): Promise<void> {
      notifyFunction(await this.invoke())
   }

   async stop(): Promise<void> {}
   invoke(): Promise<ActivityResult> {
      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
