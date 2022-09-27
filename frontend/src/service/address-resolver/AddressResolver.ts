import {AddressResolver} from "../../types/interface/AddressResolver";
import IDrissAdressResolver from "./IDrissAdressResolver";
import {Address} from "../../types/struct/Address";
import {ethers} from "ethers";
import ENSAddressResolver from "./ENSAddressResolver";

export default class MultiAddressResolver {
    resolvers: AddressResolver[] = []

    constructor() {
        this.resolvers.push(new IDrissAdressResolver())
        this.resolvers.push(new ENSAddressResolver())
    }

    async resolve(id: string, provider?: ethers.providers.Provider): Promise<Address[]> {
        const resolversResponse: Promise<Address[]>[] = []
        const resolvedAddresses: Address[] = []

        if (id && id.length > 0) {
            this.resolvers.forEach((v) => {
                const addressPromise = v.resolve(id, provider)
                resolversResponse.push(addressPromise)
                addressPromise.then((v) => {
                    v.forEach((addr) => resolvedAddresses.push(addr))
                })
            })

            await Promise.all(resolversResponse)
        }

        return resolvedAddresses
    }
}