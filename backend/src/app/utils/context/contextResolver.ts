import WorkflowContext from "../../WorkflowContext";

/**
 * At this time
 * @param props props containing placeholders - ${...} - to evaluate
 * @param context current workflow context
 * @returns new map containing evaluated values
 */
const evaluateProps = (props: Map<string, any>, context: WorkflowContext): Map<string, any> => {
   const resultMap: Map<string, any> = new Map()

   props.forEach((v, k) => {
      if (v && typeof v === 'string') {
         const matches = getPlaceholders(v)
         matches.forEach((placeholder) => {
            const [activity, prop] = placeholder.split('.')
            const activityResult = context.getActivityResult(activity)

            v = replacePlaceholder(v, placeholder, activityResult?.returnData.get(prop) ?? '')
         })
         resultMap.set(k, v)
      } else {
         resultMap.set(k, v)
      }
   })

   return resultMap
}

const replacePlaceholder = (txt: string, placeholder: string, substitution: string): string => {
   return txt.replace(`\${${placeholder}}`, substitution)
}

const getPlaceholders = (txt: string): string[] => {
   let regex = /(\${(.+?\..+?)})/g
   let matches = [];
   let match = regex.exec(txt);
   while (match != null) {
      matches.push(match[2]);
      match = regex.exec(txt);
   }

   return matches
}

export {evaluateProps, getPlaceholders}