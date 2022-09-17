import { CustomDate, Id, LongText, Name } from "../../GlobalBasicTypes";

export type ObjectStruct = {
    id: Id,
    name: Name,
    description: LongText,
    updated: CustomDate
}