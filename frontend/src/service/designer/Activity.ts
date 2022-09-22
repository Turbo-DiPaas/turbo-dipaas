import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {ActivitiesResponseType, ActivityResponseType} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";

const getActivities = async (): Promise<ResponseContent<ActivitiesResponseType>> => {
   return callService<ActivitiesResponseType>('designer/activities')
}

const getActivity = async (id: string): Promise<ResponseContent<ActivityResponseType>> => {
   return callService<ActivityResponseType>(`designer/activity/${id}`)
}

export { getActivity, getActivities }
