import {AddressResolver} from "../../types/interface/AddressResolver";
import {Address} from "../../types/struct/Address";
import {ethers} from "ethers";

export default class ENSAddressResolver implements AddressResolver {
   defaultConnection: ethers.providers.Provider

   constructor() {
      this.defaultConnection = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth')
   }

   async resolve(id: string, provider: ethers.providers.Provider = this.defaultConnection): Promise<Address[]> {
      const addresses: Address[] = []
      await provider.resolveName(id).then((v) => {
         if (v) {
            addresses.push({
               id: id,
               type: "ENS",
               address: v
            })
         }
      })

      return addresses;
   }

}