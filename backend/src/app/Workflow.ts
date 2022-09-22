import ActivityGroup from "../lib/group/ActivityGroup";

export default class Workflow {
   id: string
   rootGroup: ActivityGroup

   constructor(id: string, rootGroup: ActivityGroup) {
      this.id = id
      this.rootGroup = rootGroup
   }
}
