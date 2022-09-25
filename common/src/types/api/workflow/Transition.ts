import {TransitionType} from "../../../enums/DesignStructEnum";

export type Transition = {
    id: string
    type: TransitionType
    from: string
    to: string
    condition?: string
}