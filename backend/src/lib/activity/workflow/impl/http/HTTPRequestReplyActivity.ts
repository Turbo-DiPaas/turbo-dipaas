import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from '../../WorkflowActivity'
import HTTPConnectionResource from "../../../../resource/http/HTTPConnectionResource";
import axios from "axios";

export default class HTTPRequestReplyActivity extends WorkflowActivity {

   constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
      super(id, name, params, resourceIds)
   }

   protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
      const connectionResource = this.getResource(HTTPConnectionResource)
      const urlFromParams = this.params.get('url')
      const postData = this.params.get('postData')
      const evaluatedUrl = urlFromParams.trim().startsWith('http') ? urlFromParams : connectionResource?.getUrl()
      const activityResult = {
         status: 200,
         returnData: new Map()
      } as ActivityResult

      return axios.request({
         url: evaluatedUrl,
         method: connectionResource?.getMethod(),
         ...((connectionResource?.getMethod() !== 'GET' && postData?.length > 0) && {data: postData}),
         headers: connectionResource?.getHeaders()
      }).then(response => {
            activityResult.status = response.status
            activityResult.returnData.set('headers', response.headers)

            return response.data
         }).then(response => {
            try {
               const json = typeof response === 'object' ? response : JSON.parse(response)
               activityResult.returnData.set('dataJson', json)
            } catch (e) {
               activityResult.returnData.set('dataRaw', response)
            }

            return activityResult
         }).catch(err => {
            activityResult.error = err

            return activityResult
         })
   }
}
