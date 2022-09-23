import {Address} from "../struct/Address";

export interface AddressResolver {
    resolve(id: string): Promise<Address[]>
}