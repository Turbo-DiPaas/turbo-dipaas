import {AddressResolver} from "../../types/interface/AddressResolver";
import IDrissAdressResolver from "./IDrissAdressResolver";
import {Address} from "../../types/struct/Address";

export default class MultiAddressResolver {
    resolvers: AddressResolver[] = []

    constructor() {
        this.resolvers.push(new IDrissAdressResolver())
    }

    async resolve(id: string): Promise<Address[]> {
        return await this.resolvers[0].resolve(id).then((v) => {
            return v
        });
    }
}