import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'
import {ethers} from "ethers";
import GenericEVMConnectionResource from "../../../src/lib/resource/evm/GenericEVMConnectionResource";

export default class GenericEVMConnectionResourceMock extends GenericEVMConnectionResource {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)

      this.setup()
   }

   setup(): void {
      const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'))
      this.params.set('provider', signer.provider)
      this.params.set('signer', signer)
   }
}
