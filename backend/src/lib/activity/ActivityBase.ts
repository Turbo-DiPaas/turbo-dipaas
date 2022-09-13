import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'

export default abstract class ActivityBase {
   id: string
   name: string
   resourceIds: string[]
   params: Map<string, any>

   constructor(id: string, name: string, params:Map<string, any> = new Map(), resourceIds: string[] = []) {
      this.id = id
      this.name = name
      this.params = params
      this.resourceIds = resourceIds
   }

   abstract invoke(): Promise<ActivityResult>
}
