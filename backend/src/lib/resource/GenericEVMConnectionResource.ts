import { ResourceTypeEnum } from 'turbo-dipaas-common/dist/enums/ResourceTypeEnum'
import ResourceBase from "./ResourceBase";

export default class GenericEVMConnectionResource extends ResourceBase {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)
   }

   getPrivateKey(): string {
      return this.getProperty('privateKey')
   }
}
