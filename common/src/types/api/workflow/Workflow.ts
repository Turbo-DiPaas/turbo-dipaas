import { CustomDate, Id, LongText, Name } from "../../GlobalBasicTypes"
import { Activity } from "./Activity"
import { Resource } from "./Resource"
import { Transition } from "./Transition"

export type Structure = {
    activities?: Activity[],
    transitions?: Transition[],
    resources?: Resource[]
}

export type Workflow = {
    id: Id,
    name: Name,
    description?: LongText,
    updated: CustomDate,
    structure: Structure
}