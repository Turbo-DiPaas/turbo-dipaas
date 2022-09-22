import {AssetType} from "../enums/DesignStructEnum";
import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {ResourceDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ResourceStruct";

export type AvailableAssetOptions = {
   type: AssetType,
   subtype?: string,
   matchingAssetCatalog?: ActivityDetailsStruct[] | ResourceDetailsStruct[],
}