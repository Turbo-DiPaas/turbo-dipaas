import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'
import IdentityResource from './IdentityResource';

export default class PrivateKeyResource extends IdentityResource {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)
   }

   getPrivateKey(): string {
      return this.getProperty('privateKey')
   }
}
