import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {ActivitiesResponseType, ActivityResponseType} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {InputFieldTypeEnum,ResourceEnum} from "../../types/enums/DesignStructEnum";

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
                        "type": InputFieldTypeEnum.FREE_INPUT
                     },
                     {
                        "name": "Input field 2",
                        "type": InputFieldTypeEnum.DROPDOWN,
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
                        "name": "log resource",
                        "type": InputFieldTypeEnum.RESOURCE_REF,
                        "resourceType": ResourceEnum.EVM_CONNECTION
                     },
                     {
                        "name": "name",
                        "type": InputFieldTypeEnum.FREE_INPUT
                     },
                     {
                        "name": "description",
                        "type": InputFieldTypeEnum.FREE_INPUT
                     },
                  ]
               },
               {
                  "type": "Input",
                  "name": "Input mapping",
                  "description": "Input mapping",
                  "fields": [
                     {
                        "name": "message",
                        "type": InputFieldTypeEnum.FREE_INPUT
                     },
                     {
                        "name": "Input field 2",
                        "type": InputFieldTypeEnum.DROPDOWN,
                        "options": [
                           "option1",
                           "option2"
                        ]
                     },
                     {
                        "name": "check",
                        "type": InputFieldTypeEnum.BOOLEAN
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
                        "type": InputFieldTypeEnum.FREE_INPUT
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
