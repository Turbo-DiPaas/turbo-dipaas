import WorkflowContext from "../../WorkflowContext";
// @ts-ignore
import mozjexl from 'mozjexl';
import {addFunctions} from "./parserFunctions";
import {getLogger} from "../../logger";

addFunctions()

/**
 * At this time
 * @param props props containing placeholders - ${...} - to evaluate
 * @param context current workflow context
 * @returns new map containing evaluated values
 */
const evaluateProps = async (props: Map<string, any>, context: WorkflowContext): Promise<Map<string, any>> => {
   const resultMap: Map<string, any> = new Map()
   const evaluationPromises: Promise<any>[] = []

   props.forEach((v, k) => {
      // const evalValue = typeof v !== 'string' ? JSON.stringify(v) : v
      evaluationPromises.push(
          evaluateSingleProp(v, context).then((res: any) => {
             resultMap.set(k, res)
          }).catch((e: any) =>{
             // resultMap.set(k, evalValue)
             resultMap.set(k, v)
          })
      )
   })

   await Promise.all(evaluationPromises)

   return resultMap
}

const evaluateSingleProp = async (evaluationParam: any, context: WorkflowContext): Promise<any> => {
   const logger = getLogger()
   const workflowContextObject: any = context.getWorkflowContextObject()
   //TODO: inform user about the error
   const evalValue = typeof evaluationParam !== 'string' ? JSON.stringify(evaluationParam) : evaluationParam
   logger.trace("evaluating val=" + evalValue)
   return mozjexl.eval(evalValue, workflowContextObject).then((res: any) => {
      return res
   }).catch((e: any) =>{
      logger.warning(e.toString())
      return evaluationParam
   })
}

export {evaluateProps, evaluateSingleProp}