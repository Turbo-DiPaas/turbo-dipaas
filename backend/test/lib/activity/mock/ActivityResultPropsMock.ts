import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from "../../../../src/lib/activity/workflow/WorkflowActivity";

export default class ActivityResultPropsMock extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   protected run(): Promise<ActivityResult> {
      const resultMap = new Map()
      resultMap.set('name', 'props mock')
      resultMap.set('value', 250)
      resultMap.set('longText', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum, risus id tempor dignissim, nunc dui placerat est, porta faucibus dui ante sagittis quam. Sed dolor neque, sodales vitae magna vel, auctor placerat lorem. Curabitur pretium pellentesque sapien accumsan sollicitudin. Class aptent taciti sociosqu ad litora torquent per conubia nostra.')
      resultMap.set('check', true)

      return Promise.resolve({
         status: 200,
         returnData: resultMap
      } as ActivityResult)
   }
}
