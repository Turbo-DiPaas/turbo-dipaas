import { Icon } from "../../GlobalBasicTypes";
import { DesignResponse } from "./DesignResponse";
import { ObjectStruct } from "./ObjectStruct";
import { StructureStruct } from "./StructureStruct";

export type ResourceStruct = ObjectStruct & {
    icon?: Icon
}

export type ResourceDetailsStruct = ResourceStruct & {
    structure: StructureStruct
}

export type ResourcesResponseType = DesignResponse & {
    resources: ResourceStruct[]
}

export type ResourceResponseType = DesignResponse & ResourceDetailsStruct