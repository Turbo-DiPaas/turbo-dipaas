import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {ResourcesResponseType} from "../../../../common/src/types/api/design/ResourceStruct";


const getResources = async (): Promise<ResponseContent<ResourcesResponseType>> => {
   return callService<ResourcesResponseType>('designer/resources')
}

export { getResources }
