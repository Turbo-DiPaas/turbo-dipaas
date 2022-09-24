import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'
import ResourceBase from "../ResourceBase";
import {AbiType} from "web3-utils";

export default class EVMABIResource extends ResourceBase {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)
   }

   getABI(): string {
      return this.getProperty('abi')
   }
}
