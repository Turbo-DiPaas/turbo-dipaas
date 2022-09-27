import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from '../../WorkflowActivity'
import {ethers} from "ethers";
import EVMABIResource from "../../../../resource/evm/EVMABIResource";
import GenericEVMConnectionResource from "../../../../resource/evm/GenericEVMConnectionResource";
import {getLogger} from "../../../../../app/logger";
import {Logger} from "../../../../../types/Logger";

export default class InvokeEVMActivity extends WorkflowActivity {
   logger: Logger

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)

      this.logger = getLogger()
   }

   protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      const returnData: Map<string, any> = new Map()
      const isRaw = params.get('isRawTransaction') ?? false
      const value = params.get('value') ?? '0'

      let promiseToResolve = Promise.resolve({
         status: 200,
         returnData,
      } as ActivityResult)

      try {
         if (isRaw) {
            return this.handleRawTransaction(params)
         }
         const abiResource = this.getResource(EVMABIResource)
         const connectionResource = this.getResource(GenericEVMConnectionResource)
         const selectedFunction = params.get('selectedFunction')
         let transactionParams: any[] = params.get('transactionParams') ?? []
         const transactionRecipient = params.get('transactionRecipient')
         let abiInterface: ethers.utils.Interface
         try {
            abiInterface = new ethers.utils.Interface(abiResource?.getABI() ?? '')
         } catch (e) {
            return Promise.resolve({
               status: 500,
               returnData,
               error: e
            } as ActivityResult)
         }

         const functionToExecute = abiInterface.getFunction(selectedFunction)
         const paramsMap = new Map()

         if (!transactionParams || transactionParams.length === 0) {
            //@ts-ignore
            functionToExecute?.inputs?.forEach((v, i) => {
               const name = v.name ? v.name : `[${i}] (${v.type})`
               paramsMap.set(name, name)
            })

            for (let [k,v] of params) {
               if (paramsMap.has(k))
               transactionParams.push(v)
            }
         }

         const encodedData = abiInterface.encodeFunctionData(functionToExecute, transactionParams)
         const signer = connectionResource!.getSigner()

         if (functionToExecute.stateMutability !== 'view' && functionToExecute.stateMutability !== 'pure') {
            promiseToResolve = signer.sendTransaction({
               data: encodedData,
               value: value,
               to: transactionRecipient
            }).then(v => {
               this.transactionResponseToMap(returnData, v)

               return Promise.resolve({
                  status: 200,
                  returnData,
               } as ActivityResult)
            }).catch((e) => {
               return Promise.resolve({
                  status: 500,
                  returnData,
                  error: e
               } as ActivityResult)
            })
         } else {
            promiseToResolve = signer.call({
               data: encodedData,
               to: transactionRecipient
            }).then(v => {
               const decodedResult = abiInterface.decodeFunctionResult(functionToExecute, v)
               const decodedResultArr = Array.from(decodedResult)
               for (let i = 0; i < decodedResult.length; i++) {
                  const currElem = decodedResult[i]
                  if (currElem._isBigNumber) {
                     decodedResultArr[i] = currElem.toString()
                  }
               }

               returnData.set('callResult', decodedResultArr)

               return Promise.resolve({
                  status: 200,
                  returnData,
               } as ActivityResult)
            }).catch((e) => {
               return Promise.resolve({
                  status: 500,
                  returnData,
                  error: e
               } as ActivityResult)
            })
         }

      } catch (e) {
         return Promise.resolve({
            status: 500,
            returnData,
            error: e
         } as ActivityResult)
      }

      return promiseToResolve
   }

   private handleRawTransaction(params: Map<string, any> = this.params): Promise<ActivityResult> {
      const value = params.get('value') ?? '0'
      const data = params.get('rawInput') ?? '0x0'
      const to = params.get('transactionRecipient')
      const resultMap = new Map()
      const connectionResource = this.getResource(GenericEVMConnectionResource)
      if (params.get('transactionType') === 'send') {
         const signer = connectionResource?.getSigner()
         signer?.sendTransaction({
            data,
            to,
            value
         }).then((v) => {
            this.transactionResponseToMap(resultMap, v)
         }).catch((e) => {
            return {
               status: 500,
               returnData: resultMap,
               error: e
            } as ActivityResult
         })

      } else {
         const provider = connectionResource?.getProvider()
         provider?.call({
            data,
            to
         }).then((v) => {
            resultMap.set('data', v)
         }).catch((e) => {
            return {
               status: 500,
               returnData: resultMap,
               error: e
            } as ActivityResult
         })
      }

      return Promise.resolve(
         {
            status: 200,
            returnData: resultMap,
         } as ActivityResult
      )
   }

   private transactionResponseToMap(returnData: Map<string, any>, v: ethers.providers.TransactionResponse) {
      returnData.set('value', v.value.toString())
      returnData.set('from', v.from)
      returnData.set('data', v.data)
      returnData.set('type', v.type)
      returnData.set('hash', v.hash)
      returnData.set('blockHash', v.blockHash)
      returnData.set('blockNumber', v.blockNumber)
      returnData.set('confirmations', v.confirmations)
      returnData.set('timestamp', v.timestamp)
      returnData.set('chainId', v.chainId)
      returnData.set('gasLimit', v.gasLimit.toString())
      returnData.set('gasPrice', v.gasPrice)
      // @ts-ignore
      returnData.set('maxFeePerGas', v.maxFeePerGas.toString())
      // @ts-ignore
      returnData.set('maxPriorityFeePerGas', v.maxPriorityFeePerGas.toString())
      returnData.set('nonce', v.nonce)
      returnData.set('to', v.to)
   }
}
