import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowTriggerBase from '../../WorkflowTriggerBase'
import {evaluateProps} from "../../../../../app/utils/context/contextResolver";
import WorkflowContext from "../../../../../app/WorkflowContext";
import EVMABIResource from "../../../../resource/evm/EVMABIResource";
import GenericEVMConnectionResource from "../../../../resource/evm/GenericEVMConnectionResource";
import {ethers} from "ethers";
import {getLogger} from "../../../../../app/logger";

export default class EVMEventTrigger extends WorkflowTriggerBase {
   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)

      this.logger = getLogger()
   }

   async start(notifyFunction: (res: ActivityResult) => void): Promise<void> {
      try {
         const params = await evaluateProps(this.params, new WorkflowContext())
         const abiResource = this.getResource(EVMABIResource)
         const connectionResource = this.getResource(GenericEVMConnectionResource)
         const eventName = params.get('eventName')
         const eventAddress = params.get('eventAddress')
         const abiInterface = new ethers.utils.Interface(abiResource?.getABI() ?? '')
         const returnData: Map<string, any> = new Map()
         const contract = new ethers.Contract(eventAddress, abiInterface, connectionResource?.getSigner())

         const eventToListenTo = abiInterface.getEvent(eventName)

         const eventSighash = eventToListenTo.format(ethers.utils.FormatTypes.sighash)

         const eventArgsShift = eventToListenTo.anonymous ? 0 : 1

         contract.on(eventSighash, async (...values) => {
            const eventData = values[eventToListenTo.inputs.length]
            const parsedArgs: any[] = []
            eventData.args?.slice(eventArgsShift, eventData.args?.length ?? eventArgsShift)
                .forEach((v: any) => {
               if (v._isBigNumber) {
                  parsedArgs.push(v.toString().trim())
               } else if (typeof v === 'string') {
                  parsedArgs.push(v.trim())
               } else {
                  parsedArgs.push(v)
               }
            })

            this.logger.trace(values)

            returnData.set('blockNumber', eventData.blockNumber)
            returnData.set('transactionHash', eventData.transactionHash)
            returnData.set('eventTopics', parsedArgs)

            let promiseToResolve = Promise.resolve({
               status: 200,
               returnData,
            } as ActivityResult)

            notifyFunction(await this.invoke().then(() => {return promiseToResolve}))
         })
      } catch (e) {
         console.error(e)
         notifyFunction({
            status: 500,
            returnData: new Map(),
            error: e
         } as ActivityResult)
      }
   }

   stop(): Promise<void> {
      return Promise.resolve()
   }

   protected run(params?: Map<string, any>): Promise<ActivityResult> {
      return Promise.resolve({
         status: 200,
         returnData: new Map()
      } as ActivityResult)
   }
}
