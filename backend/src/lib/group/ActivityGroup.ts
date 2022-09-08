import ActivityBase from "../activity/ActivityBase";
import TransitionBase from "../transition/TransitionBase";

/**
* Groups activities and transitions between them. Each group can contain children groups.
*/
export default class ActivityGroup {
   activity: ActivityBase[]
   transition: TransitionBase[]
   group: ActivityGroup[]

   constructor(activity: ActivityBase[], transition: TransitionBase[], group: ActivityGroup[] = []) {
      this.activity = activity
      this.transition = transition
      this.group = group
   }
}
