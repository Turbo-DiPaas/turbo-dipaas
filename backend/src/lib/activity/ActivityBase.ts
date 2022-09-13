import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import {WorkflowProcessState} from "turbo-dipaas-common/src/enums/WorkflowProcessState";
import WorkflowContext from "../../app/WorkflowContext";

export default abstract class ActivityBase {
   id: string
   name: string
   resourceIds: string[]
   params: Map<string, any>
   currentState: WorkflowProcessState

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      this.id = id
      this.name = name
      this.params = params
      this.resourceIds = resourceIds
      this.currentState = WorkflowProcessState.Created
   }

   abstract invoke(context: WorkflowContext): Promise<ActivityResult>
}