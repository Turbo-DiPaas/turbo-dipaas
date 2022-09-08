import { ResourceTypeEnum } from 'turbo-dipaas-common/dist/enums/ResourceTypeEnum'

export default class ResourceBase {
   id: string
   name: string
   type: ResourceTypeEnum
   params: Map<string, any>

   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      this.id = id
      this.name = name
      this.type = type
      this.params = params
   }

   getProperty(id: string): any | undefined {
      this.params.has(id)
         ? this.params.get(id)
         : undefined
   }
}
