import { InputFieldTypeEnum, ResourceEnum } from "../../../enums/DesignStructEnum"
import { Name, OptionList } from "../../GlobalBasicTypes"

export type FieldBaseStruct = {
    name: Name,
    displayName: Name
}

export type InputFieldStruct = FieldBaseStruct & {
    type: InputFieldTypeEnum
}

export type SelectFieldStruct = InputFieldStruct & {
    options: OptionList
}

export type ResourceSelectFieldStruct = InputFieldStruct & {
    resourceType: ResourceEnum
}

export type FieldStruct = InputFieldStruct | SelectFieldStruct | ResourceSelectFieldStruct