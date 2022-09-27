import {Address} from "../struct/Address";
import {ethers} from "ethers";

export interface AddressResolver {
    resolve(id: string, provider?: ethers.providers.Provider): Promise<Address[]>
}