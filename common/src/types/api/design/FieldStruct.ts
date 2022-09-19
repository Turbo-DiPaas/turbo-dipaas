import { InputFieldTypeEnum, ResourceEnum, SelectFieldTypeEnum } from "../../../enums/DesignStructEnum"
import { Name, OptionList } from "../../GlobalBasicTypes"

export type FieldBaseStruct = {
    name: Name
}

export type InputFieldStruct = FieldBaseStruct & {
    type: InputFieldTypeEnum
}
export type SelectFieldStruct = FieldBaseStruct & {
    type: SelectFieldTypeEnum
    options: OptionList
}

export type ResourceSelectFieldStruct = FieldBaseStruct & {
    type: SelectFieldTypeEnum
    resourceType: ResourceEnum
}

export type FieldStruct = InputFieldStruct | SelectFieldStruct