import {RecursiveTree} from "../../types/struct/RecursiveTree";
import {ActivityEnum, TriggerActivityEnum} from "../../types/enums/DesignStructEnum";
import {activityToContractAbi} from "../evm/abiUtils";
// import {Activity} from "../../../../common/src/types/api/workflow/Activity";
// import {Resource} from "../../../../common/src/types/api/workflow/Resource";

const dataMappers = new Map<string, (any, Resource) => RecursiveTree>()
dataMappers.set(ActivityEnum.MAPPER, mapMapperActivity)
dataMappers.set(ActivityEnum.LOG_ACTIVITY, mapNoOutputActivity)
dataMappers.set(ActivityEnum.NO_OP, mapNoOutputActivity)
dataMappers.set(ActivityEnum.INVOKE_EVM, mapEVMInvokeActivity)
dataMappers.set(ActivityEnum.HTTP_REQUEST_REPLY, mapHTTPRequestReplyActivity)
dataMappers.set(TriggerActivityEnum.SCHEDULER, mapSchedulerActivity)
dataMappers.set(TriggerActivityEnum.EVM_EVENT_SCHEDULER, mapEVMEventSchedulerActivity)

// I had to put "any" due to React whining about external deps
export function mapActivitiesResponse(activity: any[], resources: any[]): RecursiveTree[] {
    return activity.map((v) => { return mapActivityResponse(v, resources) })
}

export function mapActivityResponse(activity: any, resource: any[]): RecursiveTree {
    const mapperFunction = dataMappers.get(activity.type)
    const response = mapperFunction!(activity, resource)
    return {name: `${activity.name} (id: ${activity.id})`, data: response.data}
}

function mapNoOutputActivity(activity: any, resource: any[]): RecursiveTree {
    return {name: '', data: []}
}

function mapMapperActivity(activity: any, resource: any[]): RecursiveTree {
    const resp: RecursiveTree = {name: '', data: []}

    activity.params?.forEach((v) => {
        resp.data?.push({name: v.name, data: null})
    })

    return resp
}

function mapEVMEventSchedulerActivity(activity: any, resource: any[]): RecursiveTree {
    return {name: '', data: [
            {name: 'blockNumber', data: null},
            {name: 'transactionHash', data: null},
            {name: 'eventTopics[]', data: null},
        ]}
}

function mapEVMInvokeActivity(activity: any, resource: any[]): RecursiveTree {
    const resp: RecursiveTree = {name: '', data: []}
    const selectedFunction = activity.params?.find((v) => v.name === 'selectedFunction')?.value

    try {
        const abiInterface = activityToContractAbi(activity, resource)
        if (abiInterface && selectedFunction && selectedFunction.length > 0) {
            const functionToExecute = abiInterface.getFunction(selectedFunction + '')
            const isReadFunction = (functionToExecute.stateMutability === 'view' || functionToExecute.stateMutability === 'pure')

            if (isReadFunction) {
                const callResult: RecursiveTree = {name: 'callResult', data: []}
                functionToExecute.outputs?.forEach((v, i) => {
                    const name = v.name ? v.name : `[${i}] (${v.type})`
                    callResult.data?.push({name: name, data: null})
                })

                resp.data?.push(callResult)
            }

            if (!isReadFunction) {
                resp.data?.push({ name: 'value', data: null})
                resp.data?.push({ name: 'from', data: null})
                resp.data?.push({ name: 'data', data: null})
                resp.data?.push({ name: 'type', data: null})
                resp.data?.push({ name: 'hash', data: null})
                resp.data?.push({ name: 'blockHash', data: null})
                resp.data?.push({ name: 'blockNumber', data: null})
                resp.data?.push({ name: 'confirmations', data: null})
                resp.data?.push({ name: 'timestamp', data: null})
                resp.data?.push({ name: 'chainId', data: null})
                resp.data?.push({ name: 'gasLimit', data: null})
                resp.data?.push({ name: 'gasPrice', data: null})
                resp.data?.push({ name: 'maxFeePerGas', data: null})
                resp.data?.push({ name: 'maxPriorityFeePerGas', data: null})
                resp.data?.push({ name: 'nonce', data: null})
                resp.data?.push({ name: 'to', data: null})
            }
        }
    } catch (e) {
        console.error(e)
    }

    return resp
}


function mapSchedulerActivity(activity: any, resource: any[]): RecursiveTree {
    return {name: '', data: [{name: 'date', data: null},]}
}

function mapHTTPRequestReplyActivity(activity: any, resource: any[]): RecursiveTree {
    return {name: '', data: [
            {name: 'headers{}', data: null},
            {name: 'dataJson{}', data: null},
            {name: 'dataRaw', data: null},
        ]}
}
