import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from '../../WorkflowActivity'
import {ethers} from "ethers";
import EVMABIResource from "../../../../resource/evm/EVMABIResource";
import GenericEVMConnectionResource from "../../../../resource/evm/GenericEVMConnectionResource";

export default class InvokeEVMActivity extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      const abiResource = this.getResource(EVMABIResource)
      const connectionResource = this.getResource(GenericEVMConnectionResource)
      const selectedFunction = params.get('selectedFunction')
      let transactionParams: any[] = params.get('transactionParams')
      const transactionRecipient = params.get('transactionRecipient')
      const abiInterface = new ethers.utils.Interface(JSON.stringify(abiResource?.getABI()))
      const returnData: Map<string, any> = new Map()

      let promiseToResolve = Promise.resolve({
         status: 200,
         returnData,
      } as ActivityResult)

      try {
         const functionToExecute = abiInterface.getFunction(selectedFunction)
         transactionParams = []
         const paramsMap = new Map()

         if (!transactionParams || transactionParams.length === 0) {
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
               to: transactionRecipient
            }).then(v => {
               returnData.set('value', v.value)
               returnData.set('from', v.from)
               returnData.set('data', v.data)
               returnData.set('type', v.type)
               returnData.set('hash', v.hash)
               returnData.set('blockHash', v.blockHash)
               returnData.set('blockNumber', v.blockNumber)
               returnData.set('confirmations', v.confirmations)
               returnData.set('timestamp', v.timestamp)
               returnData.set('chainId', v.chainId)
               returnData.set('gasLimit', v.gasLimit)
               returnData.set('gasPrice', v.gasPrice)
               returnData.set('maxFeePerGas', v.maxFeePerGas)
               returnData.set('maxPriorityFeePerGas', v.maxPriorityFeePerGas)
               returnData.set('nonce', v.nonce)
               returnData.set('to', v.to)

               return Promise.resolve({
                  status: 200,
                  returnData,
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
}
