import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'

export default class ResourceBase {
   readonly id: string
   readonly name: string
   readonly type: ResourceTypeEnum
   protected readonly params: Map<string, any>

   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      this.id = id
      this.name = name
      this.type = type
      this.params = params
   }

   getProperty(id: string): any | undefined {
      return this.params.get(id)
   }
}
