import ActivityGroup from "../lib/group/ActivityGroup";

export default class Workflow {
   rootGroup: ActivityGroup

   convertToJson(): string
   createFromJson(data: string): Workflow
}
