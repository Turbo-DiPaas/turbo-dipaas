import ActivityBase from '../ActivityBase'
import {ActivityResult} from "turbo-dipaas-common/src/types/activity/ActivityResult";

export default abstract class WorkflowTriggerBase extends ActivityBase {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   //TODO: think about using RxJS Observables
   abstract start(notifyFunction: (res: ActivityResult) => void): Promise<void>
   abstract stop(): Promise<void>
}
