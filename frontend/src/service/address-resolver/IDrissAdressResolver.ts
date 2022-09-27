import {AddressResolver} from "../../types/interface/AddressResolver";
import {IdrissCrypto} from "idriss-crypto/lib/browser";
import {Address} from "../../types/struct/Address";
import {ethers} from "ethers";

export default class IDrissAdressResolver implements AddressResolver {
   resolver: IdrissCrypto

   constructor() {
      this.resolver = new IdrissCrypto()
   }

   async resolve(id: string, provider?: ethers.providers.Provider): Promise<Address[]> {
      const addresses: Address[] = []
      await this.resolver.resolve(id).then((v) => {
         for (let addressType in v) {
            addresses.push({
               id: id,
               type: `IDriss-${addressType}`,
               address: v[addressType]
            })
         }
         // if it's not found, an error is returned
      }).catch((e) => {})

      return addresses;
   }

}