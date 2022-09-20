import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {ActivitiesResponseType, ActivityResponseType} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";

//TODO: remove when backend is working
const activities: ActivitiesResponseType = {
   "updated": "2022-09-01T00:00:00Z",
   "activities": [
      {
         "id": "c9b3bc42-332a-11ed-a261-0242ac120002",
         "name": "Send transaction",
         "description": "send transaction",
         "updated": "2022-09-01T00:00:00Z",
         "category": "General",
         "type": "SendTransaction",
         "structure": {
            "tabs": [
               {
                  "type": "General",
                  "name": "General",
                  "description": "General tab",
                  "fields": [
                     {
                        "name": "Input field 1",
                        "type": 0
                     },
                     {
                        "name": "Input field 2",
                        "type": 0,
                        "options": [
                           "option1",
                           "option2"
                        ]
                     }
                  ]
               }
            ]
         }
      },
      {
         "id": "fcf3fc60-3353-11ed-a261-0242ac120002",
         "name": "Log",
         "description": "logs message to the stdout",
         "updated": "2022-09-01T00:00:00Z",
         "category": "General",
         "type": "LogActivity",
         "structure": {
            "tabs": [
               {
                  "type": "General",
                  "name": "General",
                  "description": "General tab",
                  "fields": [
                     {
                        "name": "message",
                        "type": 0
                     }
                  ]
               }
            ]
         }
      },
      {
         "id": "fcf3fc60-3353-11ed-a261-0242ac120003",
         "name": "Scheduler",
         "description": "schedule trigger",
         "updated": "2022-09-01T00:00:00Z",
         "category": "General",
         "type": "Scheduler",
         "structure": {
            "tabs": [
               {
                  "type": "General",
                  "name": "General",
                  "description": "General tab",
                  "fields": [
                     {
                        "name": "runOnce",
                        "type": 1
                     }
                  ]
               }
            ]
         }
      }
   ]
} as ActivitiesResponseType

const getActivities = async (): Promise<ResponseContent<ActivitiesResponseType>> => {
   // return callService<ActivitiesResponseType>('designer/activity')
   return Promise.resolve({data: activities, status: 200, isOk: true})
}

const getActivity = async (id: string): Promise<ResponseContent<ActivityResponseType>> => {
   return callService<ActivityResponseType>(`designer/activity/${id}`)
}

export { getActivity, getActivities }
