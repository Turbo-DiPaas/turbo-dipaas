import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'
import WorkflowTriggerBase from '../WorkflowTriggerBase'
import cron, {ScheduledTask} from 'node-cron'

export default class Scheduler extends WorkflowTriggerBase {
   currentTriggerDate!: Date
   cronTask?: ScheduledTask

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   async start(notifyFunction: (res: ActivityResult) => void): Promise<void> {
      const cronExpression = this.params.get('cronExpression')
      if (this.params.get('runOnce') === true) {
         this.currentTriggerDate = new Date
         notifyFunction(await this.invoke())
      } else if (cronExpression && cron.validate(cronExpression)) {
         this.cronTask = cron.schedule(cronExpression, async (now) => {
            this.currentTriggerDate = now
            notifyFunction(await this.invoke())
         })
      } else {
         notifyFunction({
            status: 500,
            returnData: new Map(),
            error: new Error(`Cron expression ${cronExpression} is not valid`)
         } as ActivityResult)
      }
   }

   async stop(): Promise<void> {
      if (this.cronTask) {
         this.cronTask.stop()
      }
   }

   invoke(): Promise<ActivityResult> {
      const returnData = new Map()
      returnData.set('date', this.currentTriggerDate)

      return Promise.resolve({
         status: 200,
         returnData: returnData
      } as ActivityResult)
   }
}
