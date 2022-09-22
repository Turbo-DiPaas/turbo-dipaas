import WorkflowContext from "../../WorkflowContext";
// @ts-ignore
import mozjexl from 'mozjexl';
import {addFunctions} from "./parserFunctions";

addFunctions()

/**
 * At this time
 * @param props props containing placeholders - ${...} - to evaluate
 * @param context current workflow context
 * @returns new map containing evaluated values
 */
const evaluateProps = async (props: Map<string, any>, context: WorkflowContext): Promise<Map<string, any>> => {
   const resultMap: Map<string, any> = new Map()
   const workflowContextObject: any = context.getWorkflowContextObject()
   const evaluationPromises: Promise<any>[] = []

   props.forEach((v, k) => {
      //TODO: check if json stringify always returns proper values
      //TODO: inform user about the error
      try {
         const evalValue = typeof v !== 'string' ? JSON.stringify(v) : v
         evaluationPromises.push(
            mozjexl.eval(evalValue, workflowContextObject).then((res: any) => {
               resultMap.set(k, res)
            })
         )
      } catch(e) {
         console.log(e)
      }
   })

   await Promise.all(evaluationPromises)

   return resultMap
}
export {evaluateProps}