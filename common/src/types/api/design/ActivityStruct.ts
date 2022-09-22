import { ActivityCategoryEnum, ActivityEnum, TriggerActivityEnum } from "../../../enums/DesignStructEnum"
import { DesignResponse } from "./DesignResponse"
import { ObjectStruct } from "./ObjectStruct"
import { StructureStruct } from "./StructureStruct"

export type ActivityStruct = ObjectStruct & {
    category: ActivityCategoryEnum,
    type: ActivityEnum | TriggerActivityEnum
}

export type ActivityDetailsStruct = ActivityStruct & {
    structure: StructureStruct
}

export type ActivitiesResponseType = DesignResponse & {
    activities: ActivityDetailsStruct[];
}

export type ActivityResponseType = DesignResponse & ActivityDetailsStruct