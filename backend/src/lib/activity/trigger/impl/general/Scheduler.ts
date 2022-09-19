import {ActivityResult} from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowTriggerBase from '../../WorkflowTriggerBase'
import cron, {ScheduledTask} from 'node-cron'
import {WorkflowProcessState} from "turbo-dipaas-common/src/enums/WorkflowProcessState";
import WorkflowContext from "../../../../../app/WorkflowContext";
import {evaluateProps} from "../../../../../app/utils/context/contextResolver";

export default class Scheduler extends WorkflowTriggerBase {
   currentTriggerDate!: Date
   cronTask?: ScheduledTask

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      const returnData = new Map()
      returnData.set('date', this.currentTriggerDate)

      return Promise.resolve({
         status: 200,
         returnData: returnData
      } as ActivityResult)
   }

   async start(notifyFunction: (res: ActivityResult) => void): Promise<void> {
      const evaluatedParams = await evaluateProps(this.params, new WorkflowContext())
      const cronExpression = evaluatedParams.get('cronExpression')

      if (evaluatedParams.get('runOnce') == true) {
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
}
