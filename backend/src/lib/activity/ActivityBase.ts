import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import {WorkflowProcessState} from "turbo-dipaas-common/src/enums/WorkflowProcessState";
import WorkflowContext from "../../app/WorkflowContext";
import {Constructor} from "../../types/Constructor";
import Container from "typedi";

export default abstract class ActivityBase {
   readonly id: string
   readonly name: string
   resourceIds: string[]
   readonly params: Map<string, any>
   currentState: WorkflowProcessState

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      this.id = id
      this.name = name
      this.params = params
      this.resourceIds = resourceIds
      this.currentState = WorkflowProcessState.Created
   }

   abstract invoke(context: WorkflowContext): Promise<ActivityResult>

   getResource<TFilter>(filterType: Constructor<TFilter>): TFilter | undefined {
      for (let v of this.resourceIds) {
         const resource = Container.get(v)
         if (resource instanceof filterType) {
            return resource
         }
      }

      return undefined
   }
}