import { Icon } from "../../GlobalBasicTypes";
import { DesignResponse } from "./DesignResponse";
import { ObjectStruct } from "./ObjectStruct";
import { StructureStruct } from "./StructureStruct";
import {
    ResourceCategoryEnum, ResourceEnum,
    TriggerActivityEnum
} from "../../../enums/DesignStructEnum";

export type ResourceStruct = ObjectStruct & {
    icon: Icon,
    category: ResourceCategoryEnum,
    type: ResourceEnum
}

export type ResourceDetailsStruct = ResourceStruct & {
    structure: StructureStruct
}

export type ResourcesResponseType = DesignResponse & {
    resources: ResourceDetailsStruct[]
}

export type ResourceResponseType = DesignResponse & ResourceDetailsStruct