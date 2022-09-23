import {ethers} from "ethers";
import {Activity} from "../../../../common/src/types/api/workflow/Activity";
import {Resource} from "../../../../common/src/types/api/workflow/Resource";
import {FormatTypes} from "ethers/lib/utils";

export function activityToContractAbi(activity: any, resource: any[]): ethers.utils.Interface | undefined {
    const activityResourcesMap = new Map()
    activity?.resources?.forEach((v) => activityResourcesMap.set(v, v))

    const abiResource = resource
        .filter((v) => v.type === 'EVMABIResource')
        .find((v) => activityResourcesMap.has(v.id))

    const abi = abiResource?.params?.find((v) => v.name === 'abi')

    if (abi) {
        try {
            return new ethers.utils.Interface(abi.value + '')
        } catch (e) {
            console.error(e)
        }
    }

    return undefined
}

export function getAvailableContractFunctions(activity: Activity, resource: Resource[]): string[] {
    const abiInterface = activityToContractAbi(activity, resource)
    const functions = abiInterface?.fragments?.filter((v) => v.type === 'function')
    const functionsSighashes = functions?.map((v) => {return v.format(FormatTypes.sighash)})
    return Array.from(functionsSighashes ?? [])
}