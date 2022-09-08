import { ActivityResult } from 'turbo-dipaas-common/dist/types/activity/ActivityResult'

export default abstract class ActivityBase {
   id: string
   name: string
   resourceIds: string[]

   constructor(id: string, name: string, resourceIds: string[] = []) {
      this.id = id
      this.name = name
      this.resourceIds = resourceIds
   }


   abstract invoke(): Promise<ActivityResult>
}
