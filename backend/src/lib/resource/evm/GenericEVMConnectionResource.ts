import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'
import ResourceBase from "../ResourceBase";
import {Provider} from "@ethersproject/providers";
import {ethers, Signer} from "ethers";

export default class GenericEVMConnectionResource extends ResourceBase {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)

      this.setup()
   }

   setup(): void {
      const privateKey: string = this.getProperty('privateKey')
      const provider = new ethers.providers.JsonRpcProvider(this.getURL())

      if (privateKey && privateKey.startsWith('0x')) {
         const signer = new ethers.Wallet(privateKey, provider)
         this.params.set('provider', signer.provider)
         this.params.set('signer', signer)
      } else {
         this.params.set('provider', provider)
      }
   }

   getURL(): string {
      return this.getProperty('url')
   }

   getProvider(): Provider {
      return this.getProperty('provider')
   }

   getSigner(): Signer {
      return this.getProperty('signer')
   }
}
