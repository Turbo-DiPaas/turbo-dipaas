import ActivityBase from "../activity/ActivityBase";
import TransitionBase from "../transition/TransitionBase";
import ActivityGroup from "./ActivityGroup";

/**
* Allows to execute Activities as a one context, that is e.g. running multiple blockchain calls and send transactions as one atomic transaction.
* Constructs a smart contract under the hood
*/
export default class ActivityContext extends ActivityGroup {
   constructor(activity: ActivityBase[], transition: TransitionBase[], group: ActivityGroup[] = []) {
      super(activity, transition, group)
   }
}
