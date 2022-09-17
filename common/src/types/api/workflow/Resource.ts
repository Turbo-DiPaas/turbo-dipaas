import { ResourceEnum } from "../../../enums/DesignStructEnum"
import { Id, Name } from "../../GlobalBasicTypes"
import { Param } from "./Param"

export type Resource = {
    id: Id,
    type: ResourceEnum,
    name: Name,
    params?: Param[]
}