import { TabEnum } from "../../../enums/DesignStructEnum"
import { LongText, Name } from "../../GlobalBasicTypes"
import { FieldStruct } from "./FieldStruct"

export type TabStruct = {
    type: TabEnum
    name: Name,
    description: LongText,
    fields: FieldStruct[]
}