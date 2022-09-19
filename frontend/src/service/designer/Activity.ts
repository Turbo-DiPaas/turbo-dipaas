import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {ActivitiesResponseType} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";

const getActivities = async (): Promise<ResponseContent<ActivitiesResponseType>> => {
   return callService<ActivitiesResponseType>('designer/activity')
}

export { getActivities }
