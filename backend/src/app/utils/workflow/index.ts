import Workflow from "../../Workflow";
import ActivityGroup from "../../../lib/group/ActivityGroup";

//TODO: implement
const convertToJson = (workflow: Workflow): string => {
    return JSON.stringify(workflow)
}

const createFromJson = (data: string): Workflow => {
    return new Workflow(new ActivityGroup([], [], []))
}

export { convertToJson, createFromJson }
