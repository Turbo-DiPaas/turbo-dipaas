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
   const logger = getLogger()
   const resultMap: Map<string, any> = new Map()
   const workflowContextObject: any = context.getWorkflowContextObject()
   const evaluationPromises: Promise<any>[] = []


   props.forEach((v, k) => {
      //TODO: inform user about the error
      const evalValue = typeof v !== 'string' ? JSON.stringify(v) : v
      logger.trace("evaluating prop " + k + " with val=" + evalValue)
      evaluationPromises.push(
          mozjexl.eval(evalValue, workflowContextObject).then((res: any) => {
             resultMap.set(k, res)
          }).catch((e: any) =>{
             logger.error(e.toString())
             resultMap.set(k, evalValue)
          })
      )
   })

   await Promise.all(evaluationPromises)

   return resultMap
}
export {evaluateProps}