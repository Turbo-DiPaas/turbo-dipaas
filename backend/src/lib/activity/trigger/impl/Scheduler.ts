import {ActivityResult} from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowTriggerBase from '../WorkflowTriggerBase'
import cron, {ScheduledTask} from 'node-cron'
import {WorkflowProcessState} from "turbo-dipaas-common/src/enums/WorkflowProcessState";
import WorkflowContext from "../../../../app/WorkflowContext";

export default class Scheduler extends WorkflowTriggerBase {
   currentTriggerDate!: Date
   cronTask?: ScheduledTask

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   async start(notifyFunction: (res: ActivityResult) => void): Promise<void> {
      this.currentState = WorkflowProcessState.Running
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

      this.currentState = WorkflowProcessState.Finished
   }

   invoke(context: WorkflowContext = new WorkflowContext()): Promise<ActivityResult> {
      const returnData = new Map()
      returnData.set('date', this.currentTriggerDate)

      return Promise.resolve({
         status: 200,
         returnData: returnData
      } as ActivityResult)
   }
}
