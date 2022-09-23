import {RecursiveTree} from "../../types/struct/RecursiveTree";
import {ActivityEnum, TriggerActivityEnum} from "../../types/enums/DesignStructEnum";
import {ethers} from "ethers";
// import {Activity} from "../../../../common/src/types/api/workflow/Activity";
// import {Resource} from "../../../../common/src/types/api/workflow/Resource";
import {ResourceEnum} from "../../types/enums/DesignStructEnum";

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
    return {name: `${activity.name} (${activity.id})`, data: response.data}
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
    const activityResourcesMap = new Map()
    activity.resources?.forEach((v) => activityResourcesMap.set(v, v))

    const abiResource = resource
        .filter((v) => v.type === 'EVMABIResource')
        // const abiResource = x
        .find((v) => activityResourcesMap.has(v.id))

    const abi = abiResource?.params?.find((v) => v.name === 'abi')

    const selectedFunction = activity.params?.find((v) => v.name === 'selectedFunction')?.value

    if (abi && selectedFunction && (selectedFunction as string).length > 0) {
        try {
            const abiInterface = new ethers.utils.Interface(abi.value + '')
            const functionToExecute = abiInterface.getFunction(selectedFunction + '')

            functionToExecute.outputs?.forEach((v, i) => {
                const name = v.name ? v.name : `[${i}] (${v.type})`
                resp.data?.push({name: name, data: null})
            })
        } catch (e) {
            console.error(e)
        }
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
