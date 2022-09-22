import { ActivityEnum, TriggerActivityEnum } from "../../../enums/DesignStructEnum"
import { Id, Name } from "../../GlobalBasicTypes"
import { Param } from "./Param"
import { Position } from "./Position"

export type Activity = {
    id: Id,
    type: ActivityEnum | TriggerActivityEnum,
    name: Name,
    params?: Param[],
    resources?: string[],
    position?: Position
}