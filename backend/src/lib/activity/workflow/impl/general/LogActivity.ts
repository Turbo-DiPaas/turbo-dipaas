import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from '../../WorkflowActivity'
import {Logger} from "../../../../../types/Logger";
import {getLogger} from "../../../../../app/logger";

export default class LogActivity extends WorkflowActivity {
   logger: Logger

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)

      this.logger = getLogger()
   }

   protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      this.logger.info(params.get('message'))

      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
