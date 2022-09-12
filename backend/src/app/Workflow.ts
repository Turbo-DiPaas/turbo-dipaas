import ActivityGroup from "../lib/group/ActivityGroup";

export default class Workflow {
   rootGroup: ActivityGroup

   constructor(rootGroup: ActivityGroup) {
      this.rootGroup = rootGroup
   }
}
